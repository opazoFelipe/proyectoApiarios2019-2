CREATE TABLE Regiones (
  ID_region int(11) unsigned NOT NULL AUTO_INCREMENT,
  Nombre varchar(128) NOT NULL DEFAULT '',
  Ordinal varchar(4) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID_region`)
);

INSERT INTO `Regiones` (`ID_region`, `Nombre`, `Ordinal`)
VALUES
	(1,'Arica y Parinacota','XV'),
	(2,'Tarapacá','I'),
	(3,'Antofagasta','II'),
	(4,'Atacama','III'),
	(5,'Coquimbo','IV'),
	(6,'Valparaiso','V'),
	(7,'Metropolitana de Santiago','RM'),
	(8,'Libertador General Bernardo Higgins','VI'),
	(9,'Maule','VII'),
	(10,'Biobío','VIII'),
	(11,'La Araucanía','IX'),
	(12,'Los Ríos','XIV'),
	(13,'Los Lagos','X'),
	(14,'Aisén del General Carlos Ibáñez del Campo','XI'),
	(15,'Magallanes y de la Antártica Chilena','XII');

CREATE TABLE Comunas (
  ID_comuna int(11) unsigned NOT NULL AUTO_INCREMENT,
  Nombre varchar(255) NOT NULL DEFAULT '',
  ID_region int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`ID_comuna`),
  KEY `communes_regions` (`ID_region`),
  CONSTRAINT `communes_regions` FOREIGN KEY (`ID_region`) REFERENCES `Regiones` (`ID_region`)
);

INSERT INTO `Comunas` (`ID_comuna`, `Nombre`, `ID_region`)
VALUES
	(1,'Arica',1),
	(2,'Camarones',1),
	(3,'General Lagos',1),
	(4,'Putre',1),
	(5,'Alto Hospicio',2),
	(6,'Iquique',2),
	(7,'Camiña',2),
	(8,'Colchane',2),
	(9,'Huara',2),
	(10,'Pica',2),
	(11,'Pozo Almonte',2),
	(12,'Antofagasta',3),
	(13,'Mejillones',3),
	(14,'Sierra Gorda',3),
	(15,'Taltal',3),
	(16,'Calama',3),
	(17,'Ollague',3),
	(18,'San Pedro de Atacama',3),
	(19,'María Elena',3),
	(20,'Tocopilla',3),
	(21,'Chañaral',4),
	(22,'Diego de Almagro',4),
	(23,'Caldera',4),
	(24,'Copiapó',4),
	(25,'Tierra Amarilla',4),
	(26,'Alto del Carmen',4),
	(27,'Freirina',4),
	(28,'Huasco',4),
	(29,'Vallenar',4),
	(30,'Canela',5),
	(31,'Illapel',5),
	(32,'Los Vilos',5),
	(33,'Salamanca',5),
	(34,'Andacollo',5),
	(35,'Coquimbo',5),
	(36,'La Higuera',5),
	(37,'La Serena',5),
	(38,'Paihuaco',5),
	(39,'Vicuña',5),
	(40,'Combarbalá',5),
	(41,'Monte Patria',5),
	(42,'Ovalle',5),
	(43,'Punitaqui',5),
	(44,'Río Hurtado',5),
	(45,'Isla de Pascua',6),
	(46,'Calle Larga',6),
	(47,'Los Andes',6),
	(48,'Rinconada',6),
	(49,'San Esteban',6),
	(50,'La Ligua',6),
	(51,'Papudo',6),
	(52,'Petorca',6),
	(53,'Zapallar',6),
	(54,'Hijuelas',6),
	(55,'La Calera',6),
	(56,'La Cruz',6),
	(57,'Limache',6),
	(58,'Nogales',6),
	(59,'Olmué',6),
	(60,'Quillota',6),
	(61,'Algarrobo',6),
	(62,'Cartagena',6),
	(63,'El Quisco',6),
	(64,'El Tabo',6),
	(65,'San Antonio',6),
	(66,'Santo Domingo',6),
	(67,'Catemu',6),
	(68,'Llaillay',6),
	(69,'Panquehue',6),
	(70,'Putaendo',6),
	(71,'San Felipe',6),
	(72,'Santa María',6),
	(73,'Casablanca',6),
	(74,'Concón',6),
	(75,'Juan Fernández',6),
	(76,'Puchuncaví',6),
	(77,'Quilpué',6),
	(78,'Quintero',6),
	(79,'Valparaíso',6),
	(80,'Villa Alemana',6),
	(81,'Viña del Mar',6),
	(82,'Colina',7),
	(83,'Lampa',7),
	(84,'Tiltil',7),
	(85,'Pirque',7),
	(86,'Puente Alto',7),
	(87,'San José de Maipo',7),
	(88,'Buin',7),
	(89,'Calera de Tango',7),
	(90,'Paine',7),
	(91,'San Bernardo',7),
	(92,'Alhué',7),
	(93,'Curacaví',7),
	(94,'María Pinto',7),
	(95,'Melipilla',7),
	(96,'San Pedro',7),
	(97,'Cerrillos',7),
	(98,'Cerro Navia',7),
	(99,'Conchalí',7),
	(100,'El Bosque',7),
	(101,'Estación Central',7),
	(102,'Huechuraba',7),
	(103,'Independencia',7),
	(104,'La Cisterna',7),
	(105,'La Granja',7),
	(106,'La Florida',7),
	(107,'La Pintana',7),
	(108,'La Reina',7),
	(109,'Las Condes',7),
	(110,'Lo Barnechea',7),
	(111,'Lo Espejo',7),
	(112,'Lo Prado',7),
	(113,'Macul',7),
	(114,'Maipú',7),
	(115,'Ñuñoa',7),
	(116,'Pedro Aguirre Cerda',7),
	(117,'Peñalolén',7),
	(118,'Providencia',7),
	(119,'Pudahuel',7),
	(120,'Quilicura',7),
	(121,'Quinta Normal',7),
	(122,'Recoleta',7),
	(123,'Renca',7),
	(124,'San Miguel',7),
	(125,'San Joaquín',7),
	(126,'San Ramón',7),
	(127,'Santiago',7),
	(128,'Vitacura',7),
	(129,'El Monte',7),
	(130,'Isla de Maipo',7),
	(131,'Padre Hurtado',7),
	(132,'Peñaflor',7),
	(133,'Talagante',7),
	(134,'Codegua',8),
	(135,'Coínco',8),
	(136,'Coltauco',8),
	(137,'Doñihue',8),
	(138,'Graneros',8),
	(139,'Las Cabras',8),
	(140,'Machalí',8),
	(141,'Malloa',8),
	(142,'Mostazal',8),
	(143,'Olivar',8),
	(144,'Peumo',8),
	(145,'Pichidegua',8),
	(146,'Quinta de Tilcoco',8),
	(147,'Rancagua',8),
	(148,'Rengo',8),
	(149,'Requínoa',8),
	(150,'San Vicente de Tagua Tagua',8),
	(151,'La Estrella',8),
	(152,'Litueche',8),
	(153,'Marchihue',8),
	(154,'Navidad',8),
	(155,'Peredones',8),
	(156,'Pichilemu',8),
	(157,'Chépica',8),
	(158,'Chimbarongo',8),
	(159,'Lolol',8),
	(160,'Nancagua',8),
	(161,'Palmilla',8),
	(162,'Peralillo',8),
	(163,'Placilla',8),
	(164,'Pumanque',8),
	(165,'San Fernando',8),
	(166,'Santa Cruz',8),
	(167,'Cauquenes',9),
	(168,'Chanco',9),
	(169,'Pelluhue',9),
	(170,'Curicó',9),
	(171,'Hualañé',9),
	(172,'Licantén',9),
	(173,'Molina',9),
	(174,'Rauco',9),
	(175,'Romeral',9),
	(176,'Sagrada Familia',9),
	(177,'Teno',9),
	(178,'Vichuquén',9),
	(179,'Colbún',9),
	(180,'Linares',9),
	(181,'Longaví',9),
	(182,'Parral',9),
	(183,'Retiro',9),
	(184,'San Javier',9),
	(185,'Villa Alegre',9),
	(186,'Yerbas Buenas',9),
	(187,'Constitución',9),
	(188,'Curepto',9),
	(189,'Empedrado',9),
	(190,'Maule',9),
	(191,'Pelarco',9),
	(192,'Pencahue',9),
	(193,'Río Claro',9),
	(194,'San Clemente',9),
	(195,'San Rafael',9),
	(196,'Talca',9),
	(197,'Arauco',10),
	(198,'Cañete',10),
	(199,'Contulmo',10),
	(200,'Curanilahue',10),
	(201,'Lebu',10),
	(202,'Los Álamos',10),
	(203,'Tirúa',10),
	(204,'Alto Biobío',10),
	(205,'Antuco',10),
	(206,'Cabrero',10),
	(207,'Laja',10),
	(208,'Los Ángeles',10),
	(209,'Mulchén',10),
	(210,'Nacimiento',10),
	(211,'Negrete',10),
	(212,'Quilaco',10),
	(213,'Quilleco',10),
	(214,'San Rosendo',10),
	(215,'Santa Bárbara',10),
	(216,'Tucapel',10),
	(217,'Yumbel',10),
	(218,'Chiguayante',10),
	(219,'Concepción',10),
	(220,'Coronel',10),
	(221,'Florida',10),
	(222,'Hualpén',10),
	(223,'Hualqui',10),
	(224,'Lota',10),
	(225,'Penco',10),
	(226,'San Pedro de La Paz',10),
	(227,'Santa Juana',10),
	(228,'Talcahuano',10),
	(229,'Tomé',10),
	(230,'Bulnes',10),
	(231,'Chillán',10),
	(232,'Chillán Viejo',10),
	(233,'Cobquecura',10),
	(234,'Coelemu',10),
	(235,'Coihueco',10),
	(236,'El Carmen',10),
	(237,'Ninhue',10),
	(238,'Ñiquen',10),
	(239,'Pemuco',10),
	(240,'Pinto',10),
	(241,'Portezuelo',10),
	(242,'Quillón',10),
	(243,'Quirihue',10),
	(244,'Ránquil',10),
	(245,'San Carlos',10),
	(246,'San Fabián',10),
	(247,'San Ignacio',10),
	(248,'San Nicolás',10),
	(249,'Treguaco',10),
	(250,'Yungay',10),
	(251,'Carahue',11),
	(252,'Cholchol',11),
	(253,'Cunco',11),
	(254,'Curarrehue',11),
	(255,'Freire',11),
	(256,'Galvarino',11),
	(257,'Gorbea',11),
	(258,'Lautaro',11),
	(259,'Loncoche',11),
	(260,'Melipeuco',11),
	(261,'Nueva Imperial',11),
	(262,'Padre Las Casas',11),
	(263,'Perquenco',11),
	(264,'Pitrufquén',11),
	(265,'Pucón',11),
	(266,'Saavedra',11),
	(267,'Temuco',11),
	(268,'Teodoro Schmidt',11),
	(269,'Toltén',11),
	(270,'Vilcún',11),
	(271,'Villarrica',11),
	(272,'Angol',11),
	(273,'Collipulli',11),
	(274,'Curacautín',11),
	(275,'Ercilla',11),
	(276,'Lonquimay',11),
	(277,'Los Sauces',11),
	(278,'Lumaco',11),
	(279,'Purén',11),
	(280,'Renaico',11),
	(281,'Traiguén',11),
	(282,'Victoria',11),
	(283,'Corral',12),
	(284,'Lanco',12),
	(285,'Los Lagos',12),
	(286,'Máfil',12),
	(287,'Mariquina',12),
	(288,'Paillaco',12),
	(289,'Panguipulli',12),
	(290,'Valdivia',12),
	(291,'Futrono',12),
	(292,'La Unión',12),
	(293,'Lago Ranco',12),
	(294,'Río Bueno',12),
	(295,'Ancud',13),
	(296,'Castro',13),
	(297,'Chonchi',13),
	(298,'Curaco de Vélez',13),
	(299,'Dalcahue',13),
	(300,'Puqueldón',13),
	(301,'Queilén',13),
	(302,'Quemchi',13),
	(303,'Quellón',13),
	(304,'Quinchao',13),
	(305,'Calbuco',13),
	(306,'Cochamó',13),
	(307,'Fresia',13),
	(308,'Frutillar',13),
	(309,'Llanquihue',13),
	(310,'Los Muermos',13),
	(311,'Maullín',13),
	(312,'Puerto Montt',13),
	(313,'Puerto Varas',13),
	(314,'Osorno',13),
	(315,'Puero Octay',13),
	(316,'Purranque',13),
	(317,'Puyehue',13),
	(318,'Río Negro',13),
	(319,'San Juan de la Costa',13),
	(320,'San Pablo',13),
	(321,'Chaitén',13),
	(322,'Futaleufú',13),
	(323,'Hualaihué',13),
	(324,'Palena',13),
	(325,'Aisén',14),
	(326,'Cisnes',14),
	(327,'Guaitecas',14),
	(328,'Cochrane',14),
	(329,'O\higgins',14),
	(330,'Tortel',14),
	(331,'Coihaique',14),
	(332,'Lago Verde',14),
	(333,'Chile Chico',14),
	(334,'Río Ibáñez',14),
	(335,'Antártica',15),
	(336,'Cabo de Hornos',15),
	(337,'Laguna Blanca',15),
	(338,'Punta Arenas',15),
	(339,'Río Verde',15),
	(340,'San Gregorio',15),
	(341,'Porvenir',15),
	(342,'Primavera',15),
	(343,'Timaukel',15),
	(344,'Natales',15),
	(345,'Torres del Paine',15),
	(346,'Cabildo',6);

CREATE TABLE Estado (
ID_estado serial,
Descripcion mediumtext,
PRIMARY KEY (ID_estado));

CREATE TABLE RolSistema (
ID_rolSistema serial,
Descripcion mediumtext,
PRIMARY KEY (ID_rolSistema));

CREATE TABLE Apicultor (
ID_apicultor varchar(20), 
ID_estado BIGINT UNSIGNED,
ID_rolSistema BIGINT UNSIGNED,
Correo varchar(100),
Nombre varchar(50),
Apellido_paterno varchar(50),
Apellido_materno varchar(50),
Contrasena mediumtext,
Fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (ID_apicultor),
FOREIGN KEY (ID_estado) REFERENCES Estado (ID_estado),
FOREIGN KEY (ID_rolSistema) REFERENCES RolSistema (ID_rolSistema));

CREATE TABLE Rol (
ID_rol serial,
Descripcion mediumtext,
PRIMARY KEY (ID_rol));

CREATE TABLE Apiario (
ID_apiario serial,
ID_comuna int(11) unsigned NOT NULL,
Calle varchar(100),
Numero integer,
Fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_comuna) REFERENCES Comunas (ID_comuna),
PRIMARY KEY (ID_apiario));

CREATE TABLE Reina (
ID_reina serial,
Descripcion mediumtext,
Raza varchar (30),
PRIMARY KEY (ID_reina));

CREATE TABLE Origen_colmena (
ID_origen serial,
Descripcion mediumtext,
PRIMARY KEY (ID_origen));

CREATE TABLE Colmena (
ID_colmena serial,
ID_apiario BIGINT UNSIGNED,
ID_reina BIGINT UNSIGNED,
ID_origen BIGINT UNSIGNED,
Fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_apiario) REFERENCES Apiario (ID_apiario),
FOREIGN KEY (ID_reina) REFERENCES Reina (ID_reina),
FOREIGN KEY (ID_origen) REFERENCES Origen_colmena (ID_origen),
PRIMARY KEY (ID_colmena));

CREATE TABLE Cambia_reina (
ID_cambio serial PRIMARY KEY,
ID_reina_antigua BIGINT UNSIGNED,
ID_colmena BIGINT UNSIGNED,
Motivo mediumtext,
fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(ID_reina_antigua) REFERENCES Reina (ID_Reina),
FOREIGN KEY(ID_colmena) REFERENCES Colmena (ID_colmena)
);

CREATE TABLE Tipo_alza (
ID_tipoAlza serial,
Descripcion mediumtext,
Valor integer,
PRIMARY KEY (ID_tipoAlza));

create table Accion_alza (
ID_accion INT PRIMARY KEY, 
Descripcion mediumtext
);

CREATE TABLE Registro_alza (
ID_alza serial,
ID_colmena BIGINT UNSIGNED,
ID_tipoAlza BIGINT UNSIGNED,
ID_accion INT,
Cantidad INT,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_colmena) REFERENCES Colmena (ID_colmena),
FOREIGN KEY (ID_tipoAlza) REFERENCES Tipo_alza (ID_tipoAlza),
FOREIGN KEY (ID_accion) REFERENCES Accion_alza (ID_accion),
PRIMARY KEY (ID_alza));

CREATE TABLE Medida (
ID_medida serial,
Nombre varchar(20),
Simbolo varchar(5),
PRIMARY KEY (ID_medida));

CREATE TABLE Cosecha (
ID_cosecha serial,
ID_colmena BIGINT UNSIGNED,
ID_medida BIGINT UNSIGNED,
Cantidad integer,
Descripcion mediumtext,
Rut_jefe varchar (20),
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_colmena) REFERENCES Colmena (ID_colmena),
FOREIGN KEY (ID_medida) REFERENCES Medida (ID_medida),
PRIMARY KEY (ID_cosecha));

CREATE TABLE Registro_enfermedad(
ID_enfermedad serial,
ID_colmena BIGINT UNSIGNED,
Descripcion mediumtext,
Fecha date,
FOREIGN KEY (ID_colmena) REFERENCES Colmena (ID_colmena),
PRIMARY KEY (ID_enfermedad));

CREATE TABLE Muestra(
ID_muestra serial,
ID_enfermedad BIGINT UNSIGNED,
Descripcion mediumtext,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_enfermedad) REFERENCES Registro_enfermedad (ID_enfermedad),
PRIMARY KEY (ID_muestra));

CREATE TABLE Tratamiento(
ID_tratamiento serial,
ID_enfermedad BIGINT UNSIGNED,
Descripcion mediumtext,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_enfermedad) REFERENCES Registro_enfermedad (ID_enfermedad),
PRIMARY KEY (ID_tratamiento));

CREATE TABLE Genera(
ID_padre BIGINT UNSIGNED,
ID_hijo BIGINT UNSIGNED,
Fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_padre) REFERENCES Colmena (ID_colmena),
FOREIGN KEY (ID_hijo) REFERENCES Colmena (ID_colmena),
PRIMARY KEY (ID_padre, ID_hijo));

CREATE TABLE Apicultor_tiene(
ID_apicultor varchar(20),
ID_rol BIGINT UNSIGNED,
ID_apiario BIGINT UNSIGNED,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_apiario) REFERENCES Apiario (ID_apiario),
FOREIGN KEY (ID_rol) REFERENCES Rol (ID_rol),
FOREIGN KEY (ID_apicultor) REFERENCES Apicultor (ID_apicultor),
PRIMARY KEY (ID_apicultor, ID_rol, ID_apiario));

CREATE TABLE Apiario_tiene(
ID_estado BIGINT UNSIGNED,
ID_apiario BIGINT UNSIGNED,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_apiario) REFERENCES Apiario (ID_apiario),
FOREIGN KEY (ID_estado) REFERENCES Estado (ID_estado),
PRIMARY KEY (ID_estado, ID_apiario));

CREATE TABLE Reina_tiene(
ID_estado BIGINT UNSIGNED,
ID_reina BIGINT UNSIGNED,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_reina) REFERENCES Reina (ID_reina),
FOREIGN KEY (ID_estado) REFERENCES Estado (ID_estado),
PRIMARY KEY (ID_estado, ID_reina));

CREATE TABLE Colmena_tiene(
ID_estado BIGINT UNSIGNED,
ID_colmena BIGINT UNSIGNED,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_colmena) REFERENCES Colmena (ID_colmena),
FOREIGN KEY (ID_estado) REFERENCES Estado (ID_estado),
PRIMARY KEY (ID_estado, ID_colmena, Fecha));

CREATE TABLE Enfermedad_tiene(
ID_estado BIGINT UNSIGNED,
ID_enfermedad BIGINT UNSIGNED,
Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (ID_enfermedad) REFERENCES Registro_enfermedad (ID_enfermedad),
FOREIGN KEY (ID_estado) REFERENCES Estado (ID_estado),
PRIMARY KEY (ID_estado, ID_enfermedad));

INSERT INTO Estado VALUES(default, 'Activo');
INSERT INTO Estado VALUES(default, 'Inactivo');
INSERT INTO Estado VALUES(default, 'Pendiente');

INSERT INTO Rol VALUES(default, 'Dueño');
INSERT INTO Rol VALUES(default, 'Administrador');
INSERT INTO Rol VALUES(default, 'Lector');

INSERT INTO RolSistema VALUES(default, 'Administrador');
INSERT INTO RolSistema VALUES(default, 'Usuario');

INSERT INTO Medida VALUES(default, 'Kilos', 'k');
INSERT INTO Medida VALUES(default, 'Litros', 'l');
INSERT INTO Medida VALUES(default, 'Gramos', 'g');
INSERT INTO Medida VALUES(default, 'Mililitros', 'g');


INSERT INTO Tipo_alza VALUES(default, 'Alza', 2);
INSERT INTO Tipo_alza VALUES(default, 'Media Alza', 1);

INSERT INTO Origen_colmena values(default, 'Comprada');
INSERT INTO Origen_colmena values(default, 'Capturada');
INSERT INTO Origen_colmena values(default, 'Generada por otra Colmena');

INSERT INTO Accion_alza values(1, 'Alza Inicial');
INSERT INTO Accion_alza values(2, 'Agregar');
INSERT INTO Accion_alza values(3, 'Sacar');

CREATE VIEW Dueno_apicultor AS(
    SELECT apcti.ID_apiario, api.ID_apicultor, api.Nombre, api.Apellido_paterno, api.Apellido_materno
    FROM Apicultor_tiene apcti, Apicultor api
    WHERE apcti.ID_apicultor = api.ID_apicultor 
	AND ID_rol IN (SELECT ID_rol 
                    FROM Rol
                    WHERE Descripcion = "Dueño")
    
  );




