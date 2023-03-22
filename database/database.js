// Arquivo que faz a conexão com o banco de dados
require("dotenv").config()

// ORM que auxilia na conexão com o banco de dados utilzando javascript
const Sequelize = require('sequelize')  // importando o Sequelize

// constante que cria a conexão
const connection = new Sequelize(process.env.DB_NAME,process.env.USER,
    process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: 'mysql'
})

//exportar o modulo de conexão com o banco de dados para poder utilizar no arquivo 
// index.js
module.exports = connection;