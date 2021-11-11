module.exports = (sequelize, DataTypes) => {

  return sequelize.define('UserArtist', {

    id: { field: 'ID', autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    
    artistName: { field: 'artist_name', type: DataTypes.TEXT, allowNull: false },
    
    artistIdLaFlota: { field: 'ArtistID_LaFlota', type: DataTypes.INTEGER, allowNull: true },
    
    userId: { field: 'UserID', type: DataTypes.INTEGER, allowNull: false },
    
    email: { type: DataTypes.TEXT, allowNull: true },
    
    artistId: { field: 'artist_id', type: DataTypes.TEXT, allowNull: true },
    
    spotifyUri: { field: 'spotify_uri', type: DataTypes.TEXT, allowNull: true },
    
    appleId: { field: 'apple_id', type: DataTypes.TEXT, allowNull: true },
    
    labelId: { field: 'label_id', type: DataTypes.INTEGER, allowNull: true },
    
    labelName: { field: 'labelname', type: DataTypes.TEXT, allowNull: true }
  
  }, {
    sequelize,
    tableName: 'wp_lf_user_artists',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
