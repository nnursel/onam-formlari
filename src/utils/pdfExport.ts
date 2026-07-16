import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportResult {
  blob: Blob;
  filename: string;
}

async function buildPDF(
  formElement: HTMLElement,
  _formId: string,
  tc?: string,
  adSoyad?: string,
): Promise<{ pdf: jsPDF; filename: string }> {
  const safeName = (adSoyad ?? '').trim().replace(/\s+/g, '_').toUpperCase() || 'HASTA';
  const safeTC = (tc ?? '').trim() || 'TC';
  const filename = `${safeTC}_${safeName}.pdf`;

  // Read canvas data BEFORE html2canvas (mobile scroll/keyboard can clear canvas later)
  const canvasSnapshots = Array.from(formElement.querySelectorAll('canvas')).map((c) => {
    try { return (c as HTMLCanvasElement).toDataURL('image/png'); } catch { return ''; }
  });

  // Tag fillable fields so we can find them in the clone
  const textEls = Array.from(
    formElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="radio"]):not([type="checkbox"]), textarea'
    )
  );
  textEls.forEach((el, i) => el.setAttribute('data-pdf-i', String(i)));

  const radioEls = Array.from(
    formElement.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')
  );
  radioEls.forEach((el, i) => el.setAttribute('data-pdf-r', String(i)));

  const canvas = await html2canvas(formElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    windowWidth: 1200,
    windowHeight: formElement.scrollHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (_doc, cloned) => {
      // Hide UI-only buttons (Temizle, Sifirla vb.)
      cloned.querySelectorAll('button').forEach((btn) => {
        (btn as HTMLElement).style.display = 'none';
      });

      // Replace each text input / textarea with a styled div showing the actual value
      cloned.querySelectorAll<HTMLElement>('[data-pdf-i]').forEach((clonedEl) => {
        const idx = Number(clonedEl.getAttribute('data-pdf-i'));
        const origEl = textEls[idx];
        if (!origEl) return;

        const value = origEl.value;
        const cs = window.getComputedStyle(origEl);
        const isTextarea = origEl.tagName === 'TEXTAREA';

        const div = document.createElement('div');
        div.textContent = value;
        div.style.width = cs.width;
        div.style.minHeight = cs.height;
        div.style.padding = cs.padding;
        div.style.border = cs.border;
        div.style.borderRadius = cs.borderRadius;
        div.style.fontSize = cs.fontSize;
        div.style.fontFamily = cs.fontFamily;
        div.style.color = '#1a3a6b';
        div.style.backgroundColor = cs.backgroundColor || '#ffffff';
        div.style.boxSizing = 'border-box';
        div.style.overflow = 'hidden';
        if (isTextarea) {
          div.style.whiteSpace = 'pre-wrap';
          div.style.alignItems = 'flex-start';
        } else {
          div.style.display = 'flex';
          div.style.alignItems = 'center';
          div.style.whiteSpace = 'nowrap';
        }

        clonedEl.parentNode?.replaceChild(div, clonedEl);
      });

      // Sync radio / checkbox checked state
      cloned.querySelectorAll<HTMLInputElement>('[data-pdf-r]').forEach((clonedEl) => {
        const idx = Number(clonedEl.getAttribute('data-pdf-r'));
        const origEl = radioEls[idx];
        if (origEl) clonedEl.checked = origEl.checked;
      });

      // Replace canvases with pre-captured snapshots (avoids mobile canvas clearing)
      cloned.querySelectorAll('canvas').forEach((clonedCanvas, i) => {
        const dataUrl = canvasSnapshots[i];
        if (!dataUrl) return;
        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'block';
        clonedCanvas.parentNode?.replaceChild(img, clonedCanvas);
      });
    },
  });

  // Remove temporary attributes
  textEls.forEach((el) => el.removeAttribute('data-pdf-i'));
  radioEls.forEach((el) => el.removeAttribute('data-pdf-r'));

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pdfWidth - margin * 2;
  const usableHeight = pdfHeight - margin * 2;
  const totalImgHeightMM = (canvas.height * usableWidth) / canvas.width;

  let remainingMM = totalImgHeightMM;
  let sourceY = 0;
  let isFirstPage = true;

  while (remainingMM > 0) {
    if (!isFirstPage) pdf.addPage();

    const sliceHeightMM = Math.min(remainingMM, usableHeight);
    const sliceHeightPx = Math.round((sliceHeightMM / totalImgHeightMM) * canvas.height);

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeightPx;
    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
    }

    const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92);
    pdf.addImage(sliceData, 'JPEG', margin, margin, usableWidth, sliceHeightMM);

    sourceY += sliceHeightPx;
    remainingMM -= sliceHeightMM;
    isFirstPage = false;
  }

  return { pdf, filename };
}

export async function exportFormToPDF(
  formElement: HTMLElement,
  formId: string,
  tc?: string,
  adSoyad?: string,
): Promise<void> {
  const { pdf, filename } = await buildPDF(formElement, formId, tc, adSoyad);
  pdf.save(filename);
}

export async function buildFormPDFBlob(
  formElement: HTMLElement,
  formId: string,
  tc?: string,
  adSoyad?: string,
): Promise<ExportResult> {
  const { pdf, filename } = await buildPDF(formElement, formId, tc, adSoyad);
  return { blob: pdf.output('blob'), filename };
}
