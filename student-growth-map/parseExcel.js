import fs from 'fs';
import ExcelJS from 'exceljs';

async function generateData() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('Data for IT sector.xlsx');

  // Helper to convert sheet rows into standard JSON objects
  function getSheetData(sheetName) {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) return [];
    const rows = [];
    const headers = [];
    
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNum) => { headers[colNum] = cell.text; });
      } else {
        const rowData = {};
        row.eachCell((cell, colNum) => { rowData[headers[colNum]] = cell.text; });
        rows.push(rowData);
      }
    });
    return rows;
  }

  const skillsSheet = getSheetData('Skills');
  const rolesSheet = getSheetData('Roles');
  const prereqSheet = getSheetData('Skill Prerequisites (Skill-to-S');

  // Normalize data structures
  const SKILLS = skillsSheet.map(s => ({
    id: String(s['Skill ID'] || ''),
    name: String(s['Name'] || ''),
    category: String(s['Category'] || ''),
    tier: String(s['Skill Tier'] || ''),
    docUrl: String(s['Learning Resource URL'] || '#')
  }));

  const ROLES = rolesSheet.map(r => ({
    id: String(r['Role ID'] || ''),
    title: String(r['Title'] || ''),
    domain: String(r['Domain'] || ''),
    requiredSkills: String(r['Required Skill IDs'] || '').split(',').map(s => s.trim()).filter(Boolean)
  }));

  const PREREQUISITES = prereqSheet.map(p => ({
    source: String(p['Prerequisite Skill ID'] || ''),
    target: String(p['Unlocks Skill ID'] || '')
  }));

  // Export to React's source directory
  const output = `export const SKILLS = ${JSON.stringify(SKILLS, null, 2)};\n\n` +
                 `export const ROLES = ${JSON.stringify(ROLES, null, 2)};\n\n` +
                 `export const PREREQUISITES = ${JSON.stringify(PREREQUISITES, null, 2)};\n`;

  fs.writeFileSync('./src/data.js', output);
  console.log('✅ Successfully generated src/data.js securely using exceljs!');
}

generateData().catch(console.error);