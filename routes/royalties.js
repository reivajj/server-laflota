const { getRoyaltiesByQueryWithOp, getRoyaltiesByDspsWithOp, loadRoyaltiesFromLocalCSV, getRoyaltiesByQuery } = require("../db/royalties");

var royalties = require("express-promise-router")();

royalties.post('/search', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, limit, offset } = req.body;
  const response = await getRoyaltiesByQuery(companyName, fieldName, fieldValue, limit, offset);
  return res.status(200).send({ response });
});

royalties.post('/queryWithOp', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, fieldToSum } = req.body;
  const response = await getRoyaltiesByQueryWithOp(companyName, fieldName, fieldValue, fieldToSum);
  return res.status(200).send({ response });
});

royalties.post('/royalties-dsp-with-op', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, fieldToSum, groupBy } = req.body;
  const response = await getRoyaltiesByDspsWithOp(companyName, fieldName, fieldValue, fieldToSum, groupBy);
  return res.status(200).send({ response });
});

royalties.post('/load-royalties-local', async (req, res, _) => {
  const response = await loadRoyaltiesFromLocalCSV(req.body.companyName, req.body.csvFileName);
  return res.status(200).send({ response });
});

module.exports = royalties;