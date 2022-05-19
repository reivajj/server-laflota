const wpReleaseEquivalenceToFiltered = {
  ['estado-del-lanzamiento']: "wpState",
  ['album_id']: "albumWpId",
  ['artista']: "artist",
  ['release_title']: "releaseTitle",
  ['upc']: "upc",
  ['release_date']: "releaseDate",
  ['email-uploader']: "ownerEmail",
  ['userid']: "userWpId",
}

const mapWPReleaseToFilteredRelease = csvRoyaltyRow => {
  let filteredRelease = {};
  Object.keys(csvRoyaltyRow).forEach(key => filteredRelease[wpReleaseEquivalenceToFiltered[key]] = csvRoyaltyRow[key]);
  return filteredRelease;
}

module.exports = { mapWPReleaseToFilteredRelease }
