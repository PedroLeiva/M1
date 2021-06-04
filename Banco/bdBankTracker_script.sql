create database bdBankTracker;
use bdBankTracker;

create table Banco(
	idBanco int primary key auto_increment,
    nome varchar(45),
    cep char(8),
    cnpj char(14),
    logradouro varchar(100),
    numeroLogradouro varchar(10),
    telefone char(9)
);

create table Agencia(
	numAgencia int primary key auto_increment,
    nome varchar(45),
	cep char(8),
    cnpj char(14),
    logradouro varchar(100),
    numeroLogradouro varchar(10),
	telefone char(9),
    senha varchar(45),
    fk_banco int,
    foreign key (fk_banco) references Banco (idBanco) 
);

create table ProcessosIndesejados(
	idProcessoIndesejado int primary key auto_increment,
    nomeProcesso varchar(45),
    fk_numAgencia int,
	foreign key (fk_numAgencia) references Agencia (numAgencia)
);

create table CaixaEletronico(
	hostname varchar(45) primary key,
    sistemaOperacional varchar(45),
    cpuCaixa bigint,
    processador varchar(45),
    ram bigint,
    hd bigint,
    dataFabricacao date null,
    dataRevisao date null,
    ativo char(1),
    fk_numAgencia int,
    foreign key (fk_numAgencia) references Agencia (numAgencia)
);

create table FuncionarioSuporte(
	idFuncionarioSuporte int primary key auto_increment,
    nomeCompleto varchar(60),
    cpf char(11),
    telefone char(11),
    email varchar(100),
    senha varchar(45),
    fk_numAgencia int,
	foreign key (fk_numAgencia) references Agencia (numAgencia)
);

create table Historico(
	idHistorico int primary key auto_increment,
	usoCpu Float,
    nucleos int,
    threads int,
    usoRam bigint,
    usoDisco Float,
    dataHora datetime,
    fk_hostname varchar(45),
    foreign key (fk_hostname) references CaixaEletronico (hostname)
);

create table Incidente(
	idIncidente int primary key auto_increment,
    descricaoIncidente varchar(255),
    statusIncidente boolean,
    dataHoraInicio datetime,
    dataHoraFinal datetime,
	fk_funcionarioSuporte int,
    fk_hostname varchar(45),
    foreign key (fk_funcionarioSuporte) references FuncionarioSuporte (idFuncionarioSuporte),
    foreign key (fk_hostname) references CaixaEletronico (hostname)
);

