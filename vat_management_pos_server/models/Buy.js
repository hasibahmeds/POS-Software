const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Buy = sequelize.define('Buy', {
  bookings: {
    type: DataTypes.JSON,
    allowNull: false
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  vats: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  vatAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finalNetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.STRING
  },
  time: {
    type: DataTypes.STRING
  },
  customerName: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'buys'
});

module.exports = Buy;
