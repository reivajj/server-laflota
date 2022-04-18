var router = require("express-promise-router")();
const { addAlbumFromFugaToFSUser } = require("../firebase/firestore/albums");
const { deleteElementFromFS, getElementFromFS, editElementFromFS } = require("../firebase/firestore/elements");
const { createISRCsBatchInFS, deleteISRCsBatchInFS, updateISRCsInFS, getIsrcByUsesStateAndLimitFS, getIsrcDocByIsrcCodeFS, createCapifIsrcs, getCapifISRCs, getNotUsedIsrcAndMark } = require("../firebase/firestore/isrcs");
const { getTracksByPropFS, attachTracksToAlbumFS } = require("../firebase/firestore/tracks");
const { getAllUsersFromFS, createUsersInFS, getUsersStatsFromFS, updateTotalUsersFromFS, deleteUserInFSByEmail,
  getUserInFSByEmail, updateUserInFSByEmail, deleteAllUsersNotInFB, getUserArtistsInFSByEmail, updatePasswordByEmailInFS, updateAllUsersFS } = require("../firebase/firestore/user");
const { logToCloudLoggingFS } = require("../third-party-api/providers/errors/logCloudLogging");

router.get('/users', async (_, res, next) => {
  const response = await getAllUsersFromFS();
  return res.status(200).send({ response });
});

router.put('/users', async (req, res, next) => {
  const response = await updateAllUsersFS(req.body);
  return res.status(200).send({ response });
});

router.delete('/users/deleteByQuery', async (_, res, next) => {
  const response = await deleteAllUsersNotInFB();
  return res.status(200).send({ response });
})

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

router.put('/changePasswordByEmail/:userEmail', async (req, res, _) => {
  console.log("REQUEST: ", req.body)
  const response = await updatePasswordByEmailInFS(req.params.userEmail, req.body.password);
  return res.status(200).send({ response });
});

//============================================================ALBUMS===============================================\\

router.post('/fuga/create-fs-album-from-fuga', async (req, res, _) => {
  const response = await addAlbumFromFugaToFSUser(req.body.albumFugaId, req.body.userEmail, req.body.userId, req.body.artistId, req.body.nombreArtist);
  return res.status(200).send({ response });
})

//============================================================ELEMENTS=============================================\\
router.delete('/element', async (req, res, _) => {
  const response = await deleteElementFromFS(req.body.targetCollection, req.body.targetElementId);
  return res.status(200).send({ response });
})

router.get('/element', async (req, res, _) => {
  const response = await getElementFromFS(req.body.targetCollection, req.body.targetElementId);
  return res.status(200).send({ response });
})

router.put('/element', async (req, res, _) => {
  const response = await editElementFromFS(req.body.targetCollection, req.body.targetElementId, req.body.newInfo);
  return res.status(200).send({ response });
})
//============================================================ARTISTS==============================================\\

router.get('/usersByEmail/:email/artists', async (req, res, _) => {
  const response = await getUserArtistsInFSByEmail(req.params.email);
  return res.status(200).send({ response });
})

//============================================================TRACKS===============================================\\

router.get('/tracks', async (req, res, _) => {
  const response = await getTracksByPropFS(req.body);
  return res.status(200).send({ response });
})

router.put('/fuga/tracks/:albumFugaId/attach', async (req, res, _) => {
  const response = await attachTracksToAlbumFS(req.params.albumFugaId);
  return res.status(200).send({ response });
})

//============================================================ISRC=================================================\\

router.post('/createIsrcsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await createISRCsBatchInFS(req.params.csvFileName);
  return res.status(200).send({ response });
});

router.delete('/deleteIsrcsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await deleteISRCsBatchInFS(req.params.csvFileName);
  return res.status(200).send({ response });
})

router.post('/createCapifIsrcs', async (req, res, next) => {
  const response = await createCapifIsrcs(req.body.init, req.body.cant);
  return res.status(200).send({ response });
});

router.get('/getIsrcByUsedStateAndLimit', async (req, res, next) => {
  const response = await getIsrcByUsesStateAndLimitFS(req.body);
  return res.status(200).send({ response });
})

router.get('/getNotUsedIsrcAndMark', async (req, res, next) => {
  const response = await getNotUsedIsrcAndMark(req.body.limit);
  return res.status(200).send({ response });
})

router.get('/getIsrcDocByIsrcCode/:isrcCode', async (req, res, next) => {
  const response = await getIsrcDocByIsrcCodeFS(req.params.isrcCode);
  return res.status(200).send({ response });
})

router.get('/getCapifISRCs', async (req, res, next) => {
  const response = await getCapifISRCs();
  return res.status(200).send({ response });
})

router.put('/updateIsrcs', async (req, res, next) => {
  const response = await updateISRCsInFS(req.body.isrcs, req.body.updateWith);
  return res.status(200).send({ response });
});

//==================================================LOGS=====================================\\

router.post('/logToCloudLogging', async (req, res, _) => {
  let { msg, payloadData, payloadError, typeOfLog } = req.body;
  const response = await logToCloudLoggingFS(msg, payloadData, payloadError, typeOfLog);
  return res.status(200).send({ response });
})

module.exports = router;