

//lê o arquivo .env e joga as variáveis pra dentro
require('dotenv').config();

// configuração o knex pra conectar no MySQL
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'senac',
    database: process.env.DB_NAME || 'agenda_db',
    port: process.env.DB_PORT || 3306
  }
});
//exporta o modulo para que outros arquivos possam usar
module.exports = knex;

