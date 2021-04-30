import Router from "express-promise-router";
import multer from 'multer';
import createError from 'http-errors';
import FormData from 'form-data';
import axiosInstance from '../config/axiosConfig';

const router = Router();
const upload = multer();
const { get, post } = axiosInstance;

router.get('/getAll', async (_, res) => {

  const response = await get('/albums');

  if (!response.data) {
    throw createError(400, 'Error al buscar los Albums')
  }

  return res.status(200).send({ dataResponse: response.data });
});

router.post('/upload', upload.single('cover'), async (req, res) => {

  const formData = new FormData();

  formData.append("artist_id", `${req.body.artist_id}`);
  formData.append("c_line", `${req.body.c_line}`);
  formData.append("label_id", `${req.body.label_id}`);
  formData.append("p_line", `${req.body.p_line}`);
  formData.append("release_date", `${req.body.release_date}`);
  formData.append("sale_start_date", `${req.body.sale_start_date}`);
  formData.append("title", `${req.body.title}`);
  formData.append("cover", req.file.buffer, req.file.originalname);

  console.log("El form: ", formData);

  const response = await post('/albums', formData, {
    // You need to use `getHeaders()` in Node.js because Axios doesn't
    // automatically set the multipart form boundary in Node.
    headers: {
      ...formData.getHeaders()
    }
  });

  if (!response.data) {
    throw createError(400, 'Error al subir un Album', { dataResponse: response })
  };
  
  return res.status(200).send({ response: response.data, formDataSend: formData });
});

export default router;