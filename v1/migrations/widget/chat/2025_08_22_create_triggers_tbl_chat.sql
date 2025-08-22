-- ! ================================================================================================================================================
-- !                                          SQL PARA CREAR TRIGGERS DE LA TABLA CHAT
-- ! ================================================================================================================================================
-- @author Ramón Dario Rozo Torres (24 de Enero de 2025)
-- @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
-- @version 1.0.0
-- v1/migrations/widget/chat/2025_08_22_create_triggers_tbl_chat.sql

-- ! ELIMINAR TRIGGERS SI EXISTEN
DROP TRIGGER IF EXISTS after_tbl_chat_insert;
DROP TRIGGER IF EXISTS after_tbl_chat_update;
DROP TRIGGER IF EXISTS before_tbl_chat_delete;

-- ! TRIGGER PARA INSERTAR REGISTRO DESPUÉS DE INSERTAR
DELIMITER //

CREATE TRIGGER after_tbl_chat_insert
AFTER INSERT ON tbl_chat
FOR EACH ROW
BEGIN
    INSERT INTO tbl_historico_chat (
        htcht_fk_id_chat,
        htcht_fecha,
        htcht_accion,
        htcht_tipo,
        htcht_remitente,
        htcht_estado,
        htcht_gestion,
        htcht_arbol,
        htcht_control_api,
        htcht_control_peticiones,
        htcht_resultado_api,
        htcht_servicio,
        htcht_autorizacion_datos_personales,
        htcht_tipo_documento,
        htcht_numero_documento,
        htcht_nombre_completo,
        htcht_sexo,
        htcht_contacto,
        htcht_correo,
        htcht_ciudad_municipio,
        htcht_canal_atencion,
        htcht_adjuntos,
        htcht_ruta_adjuntos,
        htcht_descripcion,
        htcht_registro,
        htcht_actualizacion,
        htcht_responsable
    ) VALUES (
        NEW.cht_id,
        NEW.cht_fecha,
        'Crear',
        NEW.cht_tipo,
        NEW.cht_remitente,
        NEW.cht_estado,
        NEW.cht_gestion,
        NEW.cht_arbol,
        NEW.cht_control_api,
        NEW.cht_control_peticiones,
        NEW.cht_resultado_api,
        NEW.cht_servicio,
        NEW.cht_autorizacion_datos_personales,
        NEW.cht_tipo_documento,
        NEW.cht_numero_documento,
        NEW.cht_nombre_completo,
        NEW.cht_sexo,
        NEW.cht_contacto,
        NEW.cht_correo,
        NEW.cht_ciudad_municipio,
        NEW.cht_canal_atencion,
        NEW.cht_adjuntos,
        NEW.cht_ruta_adjuntos,
        NEW.cht_descripcion,
        NEW.cht_registro,
        NEW.cht_actualizacion,
        NEW.cht_responsable
    );
END //

-- ! TRIGGER PARA INSERTAR REGISTRO DESPUÉS DE ACTUALIZAR
CREATE TRIGGER after_tbl_chat_update
AFTER UPDATE ON tbl_chat
FOR EACH ROW
BEGIN
    INSERT INTO tbl_historico_chat (
        htcht_fk_id_chat,
        htcht_fecha,
        htcht_accion,
        htcht_tipo,
        htcht_remitente,
        htcht_estado,
        htcht_gestion,
        htcht_arbol,
        htcht_control_api,
        htcht_control_peticiones,
        htcht_resultado_api,
        htcht_servicio,
        htcht_autorizacion_datos_personales,
        htcht_tipo_documento,
        htcht_numero_documento,
        htcht_nombre_completo,
        htcht_sexo,
        htcht_contacto,
        htcht_correo,
        htcht_ciudad_municipio,
        htcht_canal_atencion,
        htcht_adjuntos,
        htcht_ruta_adjuntos,
        htcht_descripcion,
        htcht_registro,
        htcht_actualizacion,
        htcht_responsable
    ) VALUES (
        NEW.cht_id,
        NEW.cht_fecha,
        'Actualizar',
        NEW.cht_tipo,
        NEW.cht_remitente,
        NEW.cht_estado,
        NEW.cht_gestion,
        NEW.cht_arbol,
        NEW.cht_control_api,
        NEW.cht_control_peticiones,
        NEW.cht_resultado_api,
        NEW.cht_servicio,
        NEW.cht_autorizacion_datos_personales,
        NEW.cht_tipo_documento,
        NEW.cht_numero_documento,
        NEW.cht_nombre_completo,
        NEW.cht_sexo,
        NEW.cht_contacto,
        NEW.cht_correo,
        NEW.cht_ciudad_municipio,
        NEW.cht_canal_atencion,
        NEW.cht_adjuntos,
        NEW.cht_ruta_adjuntos,
        NEW.cht_descripcion,
        NEW.cht_registro,
        NEW.cht_actualizacion,
        NEW.cht_responsable
    );
END //

-- ! TRIGGER PARA INSERTAR REGISTRO ANTES DE ELIMINAR
CREATE TRIGGER before_tbl_chat_delete
BEFORE DELETE ON tbl_chat
FOR EACH ROW
BEGIN
    INSERT INTO tbl_historico_chat (
        htcht_fk_id_chat,
        htcht_fecha,
        htcht_accion,
        htcht_tipo,
        htcht_remitente,
        htcht_estado,
        htcht_gestion,
        htcht_arbol,
        htcht_control_api,
        htcht_control_peticiones,
        htcht_resultado_api,
        htcht_servicio,
        htcht_autorizacion_datos_personales,
        htcht_tipo_documento,
        htcht_numero_documento,
        htcht_nombre_completo,
        htcht_sexo,
        htcht_contacto,
        htcht_correo,
        htcht_ciudad_municipio,
        htcht_canal_atencion,
        htcht_adjuntos,
        htcht_ruta_adjuntos,
        htcht_descripcion,
        htcht_registro,
        htcht_actualizacion,
        htcht_responsable
    ) VALUES (
        OLD.cht_id,
        OLD.cht_fecha,
        'Eliminar',
        OLD.cht_tipo,
        OLD.cht_remitente,
        OLD.cht_estado,
        OLD.cht_gestion,
        OLD.cht_arbol,
        OLD.cht_control_api,
        OLD.cht_control_peticiones,
        OLD.cht_resultado_api,
        OLD.cht_servicio,
        OLD.cht_autorizacion_datos_personales,
        OLD.cht_tipo_documento,
        OLD.cht_numero_documento,
        OLD.cht_nombre_completo,
        OLD.cht_sexo,
        OLD.cht_contacto,
        OLD.cht_correo,
        OLD.cht_ciudad_municipio,
        OLD.cht_canal_atencion,
        OLD.cht_adjuntos,
        OLD.cht_ruta_adjuntos,
        OLD.cht_descripcion,
        OLD.cht_registro,
        OLD.cht_actualizacion,
        OLD.cht_responsable
    );
END //

DELIMITER ;


