var router = require("express-promise-router")();
const multer = require('multer');
const createError = require('http-errors');
const startUploadFile = require("../services/providers/upload");

const upload = multer();

router.post('/start',upload.none() , async (req, res) => {
  console.log("Body:", req.body);
  const response = await startUploadFile(req.body);

  if (!response.data) throw createError(400, 'Error getting the UUID of the upload:', { properties: response });
  return res.status(200).send({ response: response.data });
});


// router.post('/', upload.single('track'), async (req, res) => {
//   const response = await createTrackForAlbum(req.body, req.file);
  
//   if (!response.data.id) {
//     throw createError(400, 'Error al subir un track al Album', { properties: response })
//   };

//   return res.status(200).send({ response: response.data });
// });

module.exports = router;