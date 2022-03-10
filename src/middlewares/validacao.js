const {
  banco,
  contas
} = require('../bancodedados')

const validarSenha = (req, res, next) => {
  if (!req.query) {
    return res.status(400).json({
      menssagem: "Senha não informada."
    })
  };

  if (req.query.senha_banco !== banco.senha) {
    return res.status(401).json({
      menssagem: "Senha incorreta. Verifique digitação"
    })
  } else {
    next()
  }
};

module.exports = {
  validarSenha,

}