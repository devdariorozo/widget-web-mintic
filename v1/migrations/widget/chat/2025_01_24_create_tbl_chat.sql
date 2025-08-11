-- ! ================================================================================================================================================
-- !                                                   SQL PARA CREAR TABLA CHAT 
-- ! ================================================================================================================================================
-- @author Ramón Dario Rozo Torres (24 de Enero de 2025)
-- @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
-- @version 1.0.0
-- v1/migrations/widget/chat/2025_01_24_create_tbl_chat.sql

-- ! ELIMINAR TABLA SI EXISTE
DROP TABLE IF EXISTS `tbl_chat`;

-- ! CREAR TABLA BAJO LAS SIGUIENTES ESPECIFICACIONES
CREATE TABLE `tbl_chat` (
  `cht_id` int NOT NULL AUTO_INCREMENT,
  `cht_fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cht_tipo` varchar(45) NOT NULL DEFAULT '-',
  `cht_remitente` varchar(255) NOT NULL DEFAULT '-',
  `cht_estado` varchar(45) NOT NULL DEFAULT '-',
  `cht_gestion` varchar(45) NOT NULL DEFAULT '-',
  `cht_arbol` varchar(255) NOT NULL DEFAULT '-',
  `cht_control_api` LONGTEXT,
  `cht_control_peticiones` varchar(45) NOT NULL DEFAULT 0,
  `cht_resultado_api` LONGTEXT,
  `cht_servicio` varchar(100) NOT NULL DEFAULT '-',
  `cht_autorizacion_datos_personales` varchar(45) NOT NULL DEFAULT 'No',
  `cht_tipo_documento` varchar(10) NOT NULL DEFAULT '-',
  `cht_numero_documento` varchar(45) NOT NULL DEFAULT '-',
  `cht_nombre_completo` varchar(100) NOT NULL DEFAULT '-',
  `cht_sexo` varchar(20) NOT NULL DEFAULT '-',
  `cht_contacto` varchar(45) NOT NULL DEFAULT '-',
  `cht_correo` varchar(100) NOT NULL DEFAULT '-',
  `cht_ciudad_municipio` varchar(100) NOT NULL DEFAULT '-',
  `cht_canal_atencion` varchar(100) NOT NULL DEFAULT '-',
  `cht_adjuntos` varchar(45) NOT NULL DEFAULT 'No',
  `cht_ruta_adjuntos` varchar(1000) NOT NULL DEFAULT '-',
  `cht_descripcion` varchar(255) NOT NULL DEFAULT '-',
  `cht_registro` varchar(45) NOT NULL DEFAULT 'Activo',
  `cht_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cht_responsable` varchar(45) NOT NULL DEFAULT 'Chat Web MinTic',
  PRIMARY KEY (`cht_id`)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


