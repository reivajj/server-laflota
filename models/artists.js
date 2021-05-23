const FormData = require('form-data');

const createDashGoArtist = (artistMetaData) => {
  const formDataArtist = new FormData();

  formDataArtist.append("genre", artistMetaData.genre);
  formDataArtist.append("name", artistMetaData.name);
  formDataArtist.append("bio", artistMetaData.bio);
  formDataArtist.append("label_id", artistMetaData.label_id);

  console.log("El form: ", formDataArtist);

  return formDataArtist;
}

module.exports = createDashGoArtist;