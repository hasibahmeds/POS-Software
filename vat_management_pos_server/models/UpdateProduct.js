const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UpdateProduct = sequelize.define('UpdateProduct', {
    productId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(512)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    updateQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING
    },
    lastQuantityAdd: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'updateProducts'
});

module.exports = UpdateProduct;
