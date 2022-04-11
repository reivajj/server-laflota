const config = require('../config/index');
const winston = require('winston');

const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.File({ filename: 'la_flota_error.log', level: 'error' }),
    new winston.transports.File({ filename: 'la_flota_combined.log' }),
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      )
    })
  )
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

module.exports = LoggerInstance;