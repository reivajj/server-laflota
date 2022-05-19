const fs = require('fs');
const { parse } = require('fast-csv');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Async readCsv
const readCsv = (path, options, rowProcessor) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(path)
      .pipe(parse(options))
      .on('error', reject)
      .on('data', row => data.push(rowProcessor(row)))
      .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(data);
      });
  });
}

const getArrayElementsInFsFromCsv = async csvFilePath => {
  const data = await readCsv(
    `${csvFilePath}`,
    { headers: true, ignoreEmpty: true },
    (csvRow) => csvRow,
  );
  return data;
}

module.exports = { readCsv, createCsvWriter, getArrayElementsInFsFromCsv }