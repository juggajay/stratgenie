/**
 * Generate Strata Roll Templates (XLSX and PDF)
 * Run with: node scripts/generate-strata-roll-templates.js
 */

const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'downloads');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============================================================================
// EXCEL TEMPLATE
// ============================================================================
function generateExcelTemplate() {
  const workbook = XLSX.utils.book_new();

  // Main Strata Roll sheet
  const strataRollData = [
    // Header row with column names
    [
      'Lot Number',
      'Unit Entitlement',
      'Owner Full Name',
      'Owner Email',
      'Owner Phone',
      'Correspondence Address',
      'Correspondence Suburb',
      'Correspondence State',
      'Correspondence Postcode',
      'Owner Occupier (Y/N)',
      'Tenant Name',
      'Tenant Email',
      'Tenant Phone',
      'Agent Name',
      'Agent Company',
      'Agent Email',
      'Agent Phone',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Parking Space No.',
      'Storage Locker No.',
      'Last Updated',
      'Notes'
    ],
    // Sample rows (10 lots)
    ['1', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['3', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['4', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['5', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['6', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['7', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['8', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['9', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['10', '100', '', '', '', '', '', 'NSW', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ];

  const strataRollSheet = XLSX.utils.aoa_to_sheet(strataRollData);

  // Set column widths
  strataRollSheet['!cols'] = [
    { wch: 10 },  // Lot Number
    { wch: 14 },  // Unit Entitlement
    { wch: 25 },  // Owner Full Name
    { wch: 30 },  // Owner Email
    { wch: 15 },  // Owner Phone
    { wch: 35 },  // Correspondence Address
    { wch: 20 },  // Correspondence Suburb
    { wch: 8 },   // State
    { wch: 10 },  // Postcode
    { wch: 15 },  // Owner Occupier
    { wch: 25 },  // Tenant Name
    { wch: 30 },  // Tenant Email
    { wch: 15 },  // Tenant Phone
    { wch: 20 },  // Agent Name
    { wch: 25 },  // Agent Company
    { wch: 30 },  // Agent Email
    { wch: 15 },  // Agent Phone
    { wch: 25 },  // Emergency Contact Name
    { wch: 18 },  // Emergency Contact Phone
    { wch: 15 },  // Parking Space
    { wch: 15 },  // Storage Locker
    { wch: 12 },  // Last Updated
    { wch: 40 },  // Notes
  ];

  XLSX.utils.book_append_sheet(workbook, strataRollSheet, 'Strata Roll');

  // Instructions sheet
  const instructionsData = [
    ['NSW STRATA ROLL TEMPLATE - INSTRUCTIONS'],
    [''],
    ['LEGAL REQUIREMENT:'],
    ['Under Section 178 of the Strata Schemes Management Act 2015 (NSW), every owners corporation'],
    ['must maintain a strata roll containing current details of all lot owners.'],
    [''],
    ['UPDATE REQUIREMENTS:'],
    ['- The strata roll must be updated within 14 days of receiving notification of any change'],
    ['- New owners must notify the owners corporation of their details within one month of purchase'],
    [''],
    ['REQUIRED FIELDS:'],
    ['- Lot number and unit entitlement'],
    ['- Name of each owner (all owners if jointly owned)'],
    ['- Address for service of notices on the owner'],
    ['- Whether the lot is owner-occupied or tenanted'],
    [''],
    ['RECOMMENDED ADDITIONAL FIELDS:'],
    ['- Emergency contact details'],
    ['- Agent/property manager details (if tenanted)'],
    ['- Parking and storage allocations'],
    [''],
    ['PRIVACY:'],
    ['- Personal information must be handled in accordance with privacy laws'],
    ['- The strata roll may be inspected by lot owners on request'],
    ['- Copies may be provided for a reasonable fee'],
    [''],
    ['PENALTIES:'],
    ['- Failure to maintain a strata roll may result in penalties under the Act'],
    ['- Ensure all information is kept current and accurate'],
    [''],
    [''],
    ['For more strata compliance help, visit: https://stratagenie.com.au'],
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Write file
  const xlsxPath = path.join(outputDir, 'strata-roll-template.xlsx');
  XLSX.writeFile(workbook, xlsxPath);
  console.log('Created:', xlsxPath);
}

// ============================================================================
// PDF TEMPLATE
// ============================================================================
function generatePDFTemplate() {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 40
  });

  const pdfPath = path.join(outputDir, 'strata-roll-template.pdf');
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // Colors
  const headerBg = '#10b981';
  const headerText = '#ffffff';
  const darkText = '#1e293b';
  const lightText = '#64748b';
  const borderColor = '#e2e8f0';

  // Header
  doc.rect(0, 0, doc.page.width, 80).fill(headerBg);
  doc.fontSize(24).fillColor(headerText).text('NSW Strata Roll', 40, 25, { align: 'left' });
  doc.fontSize(11).text('Compliant with Strata Schemes Management Act 2015 (NSW)', 40, 52);

  // Scheme details section
  doc.fillColor(darkText);
  doc.fontSize(12).text('Scheme Details', 40, 100);
  doc.fontSize(10).fillColor(lightText);
  doc.text('Strata Plan Number: SP _____________', 40, 120);
  doc.text('Scheme Name: ___________________________________', 40, 140);
  doc.text('Scheme Address: ___________________________________', 40, 160);
  doc.text('Total Lots: _______    Total Unit Entitlement: _______', 40, 180);

  // Table header
  const tableTop = 220;
  const tableLeft = 40;
  const colWidths = [40, 50, 100, 120, 70, 100, 100, 80];
  const headers = ['Lot', 'Entitle-\nment', 'Owner Name', 'Correspondence\nAddress', 'Phone', 'Tenant/Agent', 'Emergency\nContact', 'Notes'];

  // Draw header row
  let xPos = tableLeft;
  doc.rect(tableLeft, tableTop, doc.page.width - 80, 35).fill('#f1f5f9');
  doc.fillColor(darkText).fontSize(8);

  headers.forEach((header, i) => {
    doc.text(header, xPos + 3, tableTop + 5, { width: colWidths[i] - 6, align: 'left' });
    xPos += colWidths[i];
  });

  // Draw table rows
  const rowHeight = 35;
  for (let row = 0; row < 10; row++) {
    const rowTop = tableTop + 35 + (row * rowHeight);
    xPos = tableLeft;

    // Row background
    if (row % 2 === 1) {
      doc.rect(tableLeft, rowTop, doc.page.width - 80, rowHeight).fill('#fafafa');
    }

    // Cell borders
    doc.strokeColor(borderColor).lineWidth(0.5);
    colWidths.forEach((width) => {
      doc.rect(xPos, rowTop, width, rowHeight).stroke();
      xPos += width;
    });

    // Lot number
    doc.fillColor(darkText).fontSize(9);
    doc.text((row + 1).toString(), tableLeft + 3, rowTop + 12, { width: colWidths[0] - 6 });
  }

  // Legal notice
  const legalTop = tableTop + 35 + (10 * rowHeight) + 20;
  doc.fillColor(lightText).fontSize(8);
  doc.text('Legal Requirement: Under Section 178 of the Strata Schemes Management Act 2015 (NSW), the owners corporation must maintain a strata roll and update it within 14 days of notification of any change.', tableLeft, legalTop, { width: doc.page.width - 80 });

  // Footer
  doc.fontSize(8).fillColor(lightText);
  doc.text('Generated by StrataGenie - https://stratagenie.com.au', 40, doc.page.height - 40);
  doc.text('Page 1 of 1', doc.page.width - 120, doc.page.height - 40);

  doc.end();

  stream.on('finish', () => {
    console.log('Created:', pdfPath);
  });
}

// Run generators
console.log('Generating strata roll templates...');
generateExcelTemplate();
generatePDFTemplate();
console.log('Done!');
