const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  const margin = 50;
  const lineHeight = 16;
  let y = height - margin;

  const drawText = (text, options = {}) => {
    const font = options.bold ? timesRomanBold : timesRoman;
    const size = options.size || 12;
    page.drawText(text, {
      x: options.x || margin,
      y: y,
      size: size,
      font: font,
      color: rgb(0, 0, 0),
    });
    y -= options.spacing || lineHeight;
  };

  // Title
  drawText('MINUTES OF THE ANNUAL GENERAL MEETING', { bold: true, size: 14, spacing: 20 });
  drawText('THE OWNERS – STRATA PLAN NO. 92841', { bold: true, size: 12, spacing: 18 });
  drawText('ADDRESS: 12 Example Street, MARRICKVILLE NSW 2204', { spacing: 18 });
  drawText('DATE HELD: 15 November 2024', { spacing: 30 });

  // Present
  drawText('PRESENT:', { bold: true, spacing: 18 });
  drawText('Lot 1 (N. Smith), Lot 2 (J. Doe), Lot 4 (Proxy to Chair).', { spacing: 30 });

  // Motion 1
  drawText('MOTION 1: MINUTES', { bold: true, spacing: 18 });
  drawText('RESOLVED that the minutes of the last general meeting held on 10 November 2023', { spacing: 16 });
  drawText('be confirmed.', { spacing: 30 });

  // Motion 2
  drawText('MOTION 2: FINANCIAL STATEMENTS', { bold: true, spacing: 18 });
  drawText('RESOLVED that the financial statements for the period ended 30 June 2024 be adopted.', { spacing: 18 });
  drawText('The Treasurer reported the following balances as of today:', { spacing: 18 });
  drawText('- Administrative Fund: $14,250.85', { x: margin + 20, spacing: 16 });
  drawText('- Capital Works Fund: $65,100.00 (formerly Sinking Fund)', { x: margin + 20, spacing: 30 });

  // Motion 3
  drawText('MOTION 3: INSURANCES', { bold: true, spacing: 18 });
  drawText('RESOLVED to confirm the following insurance policies:', { spacing: 18 });
  drawText('- Policy No: HUS-998877', { x: margin + 20, spacing: 16 });
  drawText('- Insurer: CHU Underw', { x: margin + 20, spacing: 16 });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('test_agm_minutes.pdf', pdfBytes);
  console.log('PDF generated: test_agm_minutes.pdf');
}

generatePDF().catch(console.error);
