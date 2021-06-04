'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Agencia = sequelize.define('Agencia',{
	    numAgencia: {
			field: 'numAgencia',
			type: DataTypes.INTEGER,
			primaryKey: true
		},		
		nome: {
			field: 'nome',
			type: DataTypes.STRING,
			allowNull: false
		},
		cep: {
			field: 'cep',
			type: DataTypes.CHAR,
			allowNull: false
		},
		cnpj: {
			field: 'cnpj',
			type: DataTypes.CHAR,
			allowNull: false
		},
		logradouro: {
			field: 'logradouro',
			type: DataTypes.STRING,
			allowNull: false
		},
		numeroLogradouro: {
			field: 'numeroLogradouro',
			type: DataTypes.STRING,
			allowNull: false
		},
        telefone: {
			field: 'telefone',
			type: DataTypes.STRING,
			allowNull: false
		},
        senha: {
			field: 'senha',
			type: DataTypes.STRING,
			allowNull: false
		},
		fk_banco: {
			field: 'fk_banco',
			type: DataTypes.INTEGER,
			foreignKey: true,
			allowNull: false
		},
	}, 
	{
		tableName: 'Agencia', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return Agencia;
};
