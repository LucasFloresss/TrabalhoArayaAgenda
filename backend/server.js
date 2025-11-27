//importa os módulos
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const knex = require('./config');
const rotas = require('./rotas');
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// intermediação
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// rotas da API
app.use('/api', rotas);

// rota frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// inicia o servidor
async function iniciarServidor() {
  try {
    // testar conexão com o mysqwl
    await knex.raw('SELECT 1');
    console.log('Conectado ao banco de dados com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Erro ao conectar ao banco de dados:', erro);
    process.exit(1);
  }
}

iniciarServidor();
