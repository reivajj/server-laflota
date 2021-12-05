// const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');
const createError = require('http-errors');

const agent = require('supertest').agent(app)

const labelsUrl = config.labelsApi;

test('getLabels should return labels', async () => {
  const res = await agent.get(labelsUrl);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("response");
  expect(res.body).toBeInstanceOf(Object);
  expect(res.body.response).toBeInstanceOf(Array);
});

test('create and delete label test', async () => {
  const resCreate = await agent.post(labelsUrl).send({ name: "Testing Jest" });
  expect(resCreate.status).toBe(200);
  expect(resCreate.body.response).toHaveProperty("name");
  expect(resCreate.body.response).toHaveProperty("id");

  const resDelete = await agent.del(`${labelsUrl}/${resCreate.body.response.id}`);
  expect(resDelete.status).toBe(200);
  expect(resDelete.body.response).toBe("OK");
});

test('trying to delete unexistant label raise error', async () => {
  let inventedIdLabel = 123123;
  const resDelete = await agent.del(`${labelsUrl}/${inventedIdLabel}`);
  expect(resDelete.body.status).toBeGreaterThanOrEqual(400);
  expect(resDelete.body.message).toBe("Error to delete a label in FUGA");
})