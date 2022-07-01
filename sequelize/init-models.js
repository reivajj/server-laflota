const DataTypes = require("sequelize").DataTypes;

const _RegaliasDashgo = require("./RegaliasDashgo");
const _Royalty = require("./Royalty");
const _RegaliasDgPayouts = require("./RegaliasDgPayouts");
const _RegaliasDkPayouts = require("./RegaliasDkPayouts");
const _UserArtist = require("./UserArtist");
const _User = require("./User");
const _Payout = require("./Payout");

const initModels = sequelize => {
  const RegaliasDashgo = _RegaliasDashgo(sequelize, DataTypes);
  const RegaliasDgPayouts = _RegaliasDgPayouts(sequelize, DataTypes);
  const RegaliasDkPayouts = _RegaliasDkPayouts(sequelize, DataTypes);
  const Royalty = _Royalty(sequelize, DataTypes);
  const UserArtist = _UserArtist(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);
  const Payout = _Payout(sequelize, DataTypes);

  // Aca hago el SYNC cuando quiero crear o actualizar tablas. // Sacar async despues
  // await Payout.sync();

  return {
    RegaliasDashgo,
    RegaliasDgPayouts,
    RegaliasDkPayouts,
    Royalty,
    UserArtist,
    User,
    Payout,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
