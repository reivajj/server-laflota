const { readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew, readAndTranscriptUPCsCsvAndDSPsForDelivery } = require("../csv/csvActions");

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


module.exports = router;