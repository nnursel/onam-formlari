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
    windowWidth: formElement.scrollWidth,
    windowHeight: formElement.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pdfWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
  let heightLeft = imgHeight - (pdfHeight - margin * 2);

  while (heightLeft > 0) {
    const position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - margin * 2;
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
