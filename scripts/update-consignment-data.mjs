import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = process.env.CONSIGNMENT_SPREADSHEET_ID;
const GID = '0';

if (!SPREADSHEET_ID) {
  console.error('Error: CONSIGNMENT_SPREADSHEET_ID is not defined in .env file');
  process.exit(1);
}

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/consignment_2026.csv');

async function downloadCSV() {
  console.log('Downloading latest consignment data from Google Spreadsheets...');
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvContent = await response.text();
    
    // Ensure the data directory exists
    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, csvContent, 'utf-8');
    console.log(`Successfully updated: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error downloading CSV:', error.message);
    process.exit(1);
  }
}

downloadCSV();
