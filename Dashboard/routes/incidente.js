var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var incidente = require('../models').Incidente;

router.post('/criar', function (req, res, next) {
	console.log('Criando incidente');
    console.log(req.body)
	var idFuncionario = req.body.idFuncionarioSuporte;
    var idHistorico = req.body.idHistorico;
    var tipoIncidente = req.body.tipoIncidente;

	let instrucaoSql = `insert into Incidente(statusIncidente, dataHoraInicio, fk_funcionarioSuporte, fk_historico, tipoIncidente) values(1, GETDATE(), ${idFuncionario}, ${idHistorico}, '${tipoIncidente}')`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: incidente
	}).then(()=>{
		res.status(200).send('Incidente aberto com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao abrir incidente.');
	});
});

router.put('/finalizarIncidente', function (req, res, next) {
	console.log('Finalizando incidente');
	var idIncidente = req.body.idIncidente;
	var descricaoIncidente = req.body.descricaoIncidente;
	
	let instrucaoSql = `update Incidente set statusIncidente = 0, descricaoIncidente = '${descricaoIncidente}', dataHoraFinal = GETDATE() where idIncidente = '${idIncidente}' `;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: incidente
	}).then(()=>{
		res.status(200).send('Incidente finalizado com sucesso!');
	}).catch(erro => {
		console.error(erro);
		res.status(500).send('Erro ao finalizar incidente.');
	});
});

router.get('/buscarIncidentes/:idFuncionarioSuporte', (req, res, next) => {
    console.log('Recuperando funcionário do suporte da agencia');
    var idFuncionarioSuporte = req.params.idFuncionarioSuporte;

    let instrucaoSql = `SELECT idIncidente, descricaoIncidente, statusIncidente, dataHoraInicio, dataHoraFinal, tipoIncidente, c.hostname, c.hd , h.usoCpu, h.usoRam, h.usoDisco
    FROM [dbo].[Incidente] i
    INNER JOIN [dbo].[Historico] h
    ON i.fk_historico = h.idHistorico
    INNER JOIN [dbo].[CaixaEletronico] c
    on h.fk_hostname = c.hostname 
    where i.fk_funcionarioSuporte = ${idFuncionarioSuporte}`;
    
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: incidente
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

router.get('/buscarTodosIncidentes', (req, res, next) => {
    console.log('Recuperando funcionário do suporte da agencia');

    let instrucaoSql = `SELECT idIncidente, descricaoIncidente, statusIncidente, dataHoraInicio, dataHoraFinal, tipoIncidente, c.hostname, c.hd , h.usoCpu, h.usoRam, h.usoDisco
    FROM [dbo].[Incidente] i
    INNER JOIN [dbo].[Historico] h
    ON i.fk_historico = h.idHistorico
    INNER JOIN [dbo].[CaixaEletronico] c
    on h.fk_hostname = c.hostname `;
    
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: incidente
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
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
