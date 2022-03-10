const express = require('express');
const {
  listarContasBancarias,
  criarContaBancaria,
  alterarDadosConta,
  deletarConta
} = require('../controladores/contas')
const {
  deposito,
  saque,
  transferencia,
  verificarExtrato,
  verificarSaldo
} = require('../controladores/tranferencias')
const {
  validarSenha
} = require('../middlewares/validacao')
const rotas = express();

rotas.get('/contas', validarSenha, listarContasBancarias);
rotas.post('/contas', criarContaBancaria)
rotas.put('/contas/:numeroConta/usuario', alterarDadosConta)
rotas.delete('/contas/:numeroConta', deletarConta)

rotas.post('/transacoes/depositar', deposito)
rotas.post('/transacoes/sacar', saque)
rotas.post('/transacoes/transferir', transferencia)
rotas.get('/contas/saldo', verificarSaldo)
rotas.get('/contas/extrato', verificarExtrato)

module.exports = rotas