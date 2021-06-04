process.env.NODE_ENV = 'production';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var funcionarioSuporteRouter = require('./routes/funcionarioSuporte');
var agenciaRouter = require('./routes/agencia');
var caixaEletronicoRouter = require('./routes/caixaEletronico');
var historicoRouter = require('./routes/historico');
var processoIndesejadoRouter = require('./routes/processoIndesejado');
var incidenteRouter = require('./routes/incidente');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sendEmail', indexRouter);
app.use('/funcionarioSuporte', funcionarioSuporteRouter);
app.use('/agencia', agenciaRouter);
app.use('/caixaEletronico', caixaEletronicoRouter);
app.use('/historico', historicoRouter);
app.use('/processoIndesejado', processoIndesejadoRouter);
app.use('/incidente', incidenteRouter);

module.exports = app;