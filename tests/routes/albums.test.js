const app = require('../../server');
const config = require('../../config');
const { albumPublishPermissionError, albumPublishNotFoundError, albumGetAlbumError } = require('../../utils/errors.utils');

const agent = require('supertest').agent(app)

const albumsUrl = config.albumsApi;
const albumIdCreatedWithApiDemo = 4748314916;
const inventedAlbumId = 12312312313;

test('getAlbums should return albums', async () => {
  const res = await agent.get(albumsUrl);
  expect(res.status).toBe(200);
  expect(res.body.response.product).toBeInstanceOf(Array);
  const albums = res.body.response.product;
  if (res.body.response.total > 0) {
    expect(albums[0].release_format_type).toBe("ALBUM");
  }
});

test('getAlbum with id should return the specified album when success', async () => {
  const res = await agent.get(`${albumsUrl}/${albumIdCreatedWithApiDemo}`);
  expect(res.status).toBe(200);
  expect(res.body.response.id).toBe(albumIdCreatedWithApiDemo);
});

test('getAlbum with wrong id should raise error', async () => {
  const res = await agent.get(`${albumsUrl}/${inventedAlbumId}`);
  expect(res.status).toBe(404);
  expect(res.body.message).toBe(albumGetAlbumError(inventedAlbumId));
});

// test('create and delete label test', async () => {
//   const resCreate = await agent.post(labelsUrl).send({ name: "Testing Jest" });
//   expect(resCreate.status).toBe(200);
//   expect(resCreate.body.response).toHaveProperty("name");
//   expect(resCreate.body.response).toHaveProperty("id");

//   const resDelete = await agent.del(`${labelsUrl}/${resCreate.body.response.id}`);
//   expect(resDelete.status).toBe(200);
//   expect(resDelete.body.response).toBe("OK");
// });

test('trying to publish with wrong albumId should raise error', async () => {
  const resPublish = await agent.post(`${albumsUrl}/${inventedAlbumId}/publish`);
  expect(resPublish.body.status).toBe(400);
  expect(resPublish.body.message).toBe(albumPublishNotFoundError(inventedAlbumId));
});

test('trying to publish with out permission/contract should raise permission error', async () => {
  const resPublish = await agent.post(`${albumsUrl}/${albumIdCreatedWithApiDemo}/publish`);
  expect(resPublish.body.status).toBe(401);
  expect(resPublish.body.message).toBe(albumPublishPermissionError(albumIdCreatedWithApiDemo));
});

test('changing properties of a created album should update it', async () => {
  const newAlbumName = 'Prueba con Tuli y Tests';
  const newReleaseDate = "2021-12-12";
  const fieldsToUpdate = {
    name: newAlbumName,
    original_release_date: newReleaseDate
  };

  const res = await agent.put(`${albumsUrl}/${albumIdCreatedWithApiDemo}`)
    .send(fieldsToUpdate);
  const albumEdited = res.body.response;
  expect(res.status).toBe(200);
  expect(albumEdited.name).toBe(fieldsToUpdate.name);
});