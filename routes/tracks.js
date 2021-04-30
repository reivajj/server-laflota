import Router from "express-promise-router";
import pkg from 'axios';
import multer from 'multer';
import createError from 'http-errors';
import FormData from 'form-data';

const router = Router();
const upload = multer();
const { get, post } = pkg;

router.post('/uploadTrackToAlbum', upload.single('track'), async (req, res) => {

  const formData = new FormData();

  formData.append("artist_id", req.body.artist_id);
  formData.append("album_id", req.body.album_id);
  formData.append("disc_number", req.body.disc_number);
  formData.append("explicit", req.body.explicit);
  formData.append("position", req.body.position);
  formData.append("title", req.body.title);
  formData.append("price", req.body.price);
  formData.append("track", req.file.buffer, req.file.originalname);

  console.log("El form: ", formData);

  const response = await post('https://api.dashgo.com/api/v1/tracks/', formData, {
    // You need to use `getHeaders()` in Node.js because Axios doesn't
    // automatically set the multipart form boundary in Node.
    headers: {
      ...formData.getHeaders(),
      "Content-Type": "multipart/form-data",
      "X-Access-Key": 'laflota-kladsjf-2229-5582-5222-fkgnnEAD'
    }
  });

  if (!response.data) {
    throw createError(400, 'Error al subir un Track', { dataResponse: response })
  };

  return res.status(200).send({ response: response.data, formDataSend: formData });
});

export default router;