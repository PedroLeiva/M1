	'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let FuncionarioSuporte = sequelize.define('FuncionarioSuporte',{
		idFuncionarioSuporte: {
			field: 'idFuncionarioSuporte',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},		
		nomeCompleto: {
			field: 'nomeCompleto',
			type: DataTypes.STRING,
			allowNull: false
		},
		cpf: {
			field: 'cpf',
			type: DataTypes.CHAR,
			allowNull: false
		},
		telefone: {
			field: 'telefone',
			type: DataTypes.CHAR,
			allowNull: false
		},
		email: {
			field: 'email',
			type: DataTypes.STRING,
			allowNull: false
		},
		senha: {
			field: 'senha',
			type: DataTypes.STRING,
			allowNull: false
		},
		fk_numAgencia: {
			field: 'fk_numAgencia',
			type: DataTypes.INTEGER,
			foreignKey: true,
			allowNull: false
		},
	}, 
	{
		tableName: 'FuncionarioSuporte', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return FuncionarioSuporte;
};
