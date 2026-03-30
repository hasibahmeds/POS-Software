// This file sets up all model associations
// Import sequelize instance
const sequelize = require('../config/db');

// Import all models (associations.js is in models folder)
const User = require('./User');
const Product = require('./Product');
const Booking = require('./Booking');
const { Buy, BuyItem } = require('./Buy');
const UpdateProduct = require('./UpdateProduct');

// Define associations after all models are loaded

// Product ↔ Bookings (via productId VARCHAR)
Product.hasMany(Booking, { 
  foreignKey: 'productId', 
  sourceKey: 'productId',
  as: 'bookings'
});
Booking.belongsTo(Product, { 
  foreignKey: 'productId', 
  targetKey: 'productId',
  as: 'product'
});

// Product ↔ BuyItems (via productId VARCHAR)
Product.hasMany(BuyItem, { 
  foreignKey: 'productId', 
  sourceKey: 'productId',
  as: 'buyItems'
});
BuyItem.belongsTo(Product, { 
  foreignKey: 'productId', 
  targetKey: 'productId',
  as: 'product'
});

// Product ↔ UpdateProducts (via productId VARCHAR)
Product.hasMany(UpdateProduct, { 
  foreignKey: 'productId', 
  sourceKey: 'productId',
  as: 'updateProducts'
});
UpdateProduct.belongsTo(Product, { 
  foreignKey: 'productId', 
  targetKey: 'productId',
  as: 'product'
});

// Note: Buy ↔ BuyItems relationship is defined in Buy.js
// Buy.hasMany(BuyItem, { foreignKey: 'buyId', as: 'items' });
// BuyItem.belongsTo(Buy, { foreignKey: 'buyId' });

module.exports = {
  User,
  Product,
  Booking,
  Buy,
  BuyItem,
  UpdateProduct
};