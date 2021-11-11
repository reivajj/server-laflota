module.exports = (sequelize, DataTypes) => {
  
  return sequelize.define('User', {

    id: { field: 'ID', autoIncrement: true, type: DataTypes.BIGINT.UNSIGNED, allowNull: false, primaryKey: true },

    userLogin: { field: 'user_login', type: DataTypes.STRING(60), allowNull: false, defaultValue: "" },

    userPass: { field: 'user_pass', type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },

    userNicename: { field: 'user_nicename', type: DataTypes.STRING(50), allowNull: false, defaultValue: "" },

    userEmail: { field: 'user_email', type: DataTypes.STRING(100), allowNull: false, defaultValue: "" },

    userUrl: { field: 'user_url', type: DataTypes.STRING(100), allowNull: false, defaultValue: "" },

    userRegistrered: { field: 'user_registered', type: DataTypes.DATE, allowNull: false, defaultValue: "0000-00-00 00:00:00" },

    userActivationKey: { field: 'user_activation_key', type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },

    userStatus: { field: 'user_status', type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    displayName: { field: 'display_name', type: DataTypes.STRING(250), allowNull: false, defaultValue: "" },

    spam: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },

    deleted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 }

  }, {
    sequelize,
    tableName: 'wp_users',
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
      {
        name: "user_login_key",
        using: "BTREE",
        fields: [
          { name: "user_login" },
        ]
      },
      {
        name: "user_nicename",
        using: "BTREE",
        fields: [
          { name: "user_nicename" },
        ]
      },
      {
        name: "user_email",
        using: "BTREE",
        fields: [
          { name: "user_email" },
        ]
      },
    ]
  });
};
