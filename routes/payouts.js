const { migratePayoutFromFS, getPayoutsByQuery,
  getPayoutsAndGroupByAndOps, getTotalPayedPayouts } = require("../services/providers/payouts");

var payouts = require("express-promise-router")();

payouts.get('/', async (req, res, _) => {
  let { limit, offset, order, where } = req.query;
  const response = await getPayoutsByQuery(limit, offset, order, where);
  return res.status(200).send({ response });
});

payouts.get('/totalPayed/:userEmail', async (req, res, _) => {
  const response = await getTotalPayedPayouts(req.params.userEmail);
  return res.status(200).send({ response });
});

payouts.get('/groupBy', async (req, res, _) => {
  console.log("REQ QUERY: ", req.query);
  let { order, where, groupBy, ops, attributes } = req.query;
  const response = await getPayoutsAndGroupByAndOps(order, where, groupBy, ops, attributes);
  return res.status(200).send({ response });
});

payouts.get('/migrate', async (req, res, _) => {
  const response = await migratePayoutFromFS();
  return res.status(200).send({ response });
});

module.exports = payouts;