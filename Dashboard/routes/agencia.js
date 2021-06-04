var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var agencia = require('../models').Agencia;

let sessoes = [];

router.post('/autenticar', function (req, res, next) {
	console.log('Recuperando agência por número e senha');

	var number = req.body.user;
	var password = req.body.password;

	let instrucaoSql = `select * from Agencia where numAgencia=${parseInt(number)} and senha='${password}'`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: agencia
	}).then(resultado => {
		console.log(`Encontrados: ${resultado.length}`);

		if (resultado.length == 1) {
			sessoes.push(resultado[0].dataValues.login);
			console.log('sessoes: ',sessoes);
			res.json(resultado[0]);
		} else if (resultado.length == 0) {
			res.status(403).send('Login e/ou senha inválido(s)');
		} else {
			res.status(403).send('Mais de um usuário com o mesmo login e senha!');
		}

	}).catch(erro => {
		console.error(erro);
		res.status(500).send(erro.message);
	});
});

module.exports = router;
