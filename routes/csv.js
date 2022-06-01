const { readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew, readAndTranscriptUPCsCsvAndDSPsForDelivery, readAndEditAlbumsFromUPCs, readAndEditTracksFromUPCs, filterWpAlbumsByUPCDelivered, tryAnotherDeliveryRound } = require("../csv/csvActions");
const { analizeAlbumsNotInDelivery, fugaAlbumsMigrationApproach, createAlbumsNotMigrated } = require("../migration/albums.migration");
const { getArtistsToMigrateToFS, getArtistsFugaIdToMigrateToFS, createArtistFsFromMigrate } = require("../migration/artists.migration");
var router = require("express-promise-router")();

router.post('/importSubscriptionsFromLocalCSV', async (_, res, next) => {
  const response = await readSubscriptionsCsv();
  return res.status(200).send({ response });
})

router.post('/importISRCsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await readISRCsCsv(req.params.csvFileName);
  return res.status(200).send({ response });
})

router.post('/addZeroToUpcList', async (_, res, next) => {
  const response = await readUPCsCsvAndWriteNew();
  return res.status(200).send({ response });
})

router.post('/prepare-for-delivery', async (_, res, next) => {
  const response = await readAndTranscriptUPCsCsvAndDSPsForDelivery();
  return res.status(200).send({ response });
})

router.post('/bulk-edit', async (_, res, next) => {
  const response = await readAndEditTracksFromUPCs();
  return res.status(200).send({ response });
})

router.post('/filterWpAlbums', async (_, res, next) => {
  const response = await filterWpAlbumsByUPCDelivered();
  return res.status(200).send({ response });
})

router.post('/anotherDeliveryRound', async (_, res, next) => {
  const response = await tryAnotherDeliveryRound();
  return res.status(200).send({ response });
})

router.post('/analizeAlbumsWpNotDelivered', async (_, res, next) => {
  const response = await analizeAlbumsNotInDelivery();
  return res.status(200).send({ response });
})

router.post('/fugaMigrationApproach', async (_, res, next) => {
  const response = await createAlbumsNotMigrated();
  return res.status(200).send({ response });
})

router.post('/getArtistsToMigrateToFS', async (_, res, next) => {
  const response = await createArtistFsFromMigrate();
  return res.status(200).send({ response });
})

module.exports = router;