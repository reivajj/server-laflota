const { uploadArtistToProvider } = require('../../third-party-api/providers/dashgo/artists');
const createDashGoArtist = require('../../models/artists');
const getAllArtistsFromFuga = require('../../third-party-api/providers/fuga/artists');

const getAllArtists = async () => {
  const response = await getAllArtistsFromFuga();
  return response;
}

const createArtist = async artistMetadata => {
  const artistFormData = createDashGoArtist(artistMetadata);
  const response = await uploadArtistToProvider(artistFormData);
  return response;
}

module.exports = { getAllArtists, createArtist };