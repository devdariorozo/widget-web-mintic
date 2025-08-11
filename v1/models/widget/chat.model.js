// ! ================================================================================================================================================
// !                                                      MODELOS PARA CHAT
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/models/widget/chat.model.js

// ! REQUIRES
const pool = require('../../config/database.js');
const path = require('path');
require('dotenv').config({ path: './../../.env' });

// ! MODELOS
// * CREAR
const crear = async (tipoGestion, remitente, estadoChat, estadoGestion, arbol, controlApi, controlPeticiones, resultadoApi, descripcion, estadoRegistro, responsable) => {
    try {
        // todo: Sentencia SQL
        const query = `
            INSERT INTO
                tbl_chat
            SET
                cht_tipo = ?,
                cht_remitente = ?,
                cht_estado = ?,
                cht_gestion = ?,
                cht_arbol = ?,
                cht_control_api = ?,
                cht_control_peticiones = ?,
                cht_resultado_api = ?,
                cht_descripcion = ?,
                cht_registro = ?,
                cht_responsable = ?;
        `;

        // todo: Ejecutar la sentencia y retornar respuesta
        return await pool.query(query, [tipoGestion, remitente, estadoChat, estadoGestion, arbol, controlApi, controlPeticiones, resultadoApi, descripcion, estadoRegistro, responsable]);
    } catch (error) {

        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → crearChat ', error);
        return false;
    }
};

// * DUPLICADO
const verificarDuplicado = async (remitente, estadoGestion, estadoRegistro) => {
    try {
        // todo: Sentencia SQL
        const query = `
            SELECT
                cht_id AS ID_CHAT,
                cht_remitente AS REMITENTE
            FROM
                tbl_chat
            WHERE
                cht_remitente = ? 
            AND 
                cht_gestion = ?
            AND 
                cht_registro = ?;
        `;

        // todo: Ejecutar la sentencia  
        const [rows] = await pool.query(query, [remitente, estadoGestion, estadoRegistro]);

        // todo: Retornar respuesta
        return rows;
    } catch (error) {

        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → verificarDuplicado ', error);
        return false;
    }
};

// * FILTRAR
const filtrar = async (idChatWeb) => {
    try {
        // todo: Sentencia SQL
        const query = `
            SELECT
                cht_id AS ID_CHAT,
                cht_fecha AS FECHA_REGISTRO,
                cht_tipo AS TIPO,
                cht_remitente AS REMITENTE,
                cht_estado AS ESTADO,
                cht_gestion AS GESTION,
                cht_arbol AS ARBOL,
                cht_control_api AS CONTROL_API,
                cht_control_peticiones AS CONTROL_PETICIONES,
                cht_resultado_api AS RESULTADO_API,
                cht_servicio AS SERVICIO,
                cht_autorizacion_datos_personales AS AUTORIZACION_DATOS_PERSONALES,
                cht_tipo_documento AS TIPO_DOCUMENTO,
                cht_numero_documento AS NUMERO_DOCUMENTO,
                cht_nombre_completo AS NOMBRE_COMPLETO,
                cht_sexo AS SEXO,
                cht_contacto AS CONTACTO,
                cht_correo AS CORREO,
                cht_ciudad_municipio AS CIUDAD_MUNICIPIO,
                cht_canal_atencion AS CANAL_ATENCION,
                cht_adjuntos AS ADJUNTOS,
                cht_ruta_adjuntos AS RUTA_ADJUNTOS,
                cht_descripcion AS DESCRIPCION,
                cht_registro AS REGISTRO,
                cht_actualizacion AS FECHA_ACTUALIZACION,
                cht_responsable AS RESPONSABLE
            FROM
                tbl_chat
            WHERE
                cht_remitente = ?;
        `;

        // todo: Ejecutar la sentencia  
        const [rows] = await pool.query(query, [idChatWeb]);

        // todo: Retornar respuesta
        return rows;
    } catch (error) {

        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → filtrar ', error);
        return false;
    }
};

