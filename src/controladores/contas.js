let {
  banco,
  contas,
  depositos,
  saques,
  transferencias
} = require('../bancodedados');

const {
  validarSenha
} = require('../middlewares/validacao')


let idContas = 1

const listarContasBancarias = (req, res) => {
  validarSenha
  return res.json(contas)
}

const criarContaBancaria = (req, res) => {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body

  const contaCpf = []

  contas.forEach((conta) => {
    contaCpf.push(conta.usuario.cpf === cpf)
  })

  const cpfLista = contaCpf.find((cpf) => {
    return cpf === true
  })

  const contaEmail = []
  contas.forEach((conta) => {
    contaEmail.push(conta.usuario.email === email)
  })

  const emailLista = contaEmail.find((email) => {
    return email === true
  })

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({
      mensagem: "Campos obrigatórios não preenchidos."
    })
  }

  if (cpfLista || emailLista) {
    return res.status(400).json({
      "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
    })
  }

  const contaAdicionar = {
    numero: idContas++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    }
  }

  contas.push(contaAdicionar)

  return res.status(200).json()
}

const alterarDadosConta = (req, res) => {
  const {
    numeroConta
  } = req.params

  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta)
  })

  const contaCpf = []
  contas.forEach((conta) => {
    contaCpf.push(conta.usuario.cpf === cpf)
  })

  const cpfLista = contaCpf.find((cpf) => {
    return cpf === true
  })

  const contaEmail = []
  contas.forEach((conta) => {
    contaEmail.push(conta.usuario.email === email)
  })

  const emailLista = contaEmail.find((email) => {
    return email === true
  })

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta."
    })
  }

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({
      mensagem: "Campos obrigatórios não preenchidos."
    })
  }

  if (emailLista || cpfLista) {
    return res.status(400).json({
      "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
    })
  }

  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.email = email;
  conta.usuario.nome = nome;
  conta.usuario.senha = senha;
  conta.usuario.telefone = telefone

  return res.status(200).json()
}

const deletarConta = (req, res) => {
  const {
    numeroConta
  } = req.params

  const conta = contas.find((conta) => {
    return conta.numero === Number(numeroConta)
  })

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta."
    })
  }

  if (conta.saldo === 0) {
    contas = contas.filter((conta) => {
      return conta.numero !== Number(numeroConta)
    })
    res.status(200).json()
  } else {
    return res.status(400).json({
      "mensagem": "A conta só pode ser removida se o saldo for zero!"
    })
  }


}



module.exports = {
  listarContasBancarias,
  criarContaBancaria,
  alterarDadosConta,
  deletarConta
}