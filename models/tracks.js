import FormData from 'form-data';

export const createDashGoTrack = (trackMetaData, trackFile) => {
  const formDataTrack = new FormData();

  formDataTrack.append("album_id", trackMetaData.album_id);
  formDataTrack.append("disc_number", trackMetaData.disc_number);
  formDataTrack.append("explicit", trackMetaData.explicit);
  formDataTrack.append("position", trackMetaData.position);
  formDataTrack.append("title", trackMetaData.title);
  formDataTrack.append("sale_start_date", trackMetaData.sale_start_date);
  formDataTrack.append("artist_id", trackMetaData.artist_id);
  formDataTrack.append("price", trackMetaData.price);
  formDataTrack.append("track", trackFile.buffer, trackFile.originalname);

  return formDataTrack;
}
