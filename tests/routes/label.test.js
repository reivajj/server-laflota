// const supertest = require('supertest');
const app = require('../../server');
const config = require('../../config');

const agent = require('supertest').agent(app)

const labelsUrl = config.labelsApi;

test('getLabes should return labels', async () => {
  const res = await agent.get(labelsUrl);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("response");
})

