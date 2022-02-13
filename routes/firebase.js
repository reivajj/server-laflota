var router = require("express-promise-router")();
const { createISRCsBatchInFS, deleteISRCsBatchInFS, updateISRCsInFS } = require("../firebase/firestore/isrcs");
const { getAllUsersFromFS, createUsersInFS, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSByEmail, getUserInFSByEmail, updateUserInFSByEmail } = require("../firebase/firestore/user");

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
  const response = await createUsersInFS();
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

router.put('/usersByEmail/:email', async (req, res, _) => {
  const response = await updateUserInFSByEmail(req.params.email, req.body);
  return res.status(200).send({ response });
})

router.post('/createIsrcsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await createISRCsBatchInFS(req.params.csvFileName);
  return res.status(200).send({ response });
});

router.delete('/deleteIsrcsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await deleteISRCsBatchInFS(req.params.csvFileName);
  return res.status(200).send({ response });
})

router.put('/updateIsrcs', async (req, res, next) => {
  const response = await updateISRCsInFS(req.body.isrcs, req.body.updateWith);
  return res.status(200).send({ response });
});


module.exports = router;