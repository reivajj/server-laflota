const createFugaArtist = artistMetaData => {
  return {
    name: artistMetaData.name,
    proprietary_id: artistMetaData.proprietary_id
  }
}

module.exports = createFugaArtist;