const { uploadArtistToProvider, getArtistByIdFromFuga, getAllArtistsFromFuga } = require('../../third-party-api/providers/fuga/artists');
const createFugaArtist = require('../../models/artists');

const getAllArtists = async () => {
  const response = await getAllArtistsFromFuga();
  return response;
}

const getArtistById = async artistId => {
  const response = await getArtistByIdFromFuga(artistId);
  return response;
}

const createArtist = async artistMetadata => {
  const artistFormData = createFugaArtist(artistMetadata);
  const response = await uploadArtistToProvider(artistFormData);

  return response;
}

module.exports = { getAllArtists, getArtistById, createArtist };