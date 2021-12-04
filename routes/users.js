var router = require("express-promise-router")();
const { getAllUsers, getUserByEmail, loginUserWithEmailAndPw } = require("../services/providers/users");

router.get('/', async (_, res, next) => {
  const response = await getAllUsers();
  return res.status(200).send({ response });
});

router.get('/searchByEmail/:email', async (req, res, _) => {
  const response = await getUserByEmail(req.params.email);
  return res.status(200).send({ response });
});

router.get('/login/:email/:password', async (req, res, _) => {
  const response = await loginUserWithEmailAndPw(req.params.email, req.params.password);
  return res.status(200).send({ response });
});

module.exports = router;