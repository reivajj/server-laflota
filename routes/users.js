var router = require("express-promise-router")();
const getAllUsers = require("../services/providers/users");

// const multer  = require('multer');
// const upload = multer();

router.get('/', async (_, res, next) => {
  const response = await getAllUsers();
  return res.status(200).send({ response });
});

// router.post('/', upload.none(), async (req, res) => {
//   const response = await createLabel(req.body);
//   return res.status(200).send({ response: response.data });
// });

module.exports = router;