const FormData = require('form-data');

const createDashGoLabel = labelMetaData => {
  const formDataLabel = new FormData();

  formDataLabel.append("name", labelMetaData.name);
  console.log("El form: ", formDataLabel);

  return formDataLabel;
}

module.exports = createDashGoLabel;