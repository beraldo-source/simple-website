/* COMANDOS INICIAS DO BANCO DE DADOS */
SHOW databases;

CREATE DATABASE Projeto_Integrador;

USE Projeto_Integrador;

SHOW TABLES;



/* TABELA denuncia */

CREATE TABLE denuncia (
    id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
    tipo_violacao VARCHAR(255),
    detalhes TEXT,
    localizacao VARCHAR(255),
    anonymo VARCHAR(10),
    nome VARCHAR(255),
    rg VARCHAR(20),
    imagem VARCHAR(255)  
    id_admin INT,  
    id_visita INT,  
    FOREIGN KEY (id_admin) REFERENCES administradores(id_admin),
    FOREIGN KEY (id_visita) REFERENCES visitas(id)
);



INSERT INTO denuncia (tipo_violacao, detalhes, localizacao) VALUES ('Queimadas', '123', '-22.83416679275818, -47.046364545822144');

SELECT * FROM denuncia;

DELETE FROM denuncia;
ALTER TABLE denuncia AUTO_INCREMENT = 1;

TRUNCATE TABLE denuncia;










/* TABELA administradores */

SELECT * FROM administradores;

CREATE TABLE administradores (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL  
);

/*INSIRA ALGUM ADMIN ANTES DE TENTAR FAZER AS DENUNCIAS */
INSERT INTO administradores (usuario, senha) VALUES ('admin', '123');







/* TABELA visitas */

SELECT * FROM visitas;

CREATE TABLE visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45) NOT NULL,
    data_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE visitas;


