const delivery = require("express-promise-router")({ mergeParams: true });
const { getAlbumDeliveryInstructions, addArrayOfDspsToDeliver, deliverAlbumForArrayOfDsps, takedownAlbumForArrayOfDsps,
  deleteAlbumForArrayOfDsps,
  redeliverAllAlbumDsps, 
  redeliverAlbumForArrayOfDsps} = require("../services/providers/delivery");

// Viene de /:albumId/delivery_instructions

delivery.get('/', async (req, res, _) => {
  const response = await getAlbumDeliveryInstructions(req.params.albumId);
  console.log("RESPONSE: ", response);
  return res.status(200).send({ response: response.data });
});

delivery.put('/edit', async (req, res, _) => {
  const response = await addArrayOfDspsToDeliver(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
});

delivery.post('/deliver', async (req, res, _) => {
  const response = await deliverAlbumForArrayOfDsps(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
});

delivery.post('/takedown', async (req, res, _) => {
  const response = await takedownAlbumForArrayOfDsps(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
});

delivery.delete('/', async (req, res, _) => {
  const response = await deleteAlbumForArrayOfDsps(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
});

delivery.post('/redeliver_all', async (req, res, _) => {
  const response = await redeliverAllAlbumDsps(req.params.albumId);
  return res.status(200).send({ response: response.data });
});

delivery.post('/redeliver', async (req, res, _) => {
  const response = await redeliverAlbumForArrayOfDsps(req.params.albumId, req.body);
  return res.status(200).send({ response: response.data });
});


module.exports = delivery;