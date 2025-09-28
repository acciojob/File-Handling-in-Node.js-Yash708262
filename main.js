const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = process.argv[2];
const columnName = process.argv[3];

if (!csvFilePath || !columnName) {
  console.error("Usage: node script.js <csvFilePath> <columnName>");
  process.exit(1);
}

let sum = 0;
let columnExists = false;

try {
  fs.createReadStream(csvFilePath)
    .on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
    })
    .pipe(csv())
    .on('headers', (headers) => {
      // check if column exists
      if (headers.includes(columnName)) {
        columnExists = true;
      }
    })
    .on('data', (data) => {
      if (columnExists && data[columnName] !== undefined) {
        const value = parseFloat(data[columnName]);
        if (!isNaN(value)) {
          sum += value;
        }
      }
    })
    .on('end', () => {
      console.log(`The sum of ${columnName} is: ${sum}`);
    });
} catch (err) {
  console.error(`Error: ${err.message}`);
}
