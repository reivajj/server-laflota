var router = require("express-promise-router")();
const { getAllUsersWP, getUserByEmailWP, loginUserWithEmailAndPwWP, getCountUsersWP,
  getUserArtistsByEmailFromDG } = require("../services/providers/users");

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

router.get('/searchArtistsByEmail/:email', async (req, res, _) => {
  const response = await getUserArtistsByEmailFromDG(req.params.email);
  return res.status(200).send({ response });
});

router.post('/login', async (req, res, _) => {
  const response = await loginUserWithEmailAndPwWP(req.body);
  return res.status(200).send({ response });
});



module.exports = router;