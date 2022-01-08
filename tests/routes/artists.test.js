const app = require('../../server');
const config = require('../../config');
const { artistGetArtistError, artistUpdateFieldsError, artistsInUseDeleteError, artistFieldsMissingCreateError } = require('../../utils/errors.utils');

const agent = require('supertest').agent(app)

const artistsUrl = config.artistsApi;
const artistIdCreatedWithApiDemo = 4413387581;
const inventedArtistId = 12312312313;
const artistIdInUse = 4413387581;

test('getArtists should return artists', async () => {
  const res = await agent.get(artistsUrl);
  expect(res.status).toBe(200);
  expect(res.body.response).toBeInstanceOf(Array);
  const artists = res.body.response;
  if (res.body.response.length > 0) {
    expect(artists[0].name).not.toHaveLength(0);
  }
});

test('getArtists with id should return the specified artist when success', async () => {
  const res = await agent.get(`${artistsUrl}/${artistIdCreatedWithApiDemo}`);
  expect(res.status).toBe(200);
  expect(res.body.response.id).toBe(artistIdCreatedWithApiDemo);
});

test('getArtist with wrong id should raise error', async () => {
  const res = await agent.get(`${artistsUrl}/${inventedArtistId}`);
  expect(res.body.status).toBe(404);
  expect(res.body.errorMsgToFrontEnd).toBe(artistGetArtistError);
});

test('create and delete artist ', async () => {
  const newArtist = {
    name: Math.random().toString(36),
    biography: Math.random().toString(36)
  };
  const resCreate = await agent.post(artistsUrl).send(newArtist);
  expect(resCreate.status).toBe(200);
  expect(resCreate.body.response).toHaveProperty("id");

  const resDelete = await agent.del(`${artistsUrl}/${resCreate.body.response.id}`);
  expect(resDelete.status).toBe(200);
  expect(resDelete.body.response).toBe("OK");
});

test('create artist with wrongs fields should raise error', async () => {
  const newArtistWrongsFields = {
    names: Math.random().toString(36),
    biographys: Math.random().toString(36)
  };
  const resCreate = await agent.post(artistsUrl).send(newArtistWrongsFields);
  expect(resCreate.body.status).toBe(400);
  expect(resCreate.body.errorMsgToFrontEnd).toBe(artistFieldsMissingCreateError(resCreate.body.data.context));
});

test('delete artist in use should raise specific error', async () => {
  const res = await agent.del(`${artistsUrl}/${artistIdInUse}`)
  expect(res.body.status).toBe(400);
  expect(res.body.errorMsgToFrontEnd).toBe(artistsInUseDeleteError);
});

test('changing name or biography of a created artist should update it', async () => {
  const newBiography = Math.random().toString(36);
  const newName = Math.random().toString(36);
  const fieldsToUpdate = {
    name: newName,
    biography: newBiography
  };

  const res = await agent.put(`${artistsUrl}/${artistIdCreatedWithApiDemo}`)
    .send(fieldsToUpdate);
  const artistEdited = res.body.response;
  expect(res.status).toBe(200);
  expect(artistEdited.name).toBe(fieldsToUpdate.name);
  expect(artistEdited.biography).toBe(fieldsToUpdate.biography);
});

test('trying to update a created artist with wrongs fields should raise error', async () => {
  const newName = Math.random().toString(36);
  const fieldsToUpdate = { nombre: newName, bio: "asas" };

  const res = await agent.put(`${artistsUrl}/${artistIdCreatedWithApiDemo}`)
    .send(fieldsToUpdate);
  expect(res.body.status).toBe(400);
  expect(res.body.message).toBe(artistUpdateFieldsError(fieldsToUpdate));
});