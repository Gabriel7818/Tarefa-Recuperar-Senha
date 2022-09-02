const Sequelize = require('sequelize');
const db = require('../database/db');

const User = db.define('goliveira_recovery', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    verificationcode: {
        type: Sequelize.STRING,
        allowNull: true,
    }
})

// Criar tabela com sequelize 
// User.sync();

// Excluir a tabelae fazer novamente 
// User.sync({force: true});

// Verificar se há alguma diferença na tabela e altera
// User.sync({alter: true});

module.exports = User;