// * FORMULARIO INICIAL
const formularioInicial = async (idChatWeb, pasoArbol, servicio, autorizacionDatosPersonales, tipoDocumento, numeroDocumento, nombreCompleto, sexo, contacto, correo, ciudadMunicipio, canalAtencion, descripcion) => {
    try {
        // todo: Sentencia SQL
        const query = `
            UPDATE
                tbl_chat
            SET
                cht_arbol = ?,
                cht_servicio = ?,
                cht_autorizacion_datos_personales = ?,
                cht_tipo_documento = ?,
                cht_numero_documento = ?,
                cht_nombre_completo = ?,
                cht_sexo = ?,
                cht_contacto = ?,
                cht_correo = ?,
                cht_ciudad_municipio = ?,
                cht_canal_atencion = ?,
                cht_descripcion = ?
            WHERE
                cht_remitente = ?;
        `;

        // todo: Ejecutar la sentencia y retornar respuesta
        const result = await pool.query(query, [pasoArbol, servicio, autorizacionDatosPersonales, tipoDocumento, numeroDocumento, nombreCompleto, sexo, contacto, correo, ciudadMunicipio, canalAtencion, descripcion, idChatWeb]);

        // todo: Obtener el id del chat
        const queryIdChat = `
            SELECT
                cht_id AS ID_CHAT
            FROM
                tbl_chat
            WHERE
                cht_remitente = ?;
        `;
        const [rows] = await pool.query(queryIdChat, [idChatWeb]);
        return rows;
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → formularioInicial ', error);
        return false;
    }
};

// * FILTRAR ENLACES
const filtrarEnlaces = async (idChat) => {
    try {
        // todo: Sentencia SQL
        const query = 'SELECT cht_ruta_adjuntos AS RUTA_ADJUNTOS FROM tbl_chat WHERE cht_id = ?';
        const [rows] = await pool.query(query, [idChat]);
        return rows[0];
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → filtrarEnlaces ', error);
        return false;
    }
};

// * ERROR
const error = async (descripcion, idChat) => {
    try {
        // todo: Sentencia SQL
        const query = `
            UPDATE
                tbl_chat
            SET
                cht_descripcion = ?
            WHERE
                cht_id = ?;
        `;

        // todo: Ejecutar la sentencia y retornar respuesta
        const result = await pool.query(query, [descripcion, idChat]);
        // todo: Si se modifico el registro
        if (result[0].affectedRows > 0) {
            // todo: Retornar el id del registro
            const query = `
                SELECT
                    cht_id AS ID_CHAT
                FROM
                    tbl_chat
            WHERE
                cht_id = ?;
            `;
            const [rows] = await pool.query(query, [idChat]);
            return rows;
        }
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → error ', error);
        return false;
    }
};

// * OPCIONES CONTROL API
const opcionesControlApi = async () => {
    try {
        // todo: Sentencia SQL
        const query = `SELECT DISTINCT cht_control_api AS OPCION_CONTROL_API FROM tbl_chat`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → opcionesControlApi ', error);
        return false;
    }
};

