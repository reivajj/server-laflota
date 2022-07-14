const fs = require('fs');
const { createSubscriptionDataFromCSVRow } = require('../models/subscriptions');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const { readCsv, createCsvWriter } = require('../utils/csv.utils')
// var wordlist = require('wordlist-english'); // CommonJS
// var wordsSpanish = require('an-array-of-spanish-words')

const { getAlbumByFieldValue, updateAlbumWithId } = require('../services/providers/albums');
const { getTrackAssetById, updateTrackAssetWithId } = require('../services/providers/tracks');
const { deliverAlbumForArrayOfDsps, addArrayOfDspsToDeliver, getAlbumDeliveryInstructions, redeliverAllAlbumDsps, redeliverAlbumForArrayOfDsps } = require('../services/providers/delivery');
const { mapWPReleaseToFilteredRelease } = require('../models/wp.albums');
const { getPayoutsAndGroupByAndOps } = require('../services/providers/payouts');

const isrcNamespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const csvWriter = createCsvWriter({
  path: 'csv/payouts_diffs.csv',
  header: [{ id: "ownerEmail", title: "ownerEmail" }, { id: "totalDiff", title: "totalDiff" }]
});

const csvWriterRedeliver = createCsvWriter({
  path: 'csv/0.ReleasesRedelivered.csv',
  header: [{ id: "albumFugaId", title: "Album FUGA Id" }, { id: "upc", title: "UPC" }, { id: "redeliverStatus", title: "Redelivery Status" }]
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

const readAndEditAlbumsFromUPCs = async () => {

  let upcs = fs.readFileSync('csv/AppleDeliveryUPCs.txt', 'utf8');
  const upcsAsList = upcs.split(",").slice;

  let dataResults = [];
  let albumsEdited = 0;
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const upc of upcsAsList) {
    index++;
    console.log("YA PROCESADOS: ", index);
    console.log("Falta en minutos APROX: ", ((upcsAsList.length - index) * 2.5) / 60);
    let albumResponse = await getAlbumByFieldValue(upc);
    if (!albumResponse || albumResponse.data === "NOT_EXISTS") dataResults.push({ upc, result: "NOT_FOUNDED" });

    let album = albumResponse.data[0];
    let albumFugaId = album.id;

    if (album.state === "DELIVERED") {
      let editResponse = "";
      let fieldsToEdit = newFieldsForAlbumFromAsset(album, album.assets);
      if (Object.keys(fieldsToEdit).length === 0) dataResults.push({ upc, result: "NO_ACTION_NEED" });
      else {
        editResponse = await updateAlbumWithId(albumFugaId, fieldsToEdit);
        if (editResponse.statusText === "OK") {
          albumsEdited++;
          dataResults.push({ upc, result: "SUCCESS_EDITED" });
        }
        console.log("FIELDS TO EDIT: ", fieldsToEdit);
      }
    }
    else dataResults.push({ upc, result: "NOT_DELIVERED" });
  }

  await csvWriter.writeRecords(dataResults);
  console.timeEnd("TEST GET ALBUM");
  return { albumsEdited, dataResults };
}

const deliveryListOfUpcsToApple = async () => {

  let upcs = fs.readFileSync('csv/AppleDeliveryUPCs.txt', 'utf8');
  const upcsAsList = upcs.split(",");
  let dataResults = [];
  let index = 0;

  for (const upc of upcsAsList) {
    console.time("TEST DELIVERY");
    index++;
    console.log("YA PROCESADOS: ", index);
    let albumResponse = await getAlbumByFieldValue(upc);
    if (!albumResponse || albumResponse.data === "NOT_EXISTS") dataResults.push({ upc, result: "NOT_FOUNDED" });

    let album = albumResponse.data[0];
    let albumFugaId = album.id;

    let redeliverResponse = await redeliverAlbumForArrayOfDsps(albumFugaId, [{ dsp: 1330598 }]);
    let arrayOfDspsProccessingPostDelivery = redeliverResponse.data.delivery_instructions.find(delInstruction => delInstruction.dsp.id === 1330598);
    console.log("APPLE STATE: ", arrayOfDspsProccessingPostDelivery);

    if (arrayOfDspsProccessingPostDelivery.state === "PROCESSING") {
      dataResults.push({ albumFugaId, upc, result: "CORRECT_RE_DELIVERY" });
      continue;
    }
    else dataResults.push({ albumFugaId, upc, redeliverStatus: "NOT_DELIVERED" });
  }

  await csvWriter.writeRecords(dataResults);
  return dataResults;
}

const readAndEditTracksFromUPCs = async () => {

  let upcs = fs.readFileSync('csv/0.UPCsToApproveTXT.txt', 'utf8');
  const upcsAsList = upcs.split(",");

  let dataResults = [];
  let tracksEdited = 0;
  console.time("TEST GET ALBUM");
  let index = 0;

  for (const upc of upcsAsList) {
    index++;

    console.log("YA PROCESADOS: ", index);
    console.log(`Faltan ${upcsAsList.length - index} albums.`);
    console.log(`Tracks editados: ${tracksEdited}`);

    let albumResponse = await getAlbumByFieldValue(upc);
    if (!albumResponse || albumResponse.data === "NOT_EXISTS")
      dataResults.push({
        id: "PRODUCT_NOT_FOUNDED", isrc: "PRODUCT_NOT_FOUNDED", upc,
        result: "PRODUCT_NOT_FOUNDED", action: "", asset_info: ""
      });

    let album = albumResponse.data[0];

    if (album.state === "DELIVERED" || album.state === "PUBLISHED") {
      let editBulkTracksFromUPC = album.assets.map(async asset => {

        let getTrackResponse = await getTrackAssetById(asset.id);
        if (!getTrackResponse || getTrackResponse.data === "NOT_EXISTS")
          dataResults.push({ id: asset.id, isrc: asset.isrc, upc, result: "TRACK_NOT_FOUNDED", action: "", asset_info: "" })

        // console.log("GET TRACK RESPONSE: ", getTrackResponse.data);
        let track = getTrackResponse.data;
        let asset_info = JSON.stringify({ name: track.name, audio_locale: track.audio_locale, genre: track.genre.id });
        let editTrackResponse = "";
        let fieldsToEdit = newFieldsForAsset(track);

        if (Object.keys(fieldsToEdit).length === 0)
          dataResults.push({
            id: asset.id, isrc: asset.isrc, upc, result: "NO_ACTION_NEED", action: ""
            , asset_info
          });
        else {
          editTrackResponse = await updateTrackAssetWithId(asset.id, fieldsToEdit);
          if (editTrackResponse.statusText === "OK") {
            tracksEdited++;
            dataResults.push({
              id: asset.id, isrc: asset.isrc, upc, result: "SUCCESS_EDITED",
              action: JSON.stringify(fieldsToEdit), asset_info
            });
          }
        }
      })

      await Promise.all(editBulkTracksFromUPC);

    }
    else dataResults.push({
      id: "PRODUCT_NOT_PUBLISHED", isrc: "PRODUCT_NOT_PUBLISHED",
      upc, result: "PRODUCT_NOT_PUBLISHED", action: "", asset_info: ""
    });
  }

  await csvWriter.writeRecords(dataResults);
  console.timeEnd("TEST GET ALBUM");
  return { dataResults };
}


const readISRCsCsv = async csvFileName => {
  const data = await readCsv(
    `${__dirname}/${csvFileName}.csv`,
    { headers: true, ignoreEmpty: true },
    createISRCsData,
  );
  return data;
}

const filterWpAlbumsByUPCDelivered = async () => {
  let wpAlbums = await readCsv(
    // `${__dirname}/0.WP-Releases-Delivereds.csv`,
    `${__dirname}/upcTest.csv`,
    { headers: true, ignoreEmpty: true },
    mapWPReleaseToFilteredRelease,
  );

  wpAlbums = wpAlbums.filter(wpAlbum => wpAlbum !== undefined && Object.keys(wpAlbum).length > 0);

  let upcs = fs.readFileSync('csv/0.UPCsToApproveTXT.txt', 'utf8');
  const upcsAsList = upcs.split(",");
  console.log("UPCS: ", upcsAsList.length);

  wpAlbums = wpAlbums.filter(wpAlbum => upcsAsList.find(upc => wpAlbum.upc === upc) !== undefined);
  let wpAlbumsNotInUpcsButDelivered = [];
  let index = 0;

  for (const wpAlbum of wpAlbums) {
    index++;
    console.log("YA PROCESADOS: ", index);
    let albumResponse = await getAlbumByFieldValue(wpAlbum.upc);
    let album = albumResponse.data[0];

    if (!albumResponse || albumResponse.data === "NOT_EXISTS") {
      console.log(`${wpAlbum.upc} NOT EXISTS`);
      continue;
    }
    if (album.state === "DELIVERED") {
      wpAlbum =
        wpAlbumsNotInUpcsButDelivered.push(wpAlbum);
    }
    if (album.state === "PUBLISHED") wpAlbumsNotInUpcsButDelivered.push(wpAlbum);
  }

  await csvWriter.writeRecords(wpAlbumsNotInUpcsButDelivered);
  return wpAlbumsNotInUpcsButDelivered;
}

const tryAnotherDeliveryRoundCheck = async () => {

  let upcs = fs.readFileSync('csv/0.UPCsToApproveTXT.txt', 'utf8');
  // let upcs = fs.readFileSync('csv/upcTest.txt', 'utf8');
  const upcsAsList = upcs.split(",");
  console.log("UPCS: ", upcsAsList.length);

  let albumsAndDeliveryStatusDsps = [];
  let sizeBatch = 20;
  console.time("TEST DELIVERY");

  for (let index = 0; index <= upcsAsList.length; index = index + sizeBatch) {

    let takeTenActions = upcsAsList.slice(index, index + sizeBatch).map(async (upc, upcIndex) => {

      let albumResponse = await getAlbumByFieldValue(upc);
      if (!albumResponse || albumResponse.data === "NOT_EXISTS") {
        console.log("YA PROCESADOS: ", index + upcIndex + 1);
        return { albumFugaId: "NOT_FOUNDED", upc, needDelivery: "NOT_FOUNDED" };
      }
      let album = albumResponse.data[0];

      if (album.state !== "DELIVERED") {
        console.log("YA PROCESADOS: ", index + upcIndex + 1);
        return { albumFugaId: album.id, upc, needDelivery: "NOT_DELIVERED" };
      }

      let dspsStatusResponse = await getAlbumDeliveryInstructions(album.id);
      if (!dspsStatusResponse || dspsStatusResponse.data.delivery_instructions.length === 0) {
        console.log("YA PROCESADOS: ", index + upcIndex + 1);
        return { albumFugaId: album.id, upc, needDelivery: "DELIVERY INSTRUCTIONS NOT FOUNDED" };
      }

      let deliveryInstructions = dspsStatusResponse.data.delivery_instructions;
      let addedAndNotDeliveredDsps = deliveryInstructions.filter(deliveryInstructions => deliveryInstructions.state === "ADDED");

      if (addedAndNotDeliveredDsps.length !== 0) {
        console.log("YA PROCESADOS: ", index + upcIndex + 1);
        return { albumFugaId: album.id, upc, needDelivery: `NEED_DELIVERY for ${addedAndNotDeliveredDsps.length} DSPs` };
      }

      if (addedAndNotDeliveredDsps.length === 0) {
        console.log("YA PROCESADOS: ", index + upcIndex + 1);
        return { albumFugaId: album.id, upc, needDelivery: "CORRECT_DELIVERY" };
      }
    })

    albumsAndDeliveryStatusDsps = [...albumsAndDeliveryStatusDsps, ...await Promise.all(takeTenActions)];
  }

  await csvWriter.writeRecords(albumsAndDeliveryStatusDsps);
  console.timeEnd("TEST DELIVERY");
  return albumsAndDeliveryStatusDsps;
}


const tryAnotherDeliveryRound = async () => {

  let albumsToDeliver = await readCsv(
    // `${__dirname}/0.WP-Releases-Delivereds.csv`,
    `${__dirname}/0.ReleasesNeedAnotherDeliveryRound.csv`,
    { headers: true, ignoreEmpty: true },
    (csvRow) => csvRow,
  );

  albumsToDeliver = albumsToDeliver.filter(albumAndStatus => albumAndStatus['Need Delivery'].indexOf("NEED_DELIVERY") >= 0);
  console.log("TOTAL ALBUMS TO DELIVER: ", albumsToDeliver.length);
  let albumsAndDeliveryStatusDsps = [];
  console.time("TEST DELIVERY");

  for (let index = 0; index < albumsToDeliver.length; index++) {
    let albumStatus = albumsToDeliver[index];
    let albumFugaId = albumStatus['Album FUGA Id'];
    let upc = albumStatus['UPC'];

    console.log("POR PROCESAR: ", index + 1, "/ Faltan: ", albumsToDeliver.length - index);
    console.log("PORCENTAJE COMPLETADO: ", (100 - ((albumsToDeliver.length - index) * 100) / albumsToDeliver.length), "%")

    let dspsStatusResponse = await getAlbumDeliveryInstructions(albumFugaId);
    if (!dspsStatusResponse || dspsStatusResponse.data.delivery_instructions.length === 0) {
      albumsAndDeliveryStatusDsps.push({ albumFugaId, upc, redeliverStatus: "DELIVERY INSTRUCTIONS NOT FOUNDED" });
      continue;
    }

    let arrayOfDspsProccessing = dspsStatusResponse.data.delivery_instructions.filter(delInstruction => delInstruction.state === "PROCESSING")
    let arrayOfDspsToDeliver = dspsStatusResponse.data.delivery_instructions.filter(dspAndStatus => dspAndStatus.state === "ADDED");
    arrayOfDspsToDeliver = arrayOfDspsToDeliver.map(dspStatus => { return { dsp: dspStatus.dsp.id } });

    if (arrayOfDspsToDeliver.length === 0) {
      albumsAndDeliveryStatusDsps.push({ albumFugaId, upc, redeliverStatus: "NO_NEED_TO_REDELIVER" });
      continue;
    }

    let redeliverResponse = await deliverAlbumForArrayOfDsps(albumFugaId, arrayOfDspsToDeliver);
    let arrayOfDspsProccessingPostDelivery = redeliverResponse.data.delivery_instructions.filter(delInstruction => delInstruction.state === "PROCESSING")

    if (arrayOfDspsProccessingPostDelivery.length - arrayOfDspsProccessing.length === arrayOfDspsToDeliver.length) {
      albumsAndDeliveryStatusDsps.push({ albumFugaId, upc, redeliverStatus: "CORRECT_RE_DELIVERY" });
      continue;
    }
    else albumsAndDeliveryStatusDsps.push({ albumFugaId, upc, redeliverStatus: "NOT_DELIVERED" });
  }


  await csvWriterRedeliver.writeRecords(albumsAndDeliveryStatusDsps);
  console.timeEnd("TEST DELIVERY");
  return albumsAndDeliveryStatusDsps;
}

const getTotalesWdAccountingRow = accountingValues => {
  let totals = { ownerEmail: "Totales", cantPayouts: 0, lastPayAskedDay: 0, totalPayed: 0 };
  if (accountingValues.length === 0) return totals;
  console.log(accountingValues);
  accountingValues.forEach(accVal => {
    totals.cantPayouts += accVal.cantPayouts;
    totals.totalPayed += accVal.totalPayed;
  })

  return {
    ownerEmail: totals.email,
    lastPayAskedDay: accountingValues[accountingValues.length - 1].lastPayAskedDay,
    cantPayouts: totals.cantPayouts,
    totalPayed: totals.totalPayed,
  }
}

const getTotalsPayoutsToCSV = async () => {
  let ops = JSON.stringify([{ op: "sum", field: "transferTotalUsd", name: "totalPayed" },
  { op: "count", field: "ownerEmail", name: "cantPayouts" },
  { op: "max", field: "requestDate", name: "lastPayAskedDay" }]);

  let whereClause = JSON.stringify({});

  let attNoOps = JSON.stringify([{ name: 'ownerEmail' }]);

  let payoutTotals = await getPayoutsAndGroupByAndOps('totalPayed.DESC', whereClause,
    'ownerEmail', ops, attNoOps);

  payoutTotals = payoutTotals.map(payout => {
    payout.totalPayed = parseFloat(payout.totalPayed.toFixed(2));
    return payout;
  })
  // payoutTotals.totalPayed = parseFloat(payoutTotals.totalPayed.toFixed(2));
  await csvWriter.writeRecords(payoutTotals);
}

const combineArraysWithNoDuplicates = (arr1, arr2) => [...new Set(arr1.concat(arr2))];

const getDiffsTotalsPayoutsToCSV = async () => {
  let totalsPayouts = await readCsv(
    `${__dirname}/totals_payouts.csv`,
    { headers: true, ignoreEmpty: true },
    (csvRow) => csvRow,
  );

  let totalsPayoutsAll = await readCsv(
    `${__dirname}/totals_payouts_all.csv`,
    { headers: true, ignoreEmpty: true },
    (csvRow) => csvRow,
  );

  let results = [];
  let emailsFromAll = totalsPayoutsAll.map(tpA => tpA.ownerEmail);
  let emailsFromNotAll = totalsPayouts.map(tp => tp.ownerEmail);
  let allEmails = combineArraysWithNoDuplicates(emailsFromAll, emailsFromNotAll);
  allEmails.forEach(email => {
    let rowFromAll = totalsPayoutsAll.find(tpA => email === tpA.ownerEmail) || { totalPayed: 0 };
    let rowFromNotAll = totalsPayouts.find(tp => email === tp.ownerEmail) || { totalPayed: 0 };
    results.push({ ownerEmail: email, totalDiff: rowFromAll.totalPayed - rowFromNotAll.totalPayed });
  })

  // payoutTotals.totalPayed = parseFloat(payoutTotals.totalPayed.toFixed(2));
  await csvWriter.writeRecords(results);
}

module.exports = {
  readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew,
  readAndTranscriptUPCsCsvAndDSPsForDelivery, readAndEditAlbumsFromUPCs, readAndEditTracksFromUPCs,
  filterWpAlbumsByUPCDelivered, tryAnotherDeliveryRound, deliveryListOfUpcsToApple, getTotalsPayoutsToCSV,
  getDiffsTotalsPayoutsToCSV
}
