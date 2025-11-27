//importa o express
const express = require('express');
//cria rotas com o express
const router = express.Router();
//importa as config
const knex = require('./config');

// mostrar todos os contatos
router.get('/contatos', async (req, res) => {
  try {
    const contatos = await knex('contatos').select('*');
    res.json(contatos);
  } catch (erro) {
    console.error('Erro ao listar contatos:', erro);
    res.status(500).json({ erro: 'Erro ao listar contatos' });
  }
});

// pegar um contato específico
router.get('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contato = await knex('contatos').where('id', id).first();
    
    if (!contato) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }
    
    res.json(contato);
  } catch (erro) {
    console.error('Erro ao obter contato:', erro);
    res.status(500).json({ erro: 'Erro ao obter contato' });
  }
});

// criar um contato
router.post('/contatos', async (req, res) => {
  try {
    const { nome, email, telefone, endereco } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }
    
    const [id] = await knex('contatos').insert({
      nome,
      email,
      telefone,
      endereco
    });
    
    const novoContato = await knex('contatos').where('id', id).first();
    res.status(201).json(novoContato);
  } catch (erro) {
    console.error('Erro ao criar contato:', erro);
    res.status(500).json({ erro: 'Erro ao criar contato' });
  }
});

// atualiza um contato
router.put('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, endereco } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }
    
    const contatoExistente = await knex('contatos').where('id', id).first();
    
    if (!contatoExistente) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }
    
    await knex('contatos').where('id', id).update({
      nome,
      email,
      telefone,
      endereco
    });
    
    const contatoAtualizado = await knex('contatos').where('id', id).first();
    res.json(contatoAtualizado);
  } catch (erro) {
    console.error('Erro ao atualizar contato:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar contato' });
  }
});

// deleta um contato
router.delete('/contatos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contatoExistente = await knex('contatos').where('id', id).first();
    
    if (!contatoExistente) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }
    
    await knex('contatos').where('id', id).delete();
    
    res.json({ mensagem: 'Contato deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar contato:', erro);
    res.status(500).json({ erro: 'Erro ao deletar contato' });
  }
});

module.exports = router;
