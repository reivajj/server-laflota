import Router from "express-promise-router";
import multer from 'multer';
import createError from 'http-errors';
import { createAlbum, getAllAlbums } from '../services/providers/albums.js';

const router = Router();
const upload = multer();

router.get('/', async (_, res) => {
  const response = await getAllAlbums();

  if (!response.data) throw createError(400, 'Error al pedir los Albums', { dataResponse: response });
  return res.status(200).send({ dataResponse: response.data });
});

router.post('/upload', upload.single('cover'), async (req, res) => {
  const response = await createAlbum(req.body, req.file);
  
  if (!response.data.id) {
    throw createError(400, 'Error al subir un Album', { dataResponse: response, req })
  };

  return res.status(200).send({ response: response.data });
});

export default router;