const config = require('../config');
const { Sequelize } = require('sequelize');
const Logger = require('./logger');
const initModels = require("../sequelize/init-models");

const sequelize = new Sequelize(config.mySqlDb.url, {
  logging: msg => Logger.info(msg),
});
console.log('Connection has been established successfully.');

const db = initModels(sequelize);

module.exports = db;
