const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('pos_software', process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to true to see SQL queries in console
});

module.exports = sequelize;
