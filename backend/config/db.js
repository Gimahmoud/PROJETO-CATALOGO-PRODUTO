const { Sequelize } = require('sequelize');

// Exemplo de string de conexão correta
const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/postgres', {
  dialect: 'postgres',
});

module.exports = sequelize;