// * MONITOR
const monitor = async (fechaInicial, fechaFinal, opcionControlApi, numeroLimite, numeroDesplazamiento) => {
    try {
        // todo: Sentencia SQL
        let query = `
            SELECT
                cht_id AS ID_CHAT,
                cht_fecha AS FECHA_REGISTRO,
                cht_tipo AS TIPO,
                cht_remitente AS REMITENTE,
                cht_estado AS ESTADO,
                cht_gestion AS GESTION,
                cht_arbol AS ARBOL,
                cht_control_api AS CONTROL_API,
                cht_control_peticiones AS CONTROL_PETICIONES,
                cht_resultado_api AS RESULTADO_API,
                cht_servicio AS SERVICIO,
                cht_autorizacion_datos_personales AS AUTORIZACION_DATOS_PERSONALES,
                cht_tipo_documento AS TIPO_DOCUMENTO,
                cht_numero_documento AS NUMERO_DOCUMENTO,
                cht_nombre_completo AS NOMBRE_COMPLETO,
                cht_sexo AS SEXO,
                cht_contacto AS CONTACTO,
                cht_correo AS CORREO,
                cht_ciudad_municipio AS CIUDAD_MUNICIPIO,
                cht_canal_atencion AS CANAL_ATENCION,
                cht_adjuntos AS ADJUNTOS,
                cht_ruta_adjuntos AS RUTA_ADJUNTOS,
                cht_descripcion AS DESCRIPCION,
                cht_registro AS REGISTRO,
                cht_actualizacion AS FECHA_ACTUALIZACION,
                cht_responsable AS RESPONSABLE
            FROM
                tbl_chat
            WHERE
                1=1
        `;

        // todo: Arreglo para los parámetros de la sentencia
        let params = [];
        
        // todo: Agregar filtro de fechas
        if (fechaInicial !== "-" && fechaFinal !== "-" && !isNaN(new Date(fechaInicial)) && !isNaN(new Date(fechaFinal))) {
            query += ` AND cht_fecha BETWEEN ? AND ?`;
            params.push(fechaInicial, fechaFinal);
        }

        // todo: Agregar filtro de control api
        if (opcionControlApi !== "*") {
            query += ` AND cht_control_api = ?`;
            params.push(opcionControlApi);
        }

        // todo: Agregar limitación y paginación
        query += ` ORDER BY cht_id DESC LIMIT ? OFFSET ?`;
        params.push(Number(numeroLimite), Number(numeroDesplazamiento));

        // todo: Ejecutar la sentencia con los parámetros proporcionados
        const [rows] = await pool.query(query, params);
        
        // todo: Sentencia para contar el total de registros
        let countQuery = `
            SELECT COUNT(*) AS totalCount
            FROM tbl_chat
            WHERE 1=1
        `;

        // todo: Arreglo para los parámetros de la sentencia
        let countParams = [];

        // todo: Agregar filtros a la sentencia de conteo
        if (fechaInicial !== "-" && fechaFinal !== "-" && !isNaN(new Date(fechaInicial)) && !isNaN(new Date(fechaFinal))) {
            countQuery += ` AND cht_fecha BETWEEN ? AND ?`;
            countParams.push(fechaInicial, fechaFinal);
        }

        // todo: Agregar filtro de control api
        if (opcionControlApi !== "*") {
            countQuery += ` AND cht_control_api = ?`;
            countParams.push(opcionControlApi);
        }

        // todo: Ejecutar la sentencia de conteo
        const [countRows] = await pool.query(countQuery, countParams);
        const totalCount = countRows[0].totalCount;

        // todo: Retornar respuesta
        return {
            totalCount,
            filteredCount: totalCount,
            data: rows
        };
    } catch (error) {

        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → monitor ', error);
        return false;
    }
};

// * LISTAR ARCHIVOS ADJUNTOS
const listarArchivosAdjuntos = async (idChat) => {
    const query = `
        SELECT SQL_NO_CACHE
            cht_adjuntos AS ADJUNTOS,
            cht_ruta_adjuntos AS RUTAS
        FROM
            tbl_chat
        WHERE
            cht_id = ?;
    `;
    const [rows] = await pool.query(query, [idChat]);
    return rows[0];
};

