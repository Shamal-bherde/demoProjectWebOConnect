const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const up = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};

up()
  .then(() => console.log('Database and table created successfully.'))
  .catch((error) => console.error('Error creating database and table:', error));
