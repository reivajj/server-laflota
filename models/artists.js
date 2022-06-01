const createError = require("http-errors");
const { artistUpdateFieldsError } = require("../utils/errors.utils");
const { dspIdsIdentifiers } = require("../utils/fugaVariables");
const { v4: uuidv4 } = require('uuid');
const { toTimestamp } = require("../utils/utils");

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

const getIssuingOrganization = (identifierField) => {
  const identifierDspCode = dspIdsIdentifiers[`${identifierField}`];
  return identifierDspCode;
}

const createFugaIdentifierArtist = (identifierField, identifierValue, name) => {
  let rawDataArtitstIdentifier = {};
  if (name) rawDataArtitstIdentifier.name = name;

  const identifierDspCode = getIssuingOrganization(identifierField);
  rawDataArtitstIdentifier.issuing_organization = identifierDspCode;

  if (identifierValue === "") rawDataArtitstIdentifier.newForIssuingOrg = true;
  else rawDataArtitstIdentifier.identifier = identifierValue;

  return rawDataArtitstIdentifier;
}

const createIdentifiersFromFugaToFS = fugaIdentifiers => {
  let spotifyIds = fugaIdentifiers.find(identifier => identifier.issuingOrganization.name === "Spotify");
  let appleIds = fugaIdentifiers.find(identifier => identifier.issuingOrganization.name === "Apple Music");
  return {
    spotifyIdentifierIdFuga: spotifyIds ? spotifyIds.id : "",
    appleIdentifierIdFuga: appleIds ? appleIds.id : "",
    spotify_uri: spotifyIds ? spotifyIds.identifier : "",
    apple_id: appleIds ? appleIds.identifier : ""
  }
}

module.exports = { createFugaArtist, createFugaIdentifierArtist, createIdentifiersFromFugaToFS };