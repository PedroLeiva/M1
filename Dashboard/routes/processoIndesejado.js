var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var processoIndesejado = require('../models').ProcessoIndesejado;

router.get('/excluir/:id', (req, res, next) => {
    console.log('Excluindo processo...');

    var id = req.params.id;

    let instrucaoSql = `delete from ProcessoIndesejado where idProcessoIndesejado=${id}`;
    
    console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: processoIndesejado
	}).then(()=>{
		res.status(200).send('Funcionário excluído com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao deletar funcionário....');
	});
}); 

router.post('/cadastrar', function (req, res, next) {
	console.log('Cadastrando processo indesejado');
	var nome = req.body.nomeProcesso;
	var numAgencia = req.body.numAgencia;

	let instrucaoSql = `insert into ProcessoIndesejado(nomeProcesso, fk_numAgencia) values ('${nome}', ${numAgencia})`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: processoIndesejado
	}).then(()=>{
		res.status(200).send('Processo cadastrado com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao cadastrar o processo...');
	});
});

router.get('/processoIndesejado/:numAgencia', (req, res, next) => {
    console.log('Recuperando processos da agencia');

    var numAgencia = req.params.numAgencia;
    // let instrucaoSql = `select idProcessoIndesejado, nomeProcesso from ProcessoIndesejado where fk_numAgencia = ${numAgencia}`;
    let instrucaoSql = `select idProcessoIndesejado, nomeProcesso, fk_numAgencia from ProcessoIndesejado where fk_numAgencia = ${numAgencia}`;
    
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: processoIndesejado
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

router.get('/', (req, res, next) => {
    console.log('Recuperando todos os usuarios');
    processoIndesejado.findAndCountAll().then(resultado => {
        console.log(`${resultado.count} registros`);
        res.json(resultado.rows);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
});

module.exports = router;