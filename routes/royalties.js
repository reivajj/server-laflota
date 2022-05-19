const { getDashGoRoyaltiesQuery, getDashGoRoyaltiesQueryCount, loadRoyaltiesFromLocalCSV } = require("../db/royalties");

var royalties = require("express-promise-router")();

royalties.get('/dashgo/search', async (req, res, next) => {
  const response = await getDashGoRoyaltiesQuery(req.body.fieldName, req.body.fieldValue);
  return res.status(200).send({ response });
});

royalties.get('/dashgo/search-count', async (req, res, next) => {
  const response = await getDashGoRoyaltiesQueryCount(req.body.fieldName, req.body.fieldValue);
  return res.status(200).send({ response });
});

royalties.post('/load-royalties-local', async (req, res, next) => {
  const response = await loadRoyaltiesFromLocalCSV(req.body.companyName, req.body.csvFileName);
  return res.status(200).send({ response });
});

module.exports = royalties;