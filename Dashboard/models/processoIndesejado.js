'use strict';

module.exports = (sequelize, DataTypes) => {
    let ProcessoIndesejado = sequelize.define('ProcessoIndesejado', {
        idProcessoIndesejado: {
            field: 'idProcessoIndesejado',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomeProcesso: {
            field: 'nomeProcesso',
            type: DataTypes.STRING,
            allowNullL: true
        },
        fk_numAgencia: {
            field: 'fk_numAgencia',
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNullL: true
        }
    },
    {
        tableName: 'ProcessoIndesejado',
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });

    return ProcessoIndesejado;
};