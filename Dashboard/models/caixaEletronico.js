'use strict';

module.exports = (sequelize, DataTypes) => {
    let CaixaEletronico = sequelize.define('CaixaEletronico', {
        hostname: {
            field: 'hostname',
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false
        },
        sistemaOperacional: {
            field: 'sistemaOperacional',
            type: DataTypes.STRING,
            allowNullL: false
        },
        cpuCaixa: {
            field: 'cpuCaixa',
            type: DataTypes.BIGINT,
            allowNullL: false
        },
        processador: {
            field: 'processador',
            type: DataTypes.STRING,
            allowNullL: false
        },
        ram: {
            field: 'ram',
            type: DataTypes.BIGINT,
            allowNullL: false
        },
        hd: {
            field: 'hd',
            type: DataTypes.BIGINT,
            allowNullL: false
        },
        dataFabricacao: {
            field: 'dataFabricacao',
            type: DataTypes.DATE,
            allowNullL: false
        },
        dataRevisao: {
            field: 'dataRevisao',
            type: DataTypes.DATE,
            allowNullL: false
        },
        ativo: {
            field: 'ativo',
            type: DataTypes.CHAR,
            allowNullL: false
        },
        fk_numAgencia: {
            field: 'fk_numAgencia',
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNullL: false
        },
        nucleos: {
            field: 'nucleos',
            type: DataTypes.INTEGER,
            allowNullL: false
        },
        threads: {
            field: 'threads',
            type: DataTypes.INTEGER,
            allowNullL: false
        },
    },
    {
        tableName: 'CaixaEletronico',
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });

    return CaixaEletronico;
};