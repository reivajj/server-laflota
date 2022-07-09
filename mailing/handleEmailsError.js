const createHttpError = require("http-errors");

const handleEmailErrors = (possibleError, infoResponse) => {

  if (possibleError) throw createHttpError(505, 'Error al dar la bienvenida al Usuario con el Mail', { properties: possibleError });

  if (infoResponse.rejected.length > 0 && infoResponse.accepted.length === 0) {
    return { status: 'total rejected', errorType: 'all emails rejected', info: infoResponse }
  }

  if (infoResponse.rejected.length > 0 && infoResponse.accepted.length > 0) {
    return { status: 'partial success', errorType: 'some emails rejected', info: infoResponse }
  }

  return "OK";
}

module.exports = { handleEmailErrors }