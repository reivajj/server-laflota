const nodemailer = require('nodemailer');
const config = require('../config');
const Logger = require('../loaders/logger');

// Parece que no necesita el cors, averiguar bien. Funciona sin el igual
// const cors = require('cors')({ origin: true });
// const fs = require('fs');

// laflot6 ip addres: 70.39.235.122
let transporter = nodemailer.createTransport({
  host: config.inmotionHostName,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.emailAddress, // your domain email address
    pass: config.emailPassword // your password
  }
});


//Me jode al realizar los tests!
// transporter.verify((error, success) => {
//   if (error) {
//     Logger.error(error);
//   } else {
//     Logger.info("Server Mail is ready to take our messages: ", success);
//   }
// });

module.exports = { transporter };