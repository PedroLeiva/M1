var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var historico = require('../models').Historico;


/* Busca o ultimo registro do caixa */
router.get('/Atm/:hostname', (req, res, next) => {
    console.log('Recuperando ultimo registro do caixa');

    var hostname = req.params.hostname;

    let instrucaoSql = `select top 1 idHistorico, usoCpu, usoRam, usoDisco, dataHora, fk_hostname from [dbo].[Historico] where fk_hostname like '${hostname}' order by idHistorico desc;`;

    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: historico
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

router.get('/Atm/ten/:hostname', (req, res, next) => {
    console.log('Recuperando ultimos 10 registros do caixa');

    var hostname = req.params.hostname;

    let instrucaoSql = `select top 10 idHistorico, usoCpu, usoRam, usoDisco, dataHora, fk_hostname from [dbo].[Historico] where fk_hostname like '${hostname}' order by idHistorico desc;`;

    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: historico
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

/* Busca todos registro do caixa (retorna de forma decrescente) */
router.get('/Atm/All/:hostname', (req, res, next) => {
    console.log('Recuperando registros do caixa');

    var hostname = req.params.hostname;

    let instrucaoSql = `select idHistorico, usoCpu, usoRam, usoDisco, dataHora, fk_hostname from [dbo].[Historico] where fk_hostname like '${hostname}' order by idHistorico desc;`;

    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: historico
    }).then(resultado => {
        res.send(resultado);
        console.log(`Encontrados: ${resultado.length}`);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
}); 

/* Busca todos os registros */
router.get('/', (req, res, next) => {
    console.log('Recuperando todos os registros');
    historico.findAndCountAll().then(resultado => {
        console.log(`${resultado.count} registros`);
        res.json(resultado.rows);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
});

module.exports = router;