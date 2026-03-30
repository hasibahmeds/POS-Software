const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Buy = sequelize.define('Buy', {
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

// Define BuyItem model for individual items in each sale
const BuyItem = sequelize.define('BuyItem', {
  buyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'buys',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(512)
  },
  bookQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'buy_items'
});

// Define relationships
Buy.hasMany(BuyItem, { 
  foreignKey: 'buyId', 
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
BuyItem.belongsTo(Buy, { 
  foreignKey: 'buyId' 
});

module.exports = { Buy, BuyItem };
