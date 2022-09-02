const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const sendMail = require('../Providers/mailProvider');
const crypto = require('crypto');

exports.findAll = async (req, res) =>{
    await User.findAll({
        attributes: ['id', 'name', 'email', 'password'],
        order:[['name', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Nenhum Usuário Encontrado !`
        });
    });
};

exports.findOne = async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário Encontrado !"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        });
    };
};

exports.create = async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    let gender = dados.gender;

    await User.create(dados)
    .then( ()=>{
        /* Enviar E-mail de Cadastro */
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += '<div style="background-color:#000; margin-bottom:150px;">';
        htmlbody += '<div style="margin-top:150px;">';
        htmlbody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
        htmlbody += 'Olá {name},';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
        htmlbody += 'Sua conta foi criada com sucesso!';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Seu login é o seu email: {email}';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Sexo: {gender}';
        htmlbody += '</p>';
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{name}', name);
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{gender}', gender);
        /* ========================================================== */
        sendMail(to, cc, 'Sua Conta Foi Criada com Sucesso !', htmlbody);

        return res.json({
            erro: false,
            mensagem: 'Usuário Cadastrado com Sucesso !'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro:${err}, Usuário não Cadastrado !`
        });
    });
};

exports.update = async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário Alterado com Sucesso !'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Usuário não Alterado !`
        });
    });
};

exports.findOne2 = async (req, res) => {
    await sleep(3000);
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  const user = await User.findOne({
    attributes: ["id", "name", "email", "password"],
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: E-mail ou Senha Incorretos !",
    });
  };
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: E-mail ou Senha Incorretos !",
    });
  };
  return res.json({
    erro: false,
    mensagem: "Login Realizado com Sucesso !"
  });
};

exports.validaToken = async (req, res) => {
    await User.findByPk(req.userId, {
        attributes: ["id", "name", "email"],
    })
    .then((user) => {
        return res.status(200).json({
            erro: false,
            user,
        });
    })
    .catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: É Necessário Realizar o Login !",
        });
    });
};

exports.recovery = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (email !== user.email) {
            return res.status(404).json({
                erro: true,
                mensagem: 'Erro: Usuário não Encontrado !'
            });
        };

        const token = crypto.randomBytes(6).toString('hex')

        /* E-mail de Recuperação de Senha */
        await User.update({ verificationcode: token }, { where: { email: email } })
        .then(() => {
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += 'Olá Usuário(a), sua solicitação de troca de senha foi gerada com sucesso !';
        htmlbody += '</br>';
        htmlbody += '</br>';
        htmlbody += 'Seus dados cadastrados:';
        htmlbody += '<br>';
        htmlbody += 'E-mail: <strong>{email}</strong>';
        htmlbody += '</br>';
        htmlbody += '<br>';
        htmlbody += 'Para prosseguir com a alteração da Senha é necessário o Código abaixo:'
        htmlbody += '</br>';
        htmlbody += '<br>';
        htmlbody += 'Codigo: <strong>{token}</strong>'
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{token}', token);
        /* ======================================================== */
        sendMail(to, cc, 'Solicitação de Troca de Senha', htmlbody);
            return res.json({
                erro: false,
                mensagem: "Um Código de Verificação Foi Encaminhado para o seu E-mail !",
            });
        })
          .catch((err) => {
            return res.status(400).json({
              erro: true,
              mensagem: `Erro:${err}, Código não Enviado !`,
            });
          });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            erro:true,
            mensagem: "Erro: Não Foi Possível Encaminhar seu Código de Verificação !"
        });
    };
};

exports.updatepassword = async (req, res, next) => {
    const { email, verificationcode, password, confirmpassword} = req.body;
    const { token } = verificationcode;
    try {
        const user = await User.findOne({ verificationcode: token }, { where: { email: email }})
        if (email !== user.email) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Error: Usuário não Encontrado !'
            })
        }
        if(verificationcode !== user.verificationcode) {
            res.status(400).json({
                erro:true,
                mensagem: 'Erro: Token Inválido !'
            })
        }
        if(password !== confirmpassword) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Erro: Senha Diferente !'
            })
        }
        const newPassword = await bcrypt.hash(password, 8)
        newPassword = await User.update({ password: newPassword }, { where: { email: email } })
        .then(() => {
            return res.status(200).json({
                erro: false,
                mensagem: `Sucesso !`
            })
        }).catch((err) => {
            return res.status(400).json({
                erro: false,
                mensagem: `Erro:${err}`
            })
        })
    } catch (error) {
        next(error);
    }
};