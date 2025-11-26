require('dotenv').config();

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agenda_db',
    port: process.env.DB_PORT || 3306
  }
});
module.exports = knex;

//nn entendi nada aqui B)