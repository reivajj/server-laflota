const hasher = require('wordpress-hash-node');
const { axiosDGInstance } = require('../../config/axiosConfig');
const { getAllUsersFromDB, getUserByEmailFromDB, getCountUsersFromDB, getAllArtistsFromLFByUserFromDB } = require("../../db/users");

const getAllUsersWP = async () => {
  const response = await getAllUsersFromDB();
  return response;
}

const getCountUsersWP = async () => {
  const response = await getCountUsersFromDB();
  return response;
}

const getUserByEmailWP = async (email) => {
  const response = await getUserByEmailFromDB(email);
  return response;
}

const loginUserWithEmailAndPwWP = async ({ email, password, userName }) => {
  const userByEmailResponse = await getUserByEmailWP(email);
  const passwordHashInDB = userByEmailResponse.user.userPass;
  const checked = hasher.CheckPassword(password, passwordHashInDB);

  return checked;
}

const getAllArtistsFromDG = async dgArtistsIds => {
  const getDGArtists = dgArtistsIds.map(async dgArtistId => {
    const responseArtistDG = await axiosDGInstance.get(`/artists/${dgArtistId}`);
    if (responseArtistDG.data.apple_id === null) responseArtistDG.data.apple_id = "";
    if (responseArtistDG.data.spotify_uri === null) responseArtistDG.data.spotify_uri = "";
    return responseArtistDG.data;
  })

  return Promise.all(getDGArtists).then(resultDgArtists => resultDgArtists).catch(error => error);
}

const getUserArtistsByEmailFromDG = async email => {
  const { exist, user } = await getUserByEmailFromDB(email);
  if (!exist) return "No existe el Email en La Flota";
  let artistsFromWP = await getAllArtistsFromLFByUserFromDB(user.id);
  if (artistsFromWP === "El usuario no tiene Artistas") return "El usuario no tiene Artistas";
  let artistsFromDG = await getAllArtistsFromDG(artistsFromWP.map(artistInWP => artistInWP.artistId));
  return artistsFromDG;
}

module.exports = { getAllUsersWP, getUserByEmailWP, loginUserWithEmailAndPwWP, getCountUsersWP, getUserArtistsByEmailFromDG };