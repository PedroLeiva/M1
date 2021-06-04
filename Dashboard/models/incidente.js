'use strict';

module.exports = (sequelize, DataTypes) => {
    let Incidente = sequelize.define('Incidente', {
        idIncidente: {
            field: 'idIncidente',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        descricaoIncidente: {
            field: 'descricaoIncidente',
            type: DataTypes.STRING,
            allowNullL: false
        },
        statusIncidente: {
            field: 'statusIncidente',
            type: DataTypes.TINYINT,
            allowNullL: false
        },
        dataHoraInicio: {
            field: 'dataHoraInicio',
            type: DataTypes.DATE,
            allowNullL: false
        },
        dataHoraFinal: {
            field: 'dataHoraFinal',
            type: DataTypes.DATE,
            allowNullL: false
        },
        fk_funcionarioSuporte: {
            field: 'fk_funcionarioSuporte',
            type: DataTypes.INTEGER,
            foreignKey: true,
            allowNullL: false
        },
        fk_historico: {
            field: 'fk_historico',
            type: DataTypes.STRING,
            foreignKey: true,
            allowNullL: false
        },
        tipoIncidente: {
            field: 'tipoIncidente',
            type: DataTypes.STRING,
        }
    },
    {
        tableName: 'Incidente',
        freezeTableName: true,
        underscored: true,
        timestamps: false
    });

    return Incidente;
};