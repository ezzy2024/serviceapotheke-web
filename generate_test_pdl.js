const XLSX = require('xlsx');
const crypto = require('crypto');

function generateAnonymizedHash() {
  return crypto.randomBytes(16).toString('hex');
}

const data = [];
// Generate 500 rows of mock patient medication data
for (let i = 1; i <= 500; i++) {
  data.push({
    PatientId_Hash: generateAnonymizedHash(),
    AgeGroup: Math.floor(Math.random() * 4) + 6 + "0+", // 60+, 70+, 80+, 90+
    MedicationName: ['Metoprolol', 'Ramipril', 'Amlodipin', 'Pantoprazol', 'Marcumar'][Math.floor(Math.random() * 5)],
    Dosage: '1-0-0-0',
    PZN: Math.floor(10000000 + Math.random() * 90000000).toString(),
    IsHighRisk: Math.random() > 0.8 ? 'Yes' : 'No'
  });
}

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "MedicationData");

const filename = 'pdl_stress_test_500.xlsx';
XLSX.writeFile(workbook, filename);

console.log(`Successfully generated ${filename} with 500 records for Cloud Run memory profiling.`);
