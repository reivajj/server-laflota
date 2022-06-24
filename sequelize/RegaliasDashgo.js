module.exports = function (sequelize, DataTypes) {
  return sequelize.define('RegaliasDashgo', {
    saleId: {
      field: 'Transaction ID',
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reportedDate: {
      field: 'Reported Date',
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    saleStartDate: {
      field: 'Transaction Date',
      type: DataTypes.TEXT,
      allowNull: true
    },
    dsp: {
      field: 'Store',
      type: DataTypes.TEXT,
      allowNull: false
    },
    saleUserType: {
      field: 'Use Type',
      type: DataTypes.TEXT,
      allowNull: false
    },
    territory: {
      field: 'Region',
      type: DataTypes.TEXT,
      allowNull: false
    },
    upc: {
      field: 'UPC',
      type: DataTypes.TEXT,
      allowNull: false
    },
    label: {
      field: 'Label Name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    releaseArtist: {
      field: 'artist_name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    releaseTitle: {
      field: 'Album Name',
      type: DataTypes.TEXT,
      allowNull: false
    },
    assetArtist: {
      field: 'Track Artist',
      type: DataTypes.TEXT,
      allowNull: false
    },
    assetTitle: {
      field: 'Track Title',
      type: DataTypes.TEXT,
      allowNull: false
    },
    isrc: {
      field: 'ISRC',
      type: DataTypes.TEXT,
      allowNull: false
    },
    assetOrReleaseSale: {
      field: 'Product Type',
      type: DataTypes.TEXT,
      allowNull: false
    },
    quantity: {
      field: 'Units',
      type: DataTypes.TEXT,
      allowNull: true
    },
    originalRevenue: {
      field: 'Revenue',
      type: DataTypes.TEXT,
      allowNull: false
    },
    originalCurrency: {
      field: 'Currency',
      type: DataTypes.TEXT,
      allowNull: false
    },
    exchangeRate: {
      field: 'Exchange Rate',
      type: DataTypes.TEXT,
      allowNull: true
    },
    convertedRevenue: {
      field: 'USD Revenue',
      type: DataTypes.TEXT,
      allowNull: false
    },
    shareDeal: {
      field: 'Distribution Rate',
      type: DataTypes.TEXT,
      allowNull: false
    },
    netRevenue: {
      field: 'Payable',
      type: DataTypes.TEXT,
      allowNull: false
    },

    //NO LOS USO A LOS SIGUIENTES

    labelTrackId: {
      field: 'Label Track ID',
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoId: {
      field: 'VideoId',
      type: DataTypes.TEXT,
      allowNull: true
    },
    channelId: {
      field: 'ChannelId',
      type: DataTypes.TEXT,
      allowNull: true
    },
    composers: {
      field: 'Composers',
      type: DataTypes.TEXT,
      allowNull: true
    },
    anotherNetRevenue: {
      field: 'Net Revenue',
      type: DataTypes.TEXT,
      allowNull: false
    },
    unknownShareDeal: {
      field: 'Deal Share',
      type: DataTypes.TEXT,
      allowNull: true
    },
    coverSong: {
      field: 'Cover Song',
      type: DataTypes.TEXT,
      allowNull: false
    },
    mechanicalDeduction: {
      field: 'Mechanical Deduction',
      type: DataTypes.TEXT,
      allowNull: false
    },
    pubAdminFee: {
      field: 'Pub Admin Fee',
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'wp_lf_regalias_dashgo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Transaction ID" },
        ]
      },
    ]
  });
};
