module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Payout', {

    id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    ownerEmail: { type: DataTypes.STRING(100), allowNull: true },

    requestDate: { type: DataTypes.DATEONLY, allowNull: false, },

    transferDate: { type: DataTypes.DATEONLY, allowNull: true, },

    transferMonth: { type: DataTypes.DATEONLY, allowNull: true },

    historicTotalUsd: { type: DataTypes.DOUBLE, allowNull: false },

    alreadyPaidUsd: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    currency: { type: DataTypes.STRING(5), allowNull: false },

    transferTotalUsd: { type: DataTypes.DOUBLE, allowNull: false },

    currencyRateToUsd: { type: DataTypes.DOUBLE, allowNull: false },

    transferTotalAskedCurrency: { type: DataTypes.DOUBLE, allowNull: true },

    comissionAskedCurrency: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    comissionCurrency: { type: DataTypes.STRING(5), allowNull: true, defaultValue: "" },

    comissionUsd: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    taxesUsd: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    taxesOtherCurrency: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    taxesCurrency: { type: DataTypes.STRING(5), allowNull: true, defaultValue: "" },

    cbuCvuAlias: { type: DataTypes.STRING(40), allowNull: true },

    cupon: { type: DataTypes.STRING(100), allowNull: true },

    payoneerEmail: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    payoneerFee: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    payoneerId: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    paypalEmail: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    paypalFee: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },

    paypalId: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    otherPayId: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    mpId: { type: DataTypes.STRING(255), allowNull: true, defaultValue: "" },

    status: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "REQUESTED" },

    userCuit: { type: DataTypes.STRING(30), allowNull: true, defaultValue: "" },

    ownerId: { type: DataTypes.STRING(255), allowNull: false },

    userLastName: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "" },

    userName: { type: DataTypes.STRING(50), allowNull: true, defaultValue: "" },

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
