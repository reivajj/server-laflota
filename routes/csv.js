const { readSubscriptionsCsv } = require("../csv/csvActions");

var router = require("express-promise-router")();

router.post('/importSubscriptionsFromLocalCSV', async (_, res, next) => {
  const response = await readSubscriptionsCsv();
  return res.status(200).send({ response });
})
module.exports = router;