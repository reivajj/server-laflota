const DataTypes = require("sequelize").DataTypes;

const _RegaliasDashgo = require("./RegaliasDashgo");
const _RegaliasDgPayouts = require("./RegaliasDgPayouts");
const _RegaliasDkPayouts = require("./RegaliasDkPayouts");
const _UserArtist = require("./UserArtist");
const _User = require("./User");

const initModels = (sequelize) => {
  const RegaliasDashgo = _RegaliasDashgo(sequelize, DataTypes);
  const RegaliasDgPayouts = _RegaliasDgPayouts(sequelize, DataTypes);
  const RegaliasDkPayouts = _RegaliasDkPayouts(sequelize, DataTypes);
  const UserArtist = _UserArtist(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);

  return {
    RegaliasDashgo,
    RegaliasDgPayouts,
    RegaliasDkPayouts,
    UserArtist,
    User,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
