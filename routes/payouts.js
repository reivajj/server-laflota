const { getTotalsPayoutsToCSV, getDiffsTotalsPayoutsToCSV } = require("../csv/csvActions");
const { getPayoutsFromFSByOwnerId } = require("../firebase/firestore/payouts");
const { getPayoutsByQuery, getPayoutsAndGroupByAndOps, getTotalPayedPayouts,
  createPayout, updatePayout, deletePayout, getPayoutsAccounting } = require("../services/providers/payouts");

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

payouts.get('/accounting', async (req, res, _) => {
  let { order, where, groupBy, ops, attributes } = req.query;
  const response = await getPayoutsAccounting(order, where, groupBy, ops, attributes);
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

payouts.get('/totalsToCsv', async (req, res, _) => {
  const response = await getTotalsPayoutsToCSV();
  return res.status(200).send({ response });
});

payouts.get('/totalsDiffsToCsv', async (req, res, _) => {
  const response = await getDiffsTotalsPayoutsToCSV();
  return res.status(200).send({ response });
});
// payouts.get('/migrate', async (req, res, _) => {
//   const response = await migrateDGPayoutsFromDB();
//   return res.status(200).send({ response });
// });

// payouts.get('/fix-payouts', async (req, res, _) => {
//   const response = await fixPayoutsFromDB();
//   return res.status(200).send({ response });
// });

module.exports = payouts;