
const API_URL = '/api';
const formularioContato = document.getElementById('formularioContato');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');
const inputEndereco = document.getElementById('endereco');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const listaContatos = document.getElementById('listaContatos');
const mensagemCarregando = document.getElementById('mensagemCarregando');
let contatoEmEdicao = null;

// inicializa tudo
document.addEventListener('DOMContentLoaded', () => {
  carregarContatos();
  formularioContato.addEventListener('submit', handleSubmitFormulario);
  btnCancelar.addEventListener('click', cancelarEdicao);
});

async function carregarContatos() {
  try {
    mensagemCarregando.style.display = 'block';
    listaContatos.innerHTML = '';

    const resposta = await fetch(`${API_URL}/contatos`);
    
    if (!resposta.ok) {
      throw new Error('Erro ao carregar contatos');
    }

    const contatos = await resposta.json();
    mensagemCarregando.style.display = 'none';

    if (contatos.length === 0) {
      listaContatos.innerHTML = '<div class="mensagem-vazia">Nenhum contato cadastrado.</div>';
      return;
    }

    contatos.forEach(contato => {
      const cartaoContato = criarCartaoContato(contato);
      listaContatos.appendChild(cartaoContato);
    });
  } catch (erro) {
    console.error('Erro:', erro);
    mensagemCarregando.innerHTML = 'Erro ao carregar contatos. Verifique se o servidor está rodando.';
  }
}

function criarCartaoContato(contato) {
  const div = document.createElement('div');
  div.className = 'contato-card';
  div.innerHTML = `
    <h3>${contato.nome}</h3>
    <div class="contato-info">
      <p><strong>Email:</strong> ${contato.email}</p>
      ${contato.telefone ? `<p><strong>Telefone:</strong> ${contato.telefone}</p>` : ''}
      ${contato.endereco ? `<p><strong>Endereço:</strong> ${contato.endereco}</p>` : ''}
    </div>
    <div class="contato-acoes">
      <button class="btn-editar" onclick="editarContato(${contato.id})">Editar</button>
      <button class="btn-deletar" onclick="deletarContato(${contato.id})">Deletar</button>
    </div>
  `;
  return div;
}

// editor de contato
async function editarContato(id) {
  try {
    const resposta = await fetch(`${API_URL}/contatos/${id}`);
    
    if (!resposta.ok) {
      throw new Error('Erro ao obter contato');
    }

    const contato = await resposta.json();

    // preechimento do formulário
    inputNome.value = contato.nome;
    inputEmail.value = contato.email;
    inputTelefone.value = contato.telefone || '';
    inputEndereco.value = contato.endereco || '';
    contatoEmEdicao = id;

    // mostrar botão de cancelar e mudar texto do botão salvar
    btnCancelar.style.display = 'block';
    btnSalvar.textContent = 'Atualizar Contato';

    // scroll caso precise
    formularioContato.scrollIntoView({ behavior: 'smooth' });
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao carregar contato para edição');
  }
}

// deletar o contato
async function deletarContato(id) {
  if (!confirm('Tem certeza que deseja deletar este contato?')) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/contatos/${id}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      throw new Error('Erro ao deletar contato');
    }

    alert('Contato deletado com sucesso!');
    carregarContatos();
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao deletar contato');
  }
}

// Cancelar a edição
function cancelarEdicao() {
  contatoEmEdicao = null;
  formularioContato.reset();
  btnCancelar.style.display = 'none';
  btnSalvar.textContent = 'Salvar Contato';
}

// enviar formulário
async function handleSubmitFormulario(evento) {
  evento.preventDefault();

  const dados = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    telefone: inputTelefone.value.trim(),
    endereco: inputEndereco.value.trim()
  };

  // validação se ta tudo ok
  if (!dados.nome || !dados.email) {
    alert('Nome e email são obrigatórios!');
    return;
  }

  try {
    let resposta;

    if (contatoEmEdicao) {
      // atualizar
      resposta = await fetch(`${API_URL}/contatos/${contatoEmEdicao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });
    } else {
      // criar um novo contato
      resposta = await fetch(`${API_URL}/contatos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });
    }

    if (!resposta.ok) {
      throw new Error('Erro ao salvar contato');
    }

    alert(contatoEmEdicao ? 'Contato atualizado com sucesso!' : 'Contato criado com sucesso!');
    
    // limpa o formulário
    formularioContato.reset();
    cancelarEdicao();
    carregarContatos();
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao salvar contato');
  }
}
