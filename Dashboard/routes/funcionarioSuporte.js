var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var funcionarioSuporte = require('../models').FuncionarioSuporte;

let sessoes = [];

router.post('/autenticar', function (req, res, next) {
	console.log('Recuperando funcionário por email e senha');

	var user = req.body.user;
	var password = req.body.password;

	let instrucaoSql = `select * from FuncionarioSuporte where email='${user}' and senha='${password}'`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(resultado => {
		console.log(`Encontrados: ${resultado.length}`);

		if (resultado.length == 1) {
			sessoes.push(resultado[0].dataValues.login);
			console.log('sessoes: ', sessoes);
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

router.post('/cadastrar', function (req, res, next) {
	console.log('Cadastrando funcionario do suporte');
	var nome = req.body.nome;

	var cpf_formated = req.body.cpf;
	var cpf = cpf_formated.split('-').join('');
	cpf = cpf.split('.').join('');

	var telefone_formated = req.body.telefone;
	var telefone = telefone_formated.split('(').join('');
	telefone = telefone.split(')').join('');
	telefone = telefone.split(' ').join('');
	telefone = telefone.split('-').join('');

	var email = req.body.email;
	var senha = req.body.senha;
	var numAgencia = req.body.numAgencia;

	let instrucaoSql = `insert into FuncionarioSuporte(nomeCompleto, cpf, telefone, email, senha, fk_numAgencia) values ('${nome}', '${cpf}', '${telefone}', '${email}', '${senha}', ${numAgencia})`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(()=>{
		res.status(200).send('Funcionário cadastrado com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao cadastrar funcionário....');
	});
});

router.post('/editar', function (req, res, next) {
	console.log('Editando funcionario do suporte');
	var idFuncionario = req.body.idFuncionarioSuporte;
	var nome = req.body.nome;

	var cpf_formated = req.body.cpf;
	console.log("CPF: "+cpf_formated);

	var cpf = cpf_formated.split('-').join('');
	cpf = cpf.split('.').join('');

	var telefone_formated = req.body.telefone;
	console.log("TELEFONE: "+telefone_formated)
	var telefone = telefone_formated.split('(').join('');
	telefone = telefone.split(')').join('');
	telefone = telefone.split(' ').join('');
	telefone = telefone.split('-').join('');

	var email = req.body.email;
	var senha = req.body.senha;

	let instrucaoSql = `update FuncionarioSuporte set nomeCompleto = '${nome}', cpf = '${cpf}',  telefone = '${telefone}', email = '${email}', senha = '${senha}' where idFuncionarioSuporte = '${idFuncionario}' `;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(()=>{
		res.status(200).send('Funcionário editado com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao editar funcionário....');
	});
});

router.get('/excluir/:id', (req, res, next) => {
    console.log('Excluindo funcionário do suporte da agencia');

    var id = req.params.id;

    let instrucaoSql = `delete from FuncionarioSuporte where idFuncionarioSuporte=${id}`;
    
    console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(()=>{
		res.status(200).send('Funcionário excluído com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao deletar funcionário....');
	});
}); 

router.get('/buscarSuporte/:numAgencia', (req, res, next) => {
    console.log('Recuperando funcionário do suporte da agencia');

    var numAgencia = req.params.numAgencia;
    // let instrucaoSql = `select idProcessoIndesejado, nomeProcesso from ProcessoIndesejado where fk_numAgencia = ${numAgencia}`;
    let instrucaoSql = `select * from FuncionarioSuporte where fk_numAgencia = ${numAgencia}`;
    
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: funcionarioSuporte
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

router.post('/recuperarId', function (req, res, next) {
	console.log('Recuperando id do funcionário por email');
	var email = req.body.email;

	let instrucaoSql = `select idFuncionarioSuporte, email from FuncionarioSuporte where email='${email}'`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(resultado => {
		console.log(`Encontrados: ${resultado.length}`);

		if (resultado.length == 0) {
			res.status(403).send('Email inválido, tente novamente...');
		} else {
			res.send(resultado);
		}
	}).catch(erro => {
		console.error(erro);
		res.status(500).send(erro.message);
	});
});

router.post('/atualizarSenha', function (req, res, next) {
	console.log('Atualizando senha');

	var id = req.body.idFuncionario;
	var senha = req.body.password;

	let instrucaoSql = `update funcionarioSuporte set senha = '${senha}' where idFuncionarioSuporte = ${id}`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: funcionarioSuporte
	}).then(()=>{
		res.status(200).send('Senha atualizada com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Ops, algo deu errado...');
	});
});

router.get('/', function (req, res, next) {
	console.log('Recuperando todos os usuários');
	Usuario.findAndCountAll().then(resultado => {
		console.log(`${resultado.count} registros`);

		res.json(resultado.rows);
	}).catch(erro => {
		console.error(erro);
		res.status(500).send(erro.message);
	});
});

module.exports = router;
