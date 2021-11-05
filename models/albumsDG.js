const FormData = require('form-data');

const createDashGoAlbum = (albumMetaData, albumCover) => {
  const formDataAlbum = new FormData();

  formDataAlbum.append("c_line", `${albumMetaData.c_line}`);
  formDataAlbum.append("label_name", `${albumMetaData.label_name}`);
  formDataAlbum.append("p_line", `${albumMetaData.p_line}`);
  formDataAlbum.append("release_date", `${albumMetaData.release_date}`);
  formDataAlbum.append("sale_start_date", `${albumMetaData.sale_start_date}`);
  formDataAlbum.append("title", `${albumMetaData.title}`);
  formDataAlbum.append("cover", albumCover.buffer, albumCover.originalname);

  console.log("El form: ", formDataAlbum);

  return formDataAlbum;
}

module.exports = createDashGoAlbum;