// * ACTUALIZAR
const actualizar = async (idChat, pasoArbol, chatData) => {
    try {
        // todo: Sentencia SQL
        const query = `
            UPDATE
                tbl_chat
            SET
                cht_arbol = ?,
                cht_control_api = ?,
                cht_control_peticiones = ?,
                cht_resultado_api = ?,
                cht_servicio = ?,
                cht_autorizacion_datos_personales = ?,
                cht_tipo_documento = ?,
                cht_numero_documento = ?,
                cht_nombre_completo = ?,
                cht_sexo = ?,
                cht_contacto = ?,
                cht_correo = ?,
                cht_ciudad_municipio = ?,
                cht_canal_atencion = ?,
                cht_adjuntos = ?,
                cht_ruta_adjuntos = ?,
                cht_descripcion = ?,
                cht_registro = ?,
                cht_responsable = ?
            WHERE
                cht_id = ?;
        `;

        // todo: Parametros de la sentencia
        const params = [
            pasoArbol,
            chatData.controlApi,
            chatData.controlPeticiones,
            chatData.resultadoApi,
            chatData.servicio,
            chatData.autorizacionDatosPersonales,
            chatData.tipoDocumento,
            chatData.numeroDocumento,
            chatData.nombreCompleto,
            chatData.sexo,
            chatData.contacto,
            chatData.correo,
            chatData.ciudadMunicipio,
            chatData.canalAtencion,
            chatData.adjuntos,
            chatData.rutaAdjuntos,
            chatData.descripcion,
            chatData.estadoRegistro,
            chatData.responsable,
            idChat
        ];

        // todo: Ejecutar la sentencia
        const [rows] = await pool.query(query, params);
        return rows[0];
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → actualizar ', error);
        return false;
    }
};

// * CERRAR
const cerrar = async (remitente, estadoChat, estadoGestion, arbol, controlApi, descripcion, estadoRegistro, responsable) => {
    try {
        // todo: Sentencia SQL
        const query = `
            UPDATE
                tbl_chat
            SET
                cht_estado = ?,
                cht_gestion = ?,
                cht_arbol = ?,
                cht_control_api = ?,
                cht_descripcion = ?,
                cht_registro = ?,
                cht_responsable = ?
            WHERE
                cht_remitente = ?;
        `;

        // todo: Ejecutar la sentencia y retornar respuesta
        const result = await pool.query(query, [estadoChat, estadoGestion, arbol, controlApi, descripcion, estadoRegistro, responsable, remitente]);
        // todo: Si se modifico el registro
        if (result[0].affectedRows > 0) {
            // todo: Retornar el id del registro
            const query = `
                SELECT
                    cht_id AS ID_CHAT
                FROM
                    tbl_chat
            WHERE
                cht_remitente = ?;
            `;
            const [rows] = await pool.query(query, [remitente]);
            return rows;
        }
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → cerrar ', error);
        return false;
    }
};

// * CERRAR CHAT AI
const cerrarChatAI = async (remitente, estadoChat, estadoGestion, arbol, controlApi, descripcion, estadoRegistro, responsable) => {
    try {
        // todo: Sentencia SQL
        const query = `
            UPDATE
                tbl_chat
            SET
                cht_estado = ?,
                cht_gestion = ?,
                cht_arbol = ?,
                cht_control_api = ?,
                cht_descripcion = ?,
                cht_registro = ?,
                cht_responsable = ?
            WHERE
                cht_remitente = ?;
        `;

        // todo: Ejecutar la sentencia y retornar respuesta
        const result = await pool.query(query, [estadoChat, estadoGestion, arbol, controlApi, descripcion, estadoRegistro, responsable, remitente]);
        // todo: Si se modifico el registro
        if (result[0].affectedRows > 0) {
            // todo: Retornar el id del registro
            const query = `
                SELECT
                    cht_id AS ID_CHAT
            WHERE
                cht_remitente = ?;
            `;
            const [rows] = await pool.query(query, [remitente]);
            return rows;
        }
    } catch (error) {
        // todo: Capturar el error
        console.log('❌ Error en v1/models/widget/chat.model.js → cerrarChatAI ', error);
        return false;
    }
};

// ! EXPORTACIONES
module.exports = {
    crear,
    verificarDuplicado,
    formularioInicial,
    filtrar,
    filtrarEnlaces,
    error,
    opcionesControlApi,
    monitor,
    listarArchivosAdjuntos,
    actualizar,
    cerrar,
    cerrarChatAI,
};