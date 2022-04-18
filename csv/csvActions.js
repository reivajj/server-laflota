const fs = require('fs');
const { parse } = require('fast-csv');
const { createSubscriptionDataFromCSVRow } = require('../models/subscriptions');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const isrcNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const dspsList = ["UPC", "amazon", "amazonmusic", "applemusic", "awa", "boomplay", "deezer", "facebookfingerprinting", "facebookmusic", "hungama"
  , "imusica", "itunes", "jaxsta", "kanjian", "kkbox", "linemusic", "medianet", "netease", "nuuday", "peloton",
  "saavn", "sevendigital", "shazam", "slacker", "soundcloud", "spotify", "tidal", "tiktok", "touchtunes", "umamusic",
  "youtube", "youtubemusic", "zvook"];

const headersCsvWriter = dspsList.map(dspName => { return { id: dspName, title: dspName } });
// const headersLessThan3 = [{ id: "upc", title: "UPC" }, { id: "DSP1", title: "DSP PUBLICADA 1" }, { id: "DSP2", title: "DSP PUBLICADA 2" }, { id: "DSP3", title: "DSP PUBLICADA 3" }]
const csvWriter = createCsvWriter({
  path: 'csv/0.0.onlyNeedsActiveUPCsFromTuli.csv',
  header: headersCsvWriter
});

let upcsActiveLessThanThree = ['018736564123', '018736244414', '018736775512', '018736896590', '024543803171',
  '1963620022403', '1963620368457', '1963620546985', '1963620608195'];

const createSubscriptionData = csvRowJson => {
  let subscriptionInJsonToFB = createSubscriptionDataFromCSVRow(csvRowJson);
  return subscriptionInJsonToFB;
};

const createISRCsData = csvRowJson => {
  console.log("CSV ISRC ROW: ", csvRowJson);
  return { ...csvRowJson, used: false, procedence: "FUGA", id: uuidv5(csvRowJson.isrc, isrcNamespace) };
}

const createUPCsData = (csvRowUpc) => {
  let quantityPublishedDsps = 0;
  Object.values(csvRowUpc).forEach(dspValue => (dspValue === "Published") && quantityPublishedDsps++);
  if (upcsActiveLessThanThree.includes(csvRowUpc.UPC)) console.log("INCLUIDO: ", csvRowUpc.UPC);
  if (quantityPublishedDsps >= 4 || csvRowUpc.spotify === "Published" || upcsActiveLessThanThree.includes(csvRowUpc.UPC)) return csvRowUpc;
}

const createUPCsSeparatedByComa = csvRowUpc => {
  return `${csvRowUpc.UPC}`
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
  let data = await readCsv(
    `${__dirname}/0.UPCsToApproveExcel.csv`,
    // `${__dirname}/upcTest.csv`,
    { headers: true, ignoreEmpty: true },
    // createUPCsData,
    createUPCsSeparatedByComa
  );

  data = data.filter(d => d !== undefined && Object.keys(d).length > 0);
  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));

  let result = "";
  data.forEach((upc, index) => {
    if (data.length === index + 1) result = result + upc;
    else result = result + upc + ","
  })

  fs.writeFile('csv/0.UPCsToApproveTXT.txt', result, function (err) {
    if (err) return console.log(err);
  });
  return data;
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
