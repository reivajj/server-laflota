var router = require("express-promise-router")();
const { getAllUsersFromFS, createUsersInFirestore, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSByEmail, getUserInFSByEmail } = require("../firebase/firestoreActions");

router.get('/users', async (_, res, next) => {
  const response = await getAllUsersFromFS();
  return res.status(200).send({ response });
});

router.get('/statsUsers', async (_, res, next) => {
  const response = await getUsersStatsFromFS();
  return res.status(200).send({ response });
});

router.post('/updateTotalUsers', async (_, res, next) => {
  const response = await updateTotalUsersFromFS();
  return res.status(200).send({ response });
});

router.post('/createUsers', async (_, res, next) => {
  const response = await createUsersInFirestore();
  return res.status(200).send({ response });
})

router.delete('/usersByEmail/:email', async (req, res, _) => {
  const response = await deleteUserInFSByEmail(req.params.email);
  return res.status(200).send({ response });
})

router.get('/usersByEmail/:email', async (req, res, _) => {
  const response = await getUserInFSByEmail(req.params.email);
  return res.status(200).send({ response });
})

module.exports = router;