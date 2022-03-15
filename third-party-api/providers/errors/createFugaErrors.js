const createHttpError = require("http-errors");
const { albumUploadCoverError } = require("../../../utils/errors.utils");

const createNoCoverFugaError = cover => {
  console.log("ERROR COVER");
  throw createHttpError(400, "NO_COVER_FILE", {
    config: { url: "/products" },
    response: {
      status: 400,
      data: { cover, code: "NO_COVER_FILE" },
      from: "Error from Axios/FUGA",
    }
  });
}

module.exports = { createNoCoverFugaError };