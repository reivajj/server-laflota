module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RegaliasDgPayouts', {
    TransactionID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency_rate: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "'1'"
    },
    historic_total: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    already_paid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    transfer_total: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    transfer_total_ars: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    comision_ars_bank: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    transfer_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    UserCUIT: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UserName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    UserLastName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cupon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paypal_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank_cbu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mercadopago_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PAYPAL_TRS_ID: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PAYPAL_STATUS: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PAYPAL_FEE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ESTADO: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'wp_lf_regalias_dg_payouts',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TransactionID" },
        ]
      },
    ]
  });
};
