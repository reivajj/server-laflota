// Handlers error should go at the END
const handleErrors = (error, _, res, __) => {
  if (error.response) {
    let axiosError = error.response;
    return res.status(axiosError.status || 500).json({
      status: axiosError.status,
      message: axiosError.data.error,
      from: "Error from Axios/DashGo"
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