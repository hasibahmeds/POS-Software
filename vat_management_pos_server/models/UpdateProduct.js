const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UpdateProduct = sequelize.define('UpdateProduct', {
    singleProduct: {
      type: DataTypes.JSON,
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
