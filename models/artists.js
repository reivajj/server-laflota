const createFugaArtist = artistMetaData => {
  let artistRawData = {};
  if (artistMetaData.name) artistRawData.name = artistMetaData.name;
  if (artistMetaData.proprietary_id) artistRawData.proprietary_id = artistMetaData.proprietary_id;
  if (artistMetaData.biography) artistRawData.biography = artistMetaData.biography;
  return artistRawData;
}

module.exports = createFugaArtist;