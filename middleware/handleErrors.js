// Handlers error should go at the END
const handleErrors = (error, _, res, __) => {
  if (error.response) {
    let axiosError = error.response;
    console.log("Error from axios: ", error);
    return res.status(axiosError.status || 500).json({
      data: axiosError.data,
      from: "Error from Axios/FUGA",
      json: error.toJSON()
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