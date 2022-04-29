const { getDashGoRoyaltiesQuery } = require("../db/royalties");

var royalties = require("express-promise-router")();

royalties.get('/dashgo', async (req, res, next) => {
  console.log("REQ: ", req.query);
  const response = await getDashGoRoyaltiesQuery(req.body.fieldName, req.body.fieldValue);
  return res.status(200).send({ response });
});

module.exports = royalties;