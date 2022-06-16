const { getRoyaltiesGroupedWithOp, loadRoyaltiesFromLocalCSV, getRoyaltiesByQuery } = require("../db/royalties");

var royalties = require("express-promise-router")();

royalties.post('/search', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, limit, offset } = req.body;
  const response = await getRoyaltiesByQuery(companyName, fieldName, fieldValue, limit, offset);
  return res.status(200).send({ response });
});

royalties.post('/query-with-op', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, op, fieldOp, groupBy } = req.body;
  const response = await getRoyaltiesGroupedWithOp(companyName, fieldName, fieldValue, op, fieldOp, groupBy);
  return res.status(200).send({ response });
});

royalties.post('/load-royalties-local', async (req, res, _) => {
  const response = await loadRoyaltiesFromLocalCSV(req.body.companyName, req.body.csvFileName);
  return res.status(200).send({ response });
});

module.exports = royalties;