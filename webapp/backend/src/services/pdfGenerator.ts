import PDFDocument from 'pdfkit';
import path from 'path';

function sum(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}

export function generatePDF(userId: string, name: string, dateFrom: string,dateTo: string,units: string, cost: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    // Handling data event to collect PDF parts
    doc.on('data', (chunk) => {
      buffers.push(chunk);
    });

    // Handling end event to resolve promise with complete PDF
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });

    // Handling error event
    doc.on('error', (err) => {
      reject(err);
    });
    // Define the header color
    // Define the header color
    const columnWidths = [100, 100, 100, 100]; // Adjust as needed
    const rowHeight = 30;
    const tableWidth = sum(columnWidths);
    const tableStartX = (doc.page.width - tableWidth) / 2;

    function drawTableHeader(text: string, x: number, width: number, y: number): void {
      doc.fontSize(10).fillColor('black').text(text, x, y, { width: width, align: 'center' });
      doc.rect(x, y, width, rowHeight).stroke();
    }
    
    function drawTableCell(content: string | number, x: number, width: number, y: number): void {
      doc.fontSize(10).fillColor('black').text(content.toString(), x, y + 5, { width: width, align: 'center' });
      doc.rect(x, y, width, rowHeight).stroke();
    }
    const headerColor = '#1976D2';
    const headers = ['Date From', 'Date To', 'Units Consumed', 'Total Cost']
    // Draw the header with the specified color
    doc.rect(0, 0, doc.page.width, 80).fill(headerColor);

    // Calculate the X position for the logo and the title
    const logoX = doc.page.width / 2 - 80;
    const titleX = doc.page.width / 2 - 215;

    // Add the logo image
    const logoPath = path.join(__dirname, '../../public/images/logo.png'); // Ensure the path is correct
    doc.image(logoPath, logoX, 18, { height:40 });

    // Add the "POWERHUB" text next to the logo
    doc.fillColor('#FFFFFF') // White color for the text
       .fontSize(22)
       .font('Helvetica-Bold')
       .text('POWERHUB', titleX, 32, { align: 'center' });

    // Ensure the rest of the content starts below the header
    doc.y = 150;
    doc.fillColor('#000000'); // Reset text color to black for the main content

    // User Information
    doc.fontSize(12)
       .text(`Name: ${name}`, { continued: true })
       .text(`User ID: ${userId}`, { align: 'right' });

    doc.moveDown(2);

       const startY = doc.y;
      headers.forEach((header, index) => {
        const x = tableStartX + sum(columnWidths.slice(0, index));
        drawTableHeader(header, x, columnWidths[index], startY);
      });
      const numericCost = typeof cost === 'number' ? cost : parseFloat(cost);
      const dataY = startY + rowHeight; // Adjusted for increased rowHeight
      drawTableCell(dateFrom, tableStartX, columnWidths[0], dataY);
      drawTableCell(dateTo, tableStartX + columnWidths[0], columnWidths[1], dataY);
      drawTableCell(units, tableStartX + sum(columnWidths.slice(0, 2)), columnWidths[2], dataY);
      drawTableCell(`$${numericCost.toFixed(2)}`, tableStartX + sum(columnWidths.slice(0, 3)), columnWidths[3], dataY);
    // Footer
    doc.moveDown(2)
       .fontSize(10)
       .text('Thank you for using our services.', { align: 'center', lineBreak: false });

    // Finalize the PDF document
    doc.end();
  });
}