const FormData = require('form-data');

const createDashGoTrack = (trackMetaData, trackFile) => {
  const formDataTrack = new FormData();

  formDataTrack.append("album_id", trackMetaData.album_id);
  formDataTrack.append("disc_number", trackMetaData.disc_number);
  formDataTrack.append("explicit", trackMetaData.explicit);
  formDataTrack.append("position", trackMetaData.position);
  formDataTrack.append("title", trackMetaData.title);
  formDataTrack.append("track_language", trackMetaData.track_language);
  // if (trackMetaData.price) formDataTrack.append("price", trackMetaData.price);
  // if (trackMetaData.isrc) formDataTrack.append("isrc", trackMetaData.isrc);
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);

  return formDataTrack;
}

module.exports = createDashGoTrack;