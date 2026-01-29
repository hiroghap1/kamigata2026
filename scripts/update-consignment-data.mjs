import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = process.env.CONSIGNMENT_SPREADSHEET_ID;
const GID = process.env.CONSIGNMENT_SPREADSHEET_GID || '0';
const GID_AREAMASTER = process.env.CONSIGNMENT_SPREADSHEET_GID_AREAMASTER;

if (!SPREADSHEET_ID) {
  console.error('Error: CONSIGNMENT_SPREADSHEET_ID is not defined in .env file');
  process.exit(1);
}

const DATA_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;
const AREA_CSV_URL = GID_AREAMASTER ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID_AREAMASTER}` : null;

const DATA_OUTPUT_PATH = path.resolve(__dirname, '../src/data/consignment_2026.csv');
const AREA_OUTPUT_PATH = path.resolve(__dirname, '../src/data/area_master.csv');

async function downloadFile(url, outputPath, label) {
  console.log(`Downloading ${label}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${label}: ${response.statusText}`);
  }
  const content = await response.text();
  
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Successfully updated: ${outputPath}`);
}

async function main() {
  try {
    await downloadFile(DATA_CSV_URL, DATA_OUTPUT_PATH, 'consignment data');
    if (AREA_CSV_URL) {
      await downloadFile(AREA_CSV_URL, AREA_OUTPUT_PATH, 'area master data');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
