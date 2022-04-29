const fs = require('fs');
const { parse } = require('fast-csv');
const { createSubscriptionDataFromCSVRow } = require('../models/subscriptions');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');

const { getAlbumByFieldValue } = require('../services/providers/albums');
const { deliverAlbumForArrayOfDsps, addArrayOfDspsToDeliver } = require('../services/providers/delivery');

const dgDSPsWithIDs = {
  "amazon": 99268,
  "amazonmusic": 99268,
  "applemusic": 1330598,
  "awa": 847103579,
  "boomplay": 1514168496,
  "deezer": 2100357,
  "facebookfingerprinting": 1415672002,
  "facebookmusic": 1499657856,
  "hungama": 1268816855,
  "imusica": 103725,
  "itunes": 1330598,
  "jaxsta": 1186352005,
  "kanjian": null,
  "kkbox": 121452605,
  "linemusic": 1232212955,
  "medianet": null,
  "netease": 1382854531,
  "nuuday": 464139,
  "peloton": 2528780514,
  "saavn": 316911752,
  "sevendigital": 247916,
  "shazam": 4266325,
  "slacker": null,
  "soundcloud": 35299696,
  "spotify": 746109,
  "tidal": 3440259,
  "tiktok": 1809226414,
  "touchtunes": 1130831671,
  "umamusic": 1210987244,
  "youtube": 3405271817,
  "youtubemusic": 3405271817,
  "zvook": null
}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const isrcNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const dspsList = ["UPC", "amazon", "amazonmusic", "applemusic", "awa", "boomplay", "deezer", "facebookfingerprinting", "facebookmusic", "hungama"
  , "imusica", "itunes", "jaxsta", "kanjian", "kkbox", "linemusic", "medianet", "netease", "nuuday", "peloton",
  "saavn", "sevendigital", "shazam", "slacker", "soundcloud", "spotify", "tidal", "tiktok", "touchtunes", "umamusic",
  "youtube", "youtubemusic", "zvook"];

function uniqBy(a, key) {
  return [
    ...new Map(
      a.map(x => [x[`${key}`], x])
    ).values()
  ]
}

const headersCsvWriter = dspsList.map(dspName => { return { id: dspName, title: dspName } });
let headersDGdspsToIds = Object.values(dgDSPsWithIDs).map(dspsIds => { return { id: dspsIds, title: dspsIds } });
headersDGdspsToIds = [{ id: "upc", title: "UPC" }].concat(uniqBy(headersDGdspsToIds, "id").filter(dsp => dsp.id !== null));
// console.log("HEADERS: ", headersDGdspsToIds);

const headersLessThan10 = [{ id: "upc", title: "UPC" }, { id: "DSP1", title: "DSP PUBLICADA 1" }, { id: "DSP2", title: "DSP PUBLICADA 2" }, { id: "DSP3", title: "DSP PUBLICADA 3" }, { id: "DSP4", title: "DSP PUBLICADA 4" }
  , { id: "DSP5", title: "DSP PUBLICADA 5" }, { id: "DSP6", title: "DSP PUBLICADA 6" }, { id: "DSP7", title: "DSP PUBLICADA 7" }, { id: "DSP8", title: "DSP PUBLICADA 8" }, { id: "DSP9", title: "DSP PUBLICADA 9" },
{ id: "DSP10", title: "DSP PUBLICADA 10" }];

const csvWriter = createCsvWriter({
  path: 'csv/DELIVERY-RESULTS.csv',
  header: [{ id: "upc", title: "UPC" }, { id: "result", title: "Result" }]
});

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
  let result = {};
  result.upc = csvRowUpc.UPC;
  let keys = Object.keys(csvRowUpc);
  let dspIndex = 1;
  Object.values(csvRowUpc).forEach((dspValue, index) => {
    if (dspValue === "Published") {
      result = { ...result, [`DSP${dspIndex}`]: keys[index] }
      dspIndex++;
      quantityPublishedDsps++;
    }
  })
  if (quantityPublishedDsps >= 4 && quantityPublishedDsps <= 250 && !(csvRowUpc.spotify === "Published")) return result;
}

