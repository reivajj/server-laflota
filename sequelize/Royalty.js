module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Royalty', {
    saleId: { type: DataTypes.DOUBLE, allowNull: false, primaryKey: true },

    laFlotaUUID: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },

    reportedMonth: { type: DataTypes.DATEONLY, allowNull: false, },

    saleStartDate: { type: DataTypes.DATEONLY, allowNull: false, },

    saleEndDate: { type: DataTypes.DATEONLY, allowNull: false },

    dsp: { type: DataTypes.STRING(100), allowNull: false },

    storeName: { type: DataTypes.STRING(100), allowNull: false },

    saleType: { type: DataTypes.TEXT, allowNull: false },

    saleUserType: { type: DataTypes.TEXT, allowNull: true },

    territory: { type: DataTypes.STRING(20), allowNull: false },

    upc: { type: DataTypes.STRING(14), allowNull: false },

    releaseFugaId: { type: DataTypes.TEXT, allowNull: false },

    releaseCatNumber: { type: DataTypes.TEXT, allowNull: false },

    label: { type: DataTypes.TEXT, allowNull: false },

    releaseArtist: { type: DataTypes.STRING(255), allowNull: false },

    releaseTitle: { type: DataTypes.STRING(255), allowNull: false },

    assetArtist: { type: DataTypes.STRING(255), allowNull: true },

    assetTitle: { type: DataTypes.STRING(255), allowNull: true },

    assetVersion: { type: DataTypes.TEXT, allowNull: true },

    assetDuration: { type: DataTypes.TEXT, allowNull: true },

    isrc: { type: DataTypes.STRING(40), allowNull: true },

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
      {
        name: "releaseArtist",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseArtist" },
        ]
      },
      {
        name: "releaseArtistByDsp",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseArtist" }, { name: "dsp" },
        ]
      },
      {
        name: "releaseArtistByTerritory",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseArtist" }, { name: "territory" },
        ]
      },
      {
        name: "releaseTitle",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseTitle" },
        ]
      },
      {
        name: "releaseTitleByDsp",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseTitle" }, { name: "dsp" },
        ]
      },
      {
        name: "albumFromArtist",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseTitle" }, { name: "releaseArtist" },
        ]
      },
      {
        name: "albumFromArtistByDsp",
        unique: false,
        using: "BTREE",
        fields: [
          { name: "releaseTitle" }, { name: "releaseArtist" }, { name: "dsp" },
        ]
      },
    ]
  });
};
