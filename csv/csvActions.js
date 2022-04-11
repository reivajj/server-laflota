const fs = require('fs');
const { parse } = require('fast-csv');
const { createSubscriptionDataFromCSVRow } = require('../models/subscriptions');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dspsList = ["UPC", "amazon", "amazonmusic", "applemusic", "awa", "boomplay", "deezer", "facebookfingerprinting", "facebookmusic", "hungama"
  , "imusica", "itunes", "jaxsta", "kanjian", "kkbox", "linemusic", "medianet", "netease", "nuuday", "peloton",
  "saavn", "sevendigital", "shazam", "slacker", "soundcloud", "spotify", "tidal", "tiktok", "touchtunes", "umamusic",
  "youtube", "youtubemusic", "zvook"];

const headersCsvWriter = dspsList.map(dspName => { return { id: dspName, title: dspName } });
const csvWriter = createCsvWriter({
  path: 'csv/upcsWithZeros.csv',
  header: headersCsvWriter
});

const isrcNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const createSubscriptionData = csvRowJson => {
  let subscriptionInJsonToFB = createSubscriptionDataFromCSVRow(csvRowJson);
  return subscriptionInJsonToFB;
};

const createISRCsData = csvRowJson => {
  console.log("CSV ISRC ROW: ", csvRowJson);
  return { ...csvRowJson, used: false, procedence: "FUGA", id: uuidv5(csvRowJson.isrc, isrcNamespace) };
}

const createUPCsData = csvRowUpc => {
  return { ...csvRowUpc, UPC: `0${csvRowUpc.UPC}` }
}

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

const readUPCsCsvAndWriteNew = async () => {
  const data = await readCsv(
    `${__dirname}/UPCs.csv`,
    { headers: true, ignoreEmpty: true },
    createUPCsData,
  );

  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
}

const readISRCsCsv = async csvFileName => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    createISRCsData,
  );
  return data;
}

module.exports = { readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew };
