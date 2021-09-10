const mailTransporter = require('../mailing/albums');

const sendWelcome = () => {
  const dest = "javi.petri.jp@gmail.com";

  const mailOptions = {
    from: '"La Flota" <javierpetri2012@gmail.com>',
    to: dest,
    subject: `Javi Bienvenido a La Flota`,
    html: "<b>Hola</b>"
  };

  return mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error.toString(), '/ MailDest: ', dest);
    return console.log('Sended to :', dest, '/ Info: ', info);
  });

}

module.exports = { sendWelcome };