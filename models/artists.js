const FormData = require('form-data');

const createDashGoArtist = (artistMetaData) => {
  const formDataArtist = new FormData();

  formDataArtist.append("name", artistMetaData.name);
  if(artistMetaData.bio) formDataArtist.append("bio", artistMetaData.bio);
  if(artistMetaData.apple_id) formDataArtist.append("apple_id", artistMetaData.apple_id);
  if(artistMetaData.spotify_uri) formDataArtist.append("spotify_uri", artistMetaData.spotify_uri);
  
  console.log("El form: ", formDataArtist);

  return formDataArtist;
}

module.exports = createDashGoArtist;