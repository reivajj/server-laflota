const fs = require('fs');
const { parse } = require('fast-csv');
const { createSubscriptionDataFromCSVRow } = require('../models/subscriptions');

const createSubscriptionData = (csvRowJson) => {
  let subscriptionInJsonToFB = createSubscriptionDataFromCSVRow(csvRowJson);
  return subscriptionInJsonToFB;
};

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

const readSubscriptionsCsv = async () => {
  const data = await readCsv(
    `${__dirname}/subscriptionsTest.csv`,
    { headers: true, ignoreEmpty: true },
    createSubscriptionData,
  );

  return data;
}

module.exports = { readSubscriptionsCsv };
