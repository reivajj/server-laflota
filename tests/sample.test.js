const app = require('../server');
const config = require('../config');

const agent = require('supertest').agent(app)

test('api if lives, should return Im alive', async () => {
  const res = await agent.get(`/filemanagerapp/api/`);
  expect(res.status).toBe(200);
  expect(res.text).toBe("Im alive");
});