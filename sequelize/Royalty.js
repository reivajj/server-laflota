module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Royalty', {
    saleId: { type: DataTypes.DOUBLE, allowNull: false, primaryKey: true },

    laFlotaUUID: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },

    saleStartDate: { type: DataTypes.DATEONLY, allowNull: false, },

    saleEndDate: { type: DataTypes.DATEONLY, allowNull: false },

    dsp: { type: DataTypes.TEXT, allowNull: false },

    storeName: { type: DataTypes.TEXT, allowNull: false },

    saleType: { type: DataTypes.TEXT, allowNull: false },

    saleUserType: { type: DataTypes.TEXT, allowNull: true },

    territory: { type: DataTypes.TEXT, allowNull: false },

    upc: { type: DataTypes.TEXT, allowNull: false },

    releaseFugaId: { type: DataTypes.TEXT, allowNull: false },

    releaseCatNumber: { type: DataTypes.TEXT, allowNull: false },

    label: { type: DataTypes.TEXT, allowNull: false },

    releaseArtist: { type: DataTypes.TEXT, allowNull: false },

    releaseTitle: { type: DataTypes.TEXT, allowNull: false },

    assetArtist: { type: DataTypes.TEXT, allowNull: true },

    assetTitle: { type: DataTypes.TEXT, allowNull: true },

    assetVersion: { type: DataTypes.TEXT, allowNull: true },

    assetDuration: { type: DataTypes.TEXT, allowNull: true },

    isrc: { type: DataTypes.TEXT, allowNull: true },

    assetFugaId: { type: DataTypes.TEXT, allowNull: true },

    assetOrReleaseSale: { type: DataTypes.TEXT, allowNull: false },

    releaseQuantity: { type: DataTypes.TEXT, allowNull: true },

    assetQuantity: { type: DataTypes.TEXT, allowNull: true },

    originalRevenue: { type: DataTypes.TEXT, allowNull: false },

    originalCurrency: { type: DataTypes.TEXT, allowNull: false },

    exchangeRate: { type: DataTypes.TEXT, allowNull: false },

    convertedRevenue: { type: DataTypes.TEXT, allowNull: false },

    shareDeal: { type: DataTypes.TEXT, allowNull: false },

    netRevenue: { type: DataTypes.TEXT, allowNull: false },

    netRevenueCurrency: { type: DataTypes.TEXT, allowNull: false },

    reportRunId: { type: DataTypes.TEXT, allowNull: false },

    reportId: { type: DataTypes.TEXT, allowNull: false },

    distributor: { type: DataTypes.TEXT, allowNull: false }

  }, {
    sequelize,
    tableName: 'royalties_all',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "saleId" },
        ]
      },
    ]
  });
};
