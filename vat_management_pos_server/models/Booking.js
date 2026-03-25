const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  bookQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'bookings' /* Booking table refers to active items in cart/book list */
});

module.exports = Booking;
