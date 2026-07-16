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

  const canvas = await html2canvas(formElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    onclone: (_doc, cloned) => {
      const origFields = formElement.querySelectorAll('input, textarea, select');
      const clonedFields = cloned.querySelectorAll('input, textarea, select');
      origFields.forEach((orig, i) => {
        const el = clonedFields[i] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (el) el.value = (orig as HTMLInputElement).value;
      });
    },
  });

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

/** Download PDF to local computer. */
export async function exportFormToPDF(
  formElement: HTMLElement,
  formId: string,
  tc?: string,
  adSoyad?: string,
): Promise<void> {
  const { pdf, filename } = await buildPDF(formElement, formId, tc, adSoyad);
  pdf.save(filename);
}

/** Build PDF and return blob + filename (for Drive upload). */
export async function buildFormPDFBlob(
  formElement: HTMLElement,
  formId: string,
  tc?: string,
  adSoyad?: string,
): Promise<ExportResult> {
  const { pdf, filename } = await buildPDF(formElement, formId, tc, adSoyad);
  return { blob: pdf.output('blob'), filename };
}
