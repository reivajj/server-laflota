const createFugaUpload = uploadMetaData => {
  let rawDataUpload = {};
  if (uploadMetaData.id !== undefined) rawDataUpload.id = uploadMetaData.id;
  if (uploadMetaData.type !== undefined) rawDataUpload.type = uploadMetaData.type;
  if (uploadMetaData.overwrite_all !== undefined) rawDataUpload.overwrite_all = uploadMetaData.overwrite_all;
  if (uploadMetaData.clear_all_encodings !== undefined) rawDataUpload.clear_all_encodings = uploadMetaData.clear_all_encodings;
  
  return rawDataUpload;
}

module.exports = createFugaUpload;