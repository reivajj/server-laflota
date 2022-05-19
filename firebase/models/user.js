const { v4: uuidv4 } = require('uuid');
const { MIGRATED } = require('../../utils/utils');

const createFBUser = userInWp => {
  let dateUpdatedOld = new Date();
  dateUpdatedOld.setFullYear(dateUpdatedOld.getFullYear() - 1);

  return {
    email: userInWp.email,
    isNewInFBSystem: true,
    userRegisteredInWp: userInWp.userRegistrered,
    userIdWp: userInWp.userIdWp,
    userStatus: MIGRATED,
    nombre: "",
    apellido: "",
    subgenerosPropios: [],
    generos: [],
    id: uuidv4(),
    usuarioActivo: false,
    ciudad: "",
    provincia: "",
    telefono: "",
    dni: "",
    imagenUrl: "",
    timestampWhenCreatedUserInFB: Date.now(),
    lastUpdateTS: dateUpdatedOld,
    rol: "user",
    plan: "charly-garcia",
    stats: {
      totalAlbums: 0,
      totalArtists: 0,
      totalLabels: 0,
      totalTracks: 0,
      totalAlbumsDeleted: 0,
      totalAlbumsTakenDown: 0,
      totalArtistsDeleted: 0,
      totalLabelsDeleted: 0,
      totalTracksDeleted: 0,
      totalArtistsInvited: 0,
      totalCollaborators: 0
    },
    withdrawals: {
      cupones: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      pesos: {
        totalAmount: 0,
        totalWithdrawals: 0
      },
      usd: {
        totalAmount: 0,
        totalWithdrawals: 0
      }
    }
  };
}
module.exports = { createFBUser };