const transcriptDSPsNamesToIds = csvRowUpc => {
  let result = {};
  result.upc = csvRowUpc.UPC;
  let dspsIdsToDeliver = [];
  let keys = Object.keys(csvRowUpc);
  Object.values(csvRowUpc).forEach((dspValue, index) => {
    if (dspValue === "Published" && dgDSPsWithIDs[keys[index]] !== null) dspsIdsToDeliver.push({ dsp: dgDSPsWithIDs[keys[index]] })
  })

  result.dspsIds = dspsIdsToDeliver;
  return result;
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
    `${__dirname}/3.upcsWithZerosSinComillasSinNuncaPublicados.csv`,
    // `${__dirname}/upcTest.csv`,
    { headers: true, ignoreEmpty: true },
    createUPCsData,
    // createUPCsSeparatedByComa
  );

  data = data.filter(d => d !== undefined && Object.keys(d).length > 0);
  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));

  // let result = "";
  // console.log("DATA tamanio: ", data.length)
  // data.forEach((upc, index) => {
  //   if (data.length === index + 1) result = result + upc;
  //   else result = result + upc + ","
  // })

  // fs.writeFile('csv/0.UPCsToApproveTXT.txt', result, function (err) {
  //   if (err) return console.log(err);
  // });
  return data;
}

const readAndTranscriptUPCsCsvAndDSPsForDelivery = async () => {
  let data = await readCsv(
    // `${__dirname}/3.upcsWithZerosSinComillasSinNuncaPublicados.csv`,
    `${__dirname}/upcTest.csv`,
    { headers: true, ignoreEmpty: true },
    transcriptDSPsNamesToIds,
  );

  data = data.filter(d => d !== undefined && Object.keys(d).length > 0);
  let dataResults = [];
  let index = 1;
  console.time("TEST DELIVERY");

  let promisesDelivery = data.map(async upcWithDsp => {
    if (upcWithDsp.dspsIds.length === 0) { console.log("DELIVERED: ", index); dataResults.push({ upc: upcWithDsp.upc, result: "UPC_NOT_FOUND" }); index++; return "NO_ACTION_NEED" };
    let albumResponse = await getAlbumByFieldValue(upcWithDsp.upc);
    // if (!albumResponse.data || !albumResponse.data[0].id) { console.log("DELIVERED: ", index); index++; dataResults.push({ upc: upcWithDsp.upc, result: "UPC_NOT_FOUND" }); return "NO_ACTION_NEED" }

    let album = albumResponse.data[0];
    let albumFugaId = album.id;
    if (album.state === "DELIVERED") {
      console.log("DELIVERED: ", index); index++; dataResults.push({ upc: upcWithDsp.upc, result: "SUCCESS_ALREADY_DELIVERED" }); return "NO_ACTION_NEED";
    };
    if (album.state !== "PUBLISHED") { console.log("DELIVERED: ", index); index++; dataResults.push({ upc: upcWithDsp.upc, result: "NOT_PUBLISHED" }); return "NO_ACTION_NEED" };

    let addDspsToDeliverResponse = await addArrayOfDspsToDeliver(albumFugaId, upcWithDsp.dspsIds);

    let deliverResponse = await deliverAlbumForArrayOfDsps(albumFugaId, upcWithDsp.dspsIds);
    if (addDspsToDeliverResponse.status === 207 && deliverResponse.status === 207) {
      dataResults.push({ upc: upcWithDsp.upc, result: "SUCCESS" });
    }
    console.log("DELIVERED: ", index);
    index++;
  })

  await Promise.all(promisesDelivery);
  await csvWriter.writeRecords(dataResults);
  console.timeEnd("TEST DELIVERY");
  return dataResults;
}



const readISRCsCsv = async csvFileName => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    createISRCsData,
  );
  return data;
}

module.exports = { readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew, readAndTranscriptUPCsCsvAndDSPsForDelivery };
