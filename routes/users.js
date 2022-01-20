var router = require("express-promise-router")();
const { getAllUsersWP, getUserByEmailWP, loginUserWithEmailAndPwWP, getCountUsersWP } = require("../services/providers/users");

router.get('/', async (_, res, next) => {
  const response = await getAllUsersWP();
  return res.status(200).send({ response });
});

router.get('/countTotalUsers', async (_, res, next) => {
  const response = await getCountUsersWP();
  return res.status(200).send({ response });
});

router.get('/searchByEmail/:email', async (req, res, _) => {
  const response = await getUserByEmailWP(req.params.email);
  return res.status(200).send({ response });
});

router.get('/login/:email/:password', async (req, res, _) => {
  const response = await loginUserWithEmailAndPwWP(req.params.email, req.params.password);
  return res.status(200).send({ response });
});

module.exports = router;