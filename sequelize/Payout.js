module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Payout', {

    id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    requestDate: { type: DataTypes.DATEONLY, allowNull: false, },

    transferDate: { type: DataTypes.DATEONLY, allowNull: true, },

    transferMonth: { type: DataTypes.DATEONLY, allowNull: true },

    alreadyPaidUsd: { type: DataTypes.DOUBLE, allowNull: true },

    comissionAskedCurrency: { type: DataTypes.DOUBLE, allowNull: true },

    comissionCurrency: { type: DataTypes.STRING(5), allowNull: true },

    comissionUsd: { type: DataTypes.DOUBLE, allowNull: true },

    currency: { type: DataTypes.STRING(5), allowNull: false },

    currencyRateToUsd: { type: DataTypes.DOUBLE, allowNull: false },

    historicTotalUsd: { type: DataTypes.DOUBLE, allowNull: false },

    transferTotalUsd: { type: DataTypes.DOUBLE, allowNull: false },

    transferTotalAskedCurrency: { type: DataTypes.DOUBLE, allowNull: true },

    taxesUsd: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    taxesOtherCurrency: { type: DataTypes.DOUBLE, allowNull: true },

    taxesCurrency: { type: DataTypes.STRING(5), allowNull: true },

    cbuCvuAlias: { type: DataTypes.STRING(40), allowNull: true },

    cupon: { type: DataTypes.STRING(100), allowNull: true },

    payoneerEmail: { type: DataTypes.STRING(255), allowNull: true },

    payoneerFee: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    payoneerId: { type: DataTypes.STRING(255), allowNull: true },

    paypalEmail: { type: DataTypes.STRING(255), allowNull: true },

    paypalEmail: { type: DataTypes.STRING(255), allowNull: true },

    paypalFee: { type: DataTypes.DOUBLE, allowNull: true },

    paypalId: { type: DataTypes.STRING(255), allowNull: true },

    status: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "REQUESTED" },

    userCuit: { type: DataTypes.STRING(30), allowNull: true },

    ownerEmail: { type: DataTypes.STRING(100), allowNull: true },

    ownerId: { type: DataTypes.STRING(255), allowNull: false },

    userLastName: { type: DataTypes.STRING(50), allowNull: true },

    userName: { type: DataTypes.STRING(50), allowNull: true },

  }, {
    sequelize,
    tableName: 'payouts',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "ownerEmail",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "ownerEmail" },
        ]
      },
      {
        name: "status",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
