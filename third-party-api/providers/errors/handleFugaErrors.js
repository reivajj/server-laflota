const handleLabelErrors = labelResponseFromFuga => {
  if (labelResponseFromFuga.id) return labelResponseFromFuga;
  if (!labelResponseFromFuga || !labelResponseFromFuga.data) return "Hubo un error inesperado. Por favor, intente nuevamente.";
  switch (labelResponseFromFuga.data.code) {
    case "DUPLICATE_LABEL_NAME":
      return "El nombre del sello ya se encuentra en uso.";
    default:
      return "Hubo un error inesperado. Por favor, intente nuevamente.";
  }
};

module.exports = { handleLabelErrors };