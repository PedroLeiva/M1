'use strict';

module.exports = (sequelize, DataTypes) => {
    let Historico = sequelize.define('Historico', {
        idHistorico: {
            field: 'idHistorico',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        usoCpu: {
            field: 'usoCpu',
            type: DataTypes.DOUBLE,
            allowNullL: false
        },
        usoRam: {
            field: 'usoRam',
            type: DataTypes.BIGINT,
            allowNullL: false
        },
        usoDisco: {
            field: 'usoDisco',
            type: DataTypes.DOUBLE,
            allowNullL: false
        },
        dataHora: {
            field: 'dataHora',
            type: DataTypes.DATE,
            allowNullL: false
        },
        fk_hostname: {
            field: 'fk_hostname',
            type: DataTypes.STRING,
            foreignKey: true,
            allowNullL: false
        },
    },
    {
        tableName: 'Historico',
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });

    return Historico;
};