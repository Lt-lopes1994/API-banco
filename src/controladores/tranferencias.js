const {
  format
} = require("date-fns");

let {
  banco,
  contas,
  depositos,
  saques,
  transferencias,
} = require("../bancodedados");

const deposito = (req, res) => {
  const {
    numero_conta,
    valor
  } = req.body;

  if (!numero_conta || !valor) {
    res.status(400).json({
      mensagem: "O número da conta e o valor são obrigatórios!",
    });
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta.",
    });
  }

  if (valor < 1) {
    return res.status(400).json({
      mensagem: "Valor não pode ser menor que 1.",
    });
  } else {
    conta.saldo = conta.saldo + Number(valor);
  }

  const deposito = {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor,
  };

  depositos.push(deposito);

  return res.status(200).json(deposito);
};

const saque = (req, res) => {
  const {
    numero_conta,
    valor,
    senha
  } = req.body;

  if (!numero_conta || !valor || !senha) {
    res.status(400).json({
      mensagem: "O número da conta, valor e senha são obrigatórios!",
    });
  }

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta.",
    });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(400).json({
      mensagem: "Senha inválida.",
    });
  }

  if (conta.saldo < valor) {
    return res.status(400).json({
      mensagem: "O valor não pode ser menor que zero!",
    });
  } else {
    conta.saldo = conta.saldo - valor;
  }

  const saque = {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor,
  };

  saques.push(saque);

  return res.status(204).json();
};

const transferencia = (req, res) => {
  const {
    numero_conta_origem,
    numero_conta_destino,
    valor,
    senha
  } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    res.status(400).json({
      mensagem: "Itens obrigatórios não preenchidos."
    })
  }

  const contaOrigem = contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });

  if (!contaOrigem) {
    return res.status(400).json({
      mensagem: "Conta de origem não encontrada.",
    });
  }

  const contaDestino = contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });

  if (!contaOrigem) {
    return res.status(400).json({
      mensagem: "Conta de de destino não encontrada.",
    });
  }

  if (contaOrigem.usuario.senha !== senha) {
    return res.status(400).json({
      mensagem: "Senha inválida.",
    });
  }

  if (contaOrigem.saldo < valor) {
    return res.status(400).json({
      mensagem: "Saldo insuficiente",
    });
  }

  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  const transferencia = {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta_origem,
    numero_conta_destino,
    valor
  }

  transferencias.push(transferencia);

  return res.status(204).json();
};

const verificarSaldo = (req, res) => {
  const {
    numero_conta,
    senha
  } = req.query;

  if (!numero_conta || !senha) {
    res.status(400).json({
      mensagem: "O número da conta e a senha são obrigatórios!",
    });
  };

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta.",
    });
  }


  if (conta.usuario.senha !== senha) {
    res.status(400).json({
      mensagem: "Senha inválida!",
    });
  }

  return res.json({
    saldo: conta.saldo
  })
}

const verificarExtrato = (req, res) => {
  const {
    numero_conta,
    senha
  } = req.query;

  if (!numero_conta || !senha) {
    res.status(400).json({
      mensagem: "O número da conta e a senha são obrigatórios!",
    });
  };

  const conta = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if (!conta) {
    return res.status(400).json({
      mensagem: "Não existe esse número de conta.",
    });
  }


  if (conta.usuario.senha !== senha) {
    res.status(400).json({
      mensagem: "Senha inválida!",
    });
  }

  const deposito = depositos.filter(deposito => deposito.numero_conta === Number(numero_conta));
  const saque = saques.filter(saque => saque.numero_conta === Number(numero_conta));
  const tranferenciasEnviadas = transferencias.filter((transferencia) => {
    transferencia.numero_conta === Number(numero_conta_origem)
  });
  const tranferenciasRecebidas = transferencias.filter((transferencia) => {
    transferencia.numero_conta === Number(numero_conta_destino)
  });

  return res.json({
    depositos: deposito,
  })
};

module.exports = {
  deposito,
  saque,
  transferencia,
  verificarExtrato,
  verificarSaldo,
};