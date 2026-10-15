import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Bring back the reliable 'require' function for this specific file
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting data conversion...");

const excelPath = path.join(__dirname, 'Data for IT sector.xlsx');
const outPath = path.join(__dirname, 'src', 'data.js');

if (!fs.existsSync(excelPath)) {
    console.error("❌ ERROR: Cannot find the Excel file!");
    console.error("Make sure your Excel file is named EXACTLY 'Data for IT sector.xlsx' and is in this folder: " + __dirname);
    process.exit(1);
}

if (!fs.existsSync(path.join(__dirname, 'src'))) {
    console.error("❌ ERROR: Cannot find the 'src' folder!");
    process.exit(1);
}

try {
    console.log("Reading Excel file...");
    const workbook = xlsx.readFile(excelPath);
    const sheetNames = workbook.SheetNames;

    const skillsSheet = sheetNames.find(n => n.includes('Skills'));
    const rolesSheet = sheetNames.find(n => n.includes('Role') && !n.includes('Mapping'));
    const prereqsSheet = sheetNames.find(n => n.includes('Prerequisite'));

    console.log(`Found Sheets: Skills: ${!!skillsSheet}, Roles: ${!!rolesSheet}, Prereqs: ${!!prereqsSheet}`);

    const skills = skillsSheet ? xlsx.utils.sheet_to_json(workbook.Sheets[skillsSheet]) : [];
    const roles = rolesSheet ? xlsx.utils.sheet_to_json(workbook.Sheets[rolesSheet]) : [];
    const prereqs = prereqsSheet ? xlsx.utils.sheet_to_json(workbook.Sheets[prereqsSheet]) : [];

    const fileContent = `export const SKILLS = ${JSON.stringify(skills, null, 2)};\n\nexport const ROLES = ${JSON.stringify(roles, null, 2)};\n\nexport const PREREQUISITES = ${JSON.stringify(prereqs, null, 2)};`;

    console.log("Writing to src/data.js...");
    fs.writeFileSync(outPath, fileContent);
    
    console.log("✅ SUCCESS! data.js has been generated in your src folder.");
} catch (error) {
    console.error("❌ FATAL ERROR DURING CONVERSION:", error.message);
}