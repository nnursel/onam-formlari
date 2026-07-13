import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportFormToPDF(formElement: HTMLElement, formTitle: string): Promise<void> {
  const filename = `${formTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Show loading state
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

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
  heightLeft -= (pdfHeight - margin * 2);

  // Add additional pages if content overflows
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - margin * 2);
  }

  pdf.save(filename);
}
