const createError = require("http-errors");
const { artistUpdateFieldsError } = require("../utils/errors.utils");

const createFugaArtist = artistMetaData => {
  let artistRawData = {};
  if (artistMetaData.name) artistRawData.name = artistMetaData.name;
  if (artistMetaData.proprietary_id) artistRawData.proprietary_id = artistMetaData.proprietary_id;
  if (artistMetaData.biography) artistRawData.biography = artistMetaData.biography;

  // Esto en realidad lo deberia validad con el valiadador de inputs como middleware.
  if (!Object.keys(artistRawData).length) throw createError(400, artistUpdateFieldsError(artistMetaData), {
    config: { url: "/artists" },
    response: { status: 400, data: { code: "FIELD_REQUIRED", context: Object.keys(artistMetaData).toString() } }
  });
  return artistRawData;
}

module.exports = createFugaArtist;