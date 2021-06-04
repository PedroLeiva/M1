var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var caixaEletronico = require('../models').CaixaEletronico;

router.get('/agencia/:numAgencia', (req, res, next) => {
    console.log('Recuperando caixas da agencia');

    var numAgencia = req.params.numAgencia;
    let instrucaoSql = `select * from CaixaEletronico where fk_numAgencia = ${numAgencia}`;
    
    console.log(instrucaoSql);

    sequelize.query(instrucaoSql, {
        model: caixaEletronico
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
    caixaEletronico.findAndCountAll().then(resultado => {
        console.log(`${resultado.count} registros`);
        res.json(resultado.rows);
    }).catch(erro => {
        console.error(erro);
        res.status(500).send(erro.message);
    })
});

module.exports = router;