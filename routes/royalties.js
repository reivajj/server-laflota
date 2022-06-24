const { getRoyaltiesGroupedWithOp, loadRoyaltiesFromLocalCSV, getRoyaltiesByQuery, getAccountingForTableView, getAllRoyaltiesFromDB, loadDgRoyaltiesFromDB } = require("../db/royalties");

var royalties = require("express-promise-router")();

royalties.post('/all', async (req, res, _) => {
  let { companyName, limit, offset, order } = req.body;
  const response = await getAllRoyaltiesFromDB(companyName, limit, offset, order);
  return res.status(200).send({ response });
});

royalties.post('/search', async (req, res, _) => {
  let { companyName, fieldName, fieldValue, limit, offset } = req.body;
  const response = await getRoyaltiesByQuery(companyName, fieldName, fieldValue, limit, offset);
  return res.status(200).send({ response });
});

royalties.post('/query-with-op', async (req, res, _) => {
  let { companyName, currency, fieldName, fieldValue, op, fieldOp, groupBy } = req.body;
  const response = await getRoyaltiesGroupedWithOp(companyName, currency, fieldName, fieldValue, op, fieldOp, groupBy);
  return res.status(200).send({ response });
});

royalties.post('/accounting-groupBy/:groupByField', async (req, res, _) => {
  const response = await getAccountingForTableView(req.params.groupByField, req.body.fieldName, req.body.fieldValue);
  return res.status(200).send({ response });
});

royalties.post('/load-royalties-local', async (req, res, _) => {
  const response = await loadRoyaltiesFromLocalCSV(req.body.companyName, req.body.csvFileName);
  return res.status(200).send({ response });
});

royalties.post('/load-royalties-db', async (req, res, _) => {
  const response = await loadDgRoyaltiesFromDB();
  return res.status(200).send({ response });
});

//==============================================DG==================================================================\\


module.exports = royalties;