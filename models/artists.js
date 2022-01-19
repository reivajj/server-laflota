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

const issuingOrganizationsIsOk = issuingOrgCode => {
  // check if is spotify, apple or soundcloud...
  return true;
}

const createFugaIdentifierArtist = artistMetadata => {
  let rawDataArtitstIdentifier = {};
  if (artistMetadata.name) rawDataArtitstIdentifier.name = artistMetadata.name;
  if (issuingOrganizationsIsOk(artistMetadata.issuingOrg)) rawDataArtitstIdentifier.issuing_organization = artistMetadata.issuingOrg;
  artistMetadata.newForIssuingOrg ? rawDataArtitstIdentifier.newForIssuingOrg = true : rawDataArtitstIdentifier = false;
  if (artistMetadata.identifier) rawDataArtitstIdentifier.identifier = artistMetadata.identifier;

  return rawDataArtitstIdentifier;
}

module.exports = { createFugaArtist, createFugaIdentifierArtist };