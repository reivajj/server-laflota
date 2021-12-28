const express = require('express');
const config = require('./config');
const loaders = require('./loaders');
const Logger = require('./loaders/logger');

async function startServer() {

  const app = express();
  const db = require("./loaders/sequelize");
  const firebase = require("./loaders/firebase");

  loaders({ expressApp: app });
  module.exports = app;

}

startServer();