module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RegaliasDashgo', {
    'Transaction ID': {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    'Reported Date': {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    'Transaction Date': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Store: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Region: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    artist_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Label Name': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Album Name': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Track Artist': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UPC: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Track Title': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    VideoId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ChannelId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ISRC: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Label Track ID': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Composers: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Units: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Currency: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Product Type': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Use Type': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Revenue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Exchange Rate': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'USD Revenue': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Distribution Rate': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Net Revenue': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Deal Share': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'Cover Song': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Mechanical Deduction': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'Pub Admin Fee': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Payable: {
      type: DataTypes.TEXT,
      allowNull: false
    }
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
