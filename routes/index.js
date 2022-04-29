const albums = require('./albums');
const tracks = require('./tracks');
const artists = require('./artists');
const labels = require('./labels');
const users = require('./users');
const people = require('./people');
const emails = require('./emails');
const login = require('./login');
const delivery = require('./delivery');
const firebase = require('./firebase');
const spotify = require('./spotify');
const miscellaneous = require('./miscellaneous');
const csv = require('./csv');
const royalties = require('./royalties');

module.exports = {
  albums,
  tracks,
  artists,
  labels,
  users,
  people,
  emails,
  login,
  delivery,
  firebase,
  spotify,
  miscellaneous,
  csv,
  royalties
};