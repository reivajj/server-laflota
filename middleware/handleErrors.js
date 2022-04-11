const { handleErrorsMessagesFromFuga } = require("../third-party-api/providers/errors/handleFugaErrors");
const Logger = require('../loaders/logger');

// Handlers error should go at the END
const handleErrors = (error, __, res, _) => {
  Logger.error("Error! en handleError: ", error.response);
  if (error.response) {
    let axiosError = error.response;
    let handleErrorMsg = handleErrorsMessagesFromFuga(error.response, error.config.url, error.config.data);
    return res.status(axiosError.status || 500).json({
      status: axiosError.status,
      data: axiosError.data,
      from: "Error from Axios/FUGA",
      errorMsgToFrontEnd: handleErrorMsg
    });
  }

  return res.status(error.status || 500).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    properties: error.properties || 'no props',
  });

};

module.exports = handleErrors;