import Router from "express-promise-router";
import multer from 'multer';
import createError from 'http-errors';
import { createTrackForAlbum, getAllTracks } from "../services/providers/tracks";

const router = Router();
const upload = multer();

router.get('/', async (_, res) => {
  const response = await getAllTracks();

  if (!response.data) throw createError(400, 'Error al pedir los Tracks', { dataResponse: response });
  return res.status(200).send({ dataResponse: response.data });
});


router.post('/upload', upload.single('track'), async (req, res) => {
  const response = await createTrackForAlbum(req.body, req.file);
  
  if (!response.data.id) {
    throw createError(400, 'Error al subir un track al Album', { dataResponse: response, req })
  };

  return res.status(200).send({ response: response.data });
});

export default router;