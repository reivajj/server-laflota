const { getPayoutsFromFSByOwnerId } = require("../firebase/firestore/payouts");
const { migratePayoutFromFS, getPayoutsByQuery,
  getPayoutsAndGroupByAndOps, getTotalPayedPayouts, createPayout, updatePayout,
  deletePayout } = require("../services/providers/payouts");

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

payouts.get('/fs/:ownerId', async (req, res, _) => {
  const response = await getPayoutsFromFSByOwnerId(req.params.ownerId);
  return res.status(200).send({ response });
});

payouts.get('/groupBy', async (req, res, _) => {
  let { order, where, groupBy, ops, attributes } = req.query;
  const response = await getPayoutsAndGroupByAndOps(order, where, groupBy, ops, attributes);
  return res.status(200).send({ response });
});

payouts.post('/', async (req, res, _) => {
  const response = await createPayout(req.body.payoutRecord, req.body.sendNotification);
  return res.status(200).send({ response });
})

payouts.put('/', async (req, res, _) => {
  const response = await updatePayout(req.body.payoutRecord, req.body.sendNotification);
  return res.status(200).send({ response });
})

payouts.delete('/:payoutId', async (req, res, _) => {
  const response = await deletePayout(req.params.payoutId);
  return res.status(200).send({ response });
})


payouts.get('/migrate', async (req, res, _) => {
  const response = await migratePayoutFromFS();
  return res.status(200).send({ response });
});

module.exports = payouts;