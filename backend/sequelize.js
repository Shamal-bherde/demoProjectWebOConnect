const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('demoProject', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  });
  
module.exports = sequelize;
