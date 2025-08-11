// ! ================================================================================================================================================
// !                                                      MODELOS PARA ARBOL CHAT BOT
// ! ================================================================================================================================================
// @autor Ramón Dario Rozo Torres (24 de Enero de 2025)
// @últimaModificación Ramón Dario Rozo Torres (24 de Enero de 2025)
// @versión 1.0.0
// v1/models/widget/arbolChatBot.model.js

// ! REQUIRES
const pool = require('../../config/database.js');
const path = require('path');
require('dotenv').config({ path: './../../.env' });
const modelChat = require('./chat.model.js');
const modelMensaje = require('./mensaje.model.js');
const dataEstatica = require('../../seeds/dataEstatica.js');
const serviceSoulChat = require('../../services/serviceSoulChat.service.js');

// ! VARIABLES GLOBALES
let chatData = {
    controlApi: '-',
    controlPeticiones: '-',
    resultadoApi: '-',
    nombres: '-',
    apellidos: '-',
    numeroCedula: '-',
    paisResidencia: '-',
    ciudadResidencia: '-',
    indicativoPais: '-',
    numeroCelular: '-',
    correoElectronico: '-',
    autorizacionDatosPersonales: '-',
    adjuntos: '-',
    rutaAdjuntos: '-',
    descripcion: '-',
    estadoRegistro: '-',
    responsable: '-',
};

// ! MODELOS
// * ARBOL CHAT BOT
const arbolChatBot = async (remitente, contenido) => {
    // Variables
    const defaultData = '-';
    const chat = await modelChat.filtrar(remitente);
    const idChat = chat[0].ID_CHAT;
    const arbolChat = chat[0].ARBOL;
    const estadoGestionChat = chat[0].GESTION;

    // Deserializar los datos después de recuperarlos
    chatData.controlApi = chat[0].CONTROL_API || defaultData;
    chatData.controlPeticiones = parseInt(chat[0].CONTROL_PETICIONES) || 0;
    try {
        chatData.resultadoApi = chat[0].RESULTADO_API && chat[0].RESULTADO_API !== defaultData ? 
            (chat[0].RESULTADO_API === 'Message recived!' ? chat[0].RESULTADO_API : JSON.parse(chat[0].RESULTADO_API)) 
            : defaultData;
    } catch (e) {
        chatData.resultadoApi = chat[0].RESULTADO_API || defaultData;
    }
    chatData.nombres = chat[0].NOMBRES || defaultData;
    chatData.apellidos = chat[0].APELLIDOS || defaultData;
    chatData.numeroCedula = chat[0].NUMERO_CEDULA || defaultData;
    chatData.paisResidencia = chat[0].PAIS_RESIDENCIA || defaultData;
    chatData.ciudadResidencia = chat[0].CIUDAD_RESIDENCIA || defaultData;
    chatData.indicativoPais = chat[0].INDICATIVO_PAIS || defaultData;
    chatData.numeroCelular = chat[0].NUMERO_CELULAR || defaultData;
    chatData.correoElectronico = chat[0].CORREO_ELECTRONICO || defaultData;
    chatData.autorizacionDatosPersonales = chat[0].AUTORIZACION_DATOS_PERSONALES || defaultData;
    chatData.adjuntos = chat[0].ADJUNTOS || defaultData;
    chatData.rutaAdjuntos = chat[0].RUTA_ADJUNTOS || defaultData;
    chatData.descripcion = chat[0].DESCRIPCION || defaultData;
    chatData.estadoRegistro = chat[0].REGISTRO || defaultData;
    chatData.responsable = chat[0].RESPONSABLE || defaultData;

    if (estadoGestionChat !== 'Cerrado') {
        try {
            // todo: Saludo Arbol
            if (arbolChat === 'Saludo' || arbolChat === 'Alerta No Entiendo - Saludo') {
                if (contenido === '1' || contenido === '2' || contenido === '3') {
                    // todo: Solicitar Autorizacion Datos Personales
                    return await solicitarAutorizacionDatosPersonales(idChat, remitente);
                } else {
                    const pasoArbol = 'Alerta No Entiendo - Saludo';                    
                    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
                    ⚠️ <i>Por favor, seleccione una opción del 1 al 3.</i></p>`;

                    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
                    // todo: Volver a Solicitar Opciones Servicios
                    return await solicitarOpcionesServicios(idChat, remitente);
                }
            }

            // todo: Inicio Arbol
            // if (arbolChat === 'Inicio' || arbolChat === 'inicio' || contenido.toUpperCase() === 'INICIO') {
            //     const pasoArbol = dataEstatica.arbol[0];
            //     chatData.descripcion = 'Se empieza de nuevo el flujo del chat.';
            //     // Actualizar el chat
            //     await modelChat.actualizar(idChat, pasoArbol, chatData);
            //     return await modelMensaje.crear(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.saludo, '-', dataEstatica.lecturaMensaje[0], 'Se crea el mensaje de bienvenida.', dataEstatica.estadoRegistro[0], dataEstatica.responsable);
            // }

            // todo: Autorizacion Datos Personales Arbol
            if (arbolChat === 'Autorizacion Datos Personales' || arbolChat === 'Alerta No Entiendo - Autorizacion Datos Personales') {
                // ! Se refiere a consumir el endpoint de interaccion AI Soul
                return await procesarAutorizacionDatosPersonales(idChat, remitente, contenido);
            }

            // todo: Rol Usuario Arbol
            if (arbolChat === 'Rol Usuario' || arbolChat === 'Alerta No Entiendo - Rol Usuario') {
                return await procesarRolUsuario(idChat, remitente, contenido);
            }

            return true;
        } catch (error) {
            // todo: Enviar mensaje de error por API
            const api = 'Widget Chat Web MinTic ';
            const procesoApi = 'Arbol Chat Bot';
            console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → arbolChatBot: ', error);
            return await errorAPI(api, procesoApi, error, idChat, remitente);
        }
    } else {
        return await chatCerrado(idChat, remitente);
    }
};

// ! FUNCIONES AUXILIARES
// todo: Cliente Desiste Arbol
const clienteDesiste = async (idChat, remitente) => {
    try {
        const pasoArbol = dataEstatica.arbol[9];
        chatData.descripcion = 'Cliente desiste de continuar con la atención en el sistema.';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.clienteDesiste, chatData.descripcion);

        await modelChat.cerrar(remitente, dataEstatica.estadoChat[0], dataEstatica.estadoGestion[1], dataEstatica.arbol[1], dataEstatica.controlApi[0], chatData.descripcion, dataEstatica.estadoRegistro[0], dataEstatica.responsable);

        chatData.descripcion = 'Se envía mensaje de despedida.';
        return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[4], dataEstatica.despedida, chatData.descripcion);
    } catch (error) {
        // todo: Enviar mensaje de error por API
        const api = 'Widget Chat Web MinTic ';
        const procesoApi = 'Cliente Desiste';
        console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → clienteDesiste', error);
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// todo: Solicitar Opciones Servicios Arbol
const solicitarOpcionesServicios = async (idChat, remitente) => {
    const solicitarOpcionesServiciosArbol = dataEstatica.arbol[0];
    chatData.descripcion = 'Se solicita nuevamentelas opciones de servicios.';
    await modelChat.actualizar(idChat, solicitarOpcionesServiciosArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.opcionesServicios, chatData.descripcion);
};

// todo: Solicitar Autorizacion Datos Personales Arbol
const solicitarAutorizacionDatosPersonales = async (idChat, remitente) => {
    const solicitarAutorizacionDatosPersonalesArbol = dataEstatica.arbol[4];
    chatData.descripcion = 'Se solicita la autorización de datos personales.';
    await modelChat.actualizar(idChat, solicitarAutorizacionDatosPersonalesArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.solicitarAutorizacionDatosPersonales, chatData.descripcion);
};

// todo: Procesar Autorizacion Datos Personales Arbol
const procesarAutorizacionDatosPersonales = async (idChat, remitente, contenido) => {
    // Convertir la primera letra a mayúscula y el resto a minúscula
    contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
    console.log('contenido: ', contenido);
    if (contenido === 'Si') {
        // Solicitar rol usuario
        return await solicitarRolUsuario(idChat, remitente);
    } else if (contenido === 'No') {
        return await clienteDesiste(idChat, remitente);
    } else {
        const pasoArbol = 'Alerta No Entiendo - Autorizacion Datos Personales';
        const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
        ⚠️ <i>Por favor, responda Si o No.</i></p>`;

        await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
        // todo: Volver a Solicitar Autorizacion Datos Personales
        return await solicitarAutorizacionDatosPersonales(idChat, remitente);
    }
};

// todo: Solicitar Rol Usuario Arbol
const solicitarRolUsuario = async (idChat, remitente) => {
    const solicitarRolUsuarioArbol = dataEstatica.arbol[5];
    chatData.descripcion = 'Se solicita el rol del usuario.';
    await modelChat.actualizar(idChat, solicitarRolUsuarioArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.solicitarRolUsuario, chatData.descripcion);
};

// todo: Procesar Rol Usuario Arbol
const procesarRolUsuario = async (idChat, remitente, contenido) => {
    // Convertir la primera letra a mayúscula y el resto a minúscula
    contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
    console.log('contenido: ', contenido);
    if (contenido === '1' || contenido === '2') {
        return await clienteDesiste(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Rol Usuario';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, responda 1 o 2.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    // todo: Volver a Solicitar Rol Usuario
    return await solicitarRolUsuario(idChat, remitente);
};

// // todo: Solicitar Condicion Adjuntos Arbol
// const solicitarCondicionAdjuntos = async (idChat, remitente, contenido) => {
//     const solicitarCondicionAdjuntosArbol = dataEstatica.arbol[17];
//     const descripcion = 'Se solicita adjuntar documentos.';
//     await actualizarChat(idChat, solicitarCondicionAdjuntosArbol, descripcion, chatData);
//     return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], dataEstatica.condicionAdjuntos, descripcion);
// };

// // todo: Procesar Condicion Adjuntos Arbol
// const procesarCondicionAdjuntos = async (idChat, remitente, contenido) => {
//     if (contenido === '1') {
//         chatData.adjuntos = 'Si';
//         return await solicitarConfirmarAdjuntos(idChat, remitente, contenido);
//     } else if (contenido === '2') {
//         chatData.adjuntos = 'No';
//         chatData.rutaAdjuntos = '-';
//         return await solicitarConfirmarEspacioAgendamiento(idChat, remitente);
//     } else {
//         return await manejarNoEntiendoYReintentar(idChat, remitente, 'Condicion Adjuntos');
//     }
// };

// // todo: Solicitar Confirmar Adjuntos Arbol
// const solicitarConfirmarAdjuntos = async (idChat, remitente, contenido) => {
//     const solicitarConfirmarAdjuntosArbol = dataEstatica.arbol[18];
//     const descripcion = 'Se solicita adjuntar documentos.';
//     await actualizarChat(idChat, solicitarConfirmarAdjuntosArbol, descripcion, chatData);
//     return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[1], dataEstatica.confirmarAdjuntos, descripcion);
// };

// // todo: Enviar los archivos adjuntos
// const procesarArchivosAdjuntos = async (idChat, remitente, contenido) => {
//     const enlacesChat = await modelChat.filtrarEnlaces(idChat);
//     const rutaAdjuntos = enlacesChat.RUTA_ADJUNTOS;
//     const APP_URL = decrypt(process.env.APP_URL);
//     const enlaces = rutaAdjuntos.split('|');
//     // Pasar el valor a la variable global
//     chatData.rutaAdjuntos = rutaAdjuntos;

//     let mensajeEnlaces = '<p id="archivosAdjuntosClienteArbol">✅ <b>Hemos recibido los siguientes archivos adjuntos:</b><br/><br/>';

//     enlaces.forEach(enlace => {
//         const nombreArchivo = enlace.split('/').pop();
//         mensajeEnlaces += `📄 <a href="${APP_URL}${enlace}" target="_blank">${nombreArchivo}</a><br/><br/>`;
//     });

//     mensajeEnlaces += '</p>';

//     const descripcion = 'Enlaces de archivos adjuntos enviados.';
//     await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[2], mensajeEnlaces, descripcion);

//     // Continuar con el siguiente paso en el árbol
//     return await solicitarConfirmarEspacioAgendamiento(idChat, remitente, contenido);
// };

// // todo: Actualizar ruta de adjuntos en chat
// const actualizarRutaAdjuntos = async (idChat, enlaces) => {
//     const query = `
//         UPDATE tbl_chat
//         SET cht_ruta_adjuntos = ?
//         WHERE cht_id = ?;
//     `;
//     return await pool.query(query, [enlaces, idChat]);
// };

// todo: Manejar no entender
const manejarNoEntiendo = async (idChat, remitente, pasoArbol, alertaNoEntiendo) => {
    try {
        chatData.descripcion = 'Se notifica que no se entiende el mensaje.';
        await modelChat.actualizar(idChat, pasoArbol, chatData);
        const mensaje = await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[0], alertaNoEntiendo, chatData.descripcion);
        console.log('mensaje: ', mensaje);
        return true;
    } catch (error) {
        // todo: Enviar mensaje de error por API
        const api = 'Widget Chat Web MinTic ';
        const procesoApi = 'Funcion manejarNoEntiendo';
        console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → manejarNoEntiendo: ', error);
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};


// todo: Crear mensaje
const crearMensaje = async (idChat, remitente, estadoMensaje, tipoMensaje, contenido, descripcion) => {
    const enlaces = '-';
    const lectura = dataEstatica.lecturaMensaje[0];
    const estadoRegistro = dataEstatica.estadoRegistro[0];
    const responsable = dataEstatica.responsable;
    return await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
};

// todo: Función para manejar errores de API
const errorAPI = async (api, procesoApi, error, idChat, remitente) => {
    // Variables
    let estadoMensaje = dataEstatica.estadoMensaje[1];
    let tipoMensaje = dataEstatica.tipoMensaje[5];
    let contenidoAlertaErrorAPI = dataEstatica.alertaErrorAPI;
    let descripcion = '';
    let resultadoApi = {};

    // Formatear el error dependiendo de la respuesta
    if (error.response && error.response.data) {
        descripcion = `API ${api} → ${error.response.data.title || procesoApi} - ${error.response.data.message || 'Error desconocido'} - Presenta novedad.`;
        resultadoApi = JSON.stringify({
            status: error.response.status,
            message: error.response.data.message,
            error: error.response.data.error,
            api: error.response.data.api
        });
    } else {
        descripcion = `API ${api} → ${procesoApi} - Presenta novedad.`;
        resultadoApi = JSON.stringify({
            status: error.status || 500,
            message: error.message || error.data || 'Error desconocido',
            error: error.toString()
        });
    }

    // todo: Actualizar chat
    const controlApi = dataEstatica.controlApi[1];
    try {
        const query = `
            UPDATE tbl_chat
            SET 
                cht_descripcion = ?, 
                cht_control_api = ?,
                cht_resultado_api = ?
            WHERE cht_id = ?;
        `;
        await pool.query(query, [descripcion, controlApi, resultadoApi, idChat]);

        await crearMensaje(idChat, remitente, estadoMensaje, tipoMensaje, contenidoAlertaErrorAPI, descripcion);
    } catch (error) {
        console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → errorAPI ', error);
    }
    return false;
};

// todo: Crear alerta de inactividad
const crearAlertaInactividad = async (idChatWeb, descripcion, nombreCliente = null) => {
    const chat = await modelChat.filtrar(idChatWeb);
    if (chat.length > 0) {
        const idChat = chat[0].ID_CHAT;
        const remitente = idChatWeb;
        const estadoMensaje = dataEstatica.estadoMensaje[1];
        const tipoMensaje = dataEstatica.tipoMensaje[3];

        // Validar si el nombre del cliente es válido
        const esNombreValido = nombreCliente && nombreCliente.trim() && nombreCliente !== '-';

        // Construir el contenido del mensaje según el tiempo de inactividad
        let contenido;
        if (descripcion.includes('2 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 2 minutos.</b><br/><br/>
                    ⏳ Apreciado(a) ${nombreCliente}, hemos notado que lleva 2 minutos de inactividad.<br/><br/>
                    🤔 ¿Necesita ayuda? <br/><br/>
                    💬 Estamos aquí para asistirle. <br/><br/> 
                    👉 Por favor, responda a su última interacción para continuar. 😊</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 2 minutos.</b><br/><br/>
                    ⏳ Apreciado Ciudadano, hemos notado que lleva 2 minutos de inactividad.<br/><br/>
                    🤔 ¿Necesita ayuda? <br/><br/> 
                    💬 Estamos aquí para asistirle. <br/><br/> 
                    👉 Por favor, responda a su última interacción para continuar. 😊</p>`;
        } else if (descripcion.includes('3 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 3 minutos.</b><br/><br/>
                    ⏳ Apreciado(a) ${nombreCliente}, lleva 3 minutos de inactividad.<br/><br/>
                    ⚠️ Recuerde que si no responde, la sesión se cerrará automáticamente.<br/><br/>
                    💬 Responda por favor para mantener la conversación activa.</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 3 minutos.</b><br/><br/>
                    ⏳ Apreciado Ciudadano, lleva 3 minutos de inactividad.<br/><br/>
                    ⚠️ Recuerde que si no responde, la sesión se cerrará automáticamente.<br/><br/>
                    💬 Responda por favor para mantener la conversación activa.</p>`;
        } else if (descripcion.includes('4 minutos')) {
            contenido = esNombreValido
                ? `<p class=\"alertaInactividadArbol\"><b>Inactividad de 4 minutos.</b><br/><br/>
                    ⚠️ Apreciado(a) ${nombreCliente}, su sesión se cerrará en 1 minuto por inactividad.<br/><br/>
                    🚨 ¡Última advertencia! <br/><br/>
                    💬 Responda por favor ahora para mantener la conversación activa. <br/><br/>
                    👉 Si no responde, el chat se cerrará automáticamente. 😔</p>`
                : `<p class=\"alertaInactividadArbol\"><b>Inactividad de 4 minutos.</b><br/><br/>
                    ⚠️ Apreciado Ciudadano, su sesión se cerrará en 1 minuto por inactividad.<br/><br/>
                    🚨 ¡Última advertencia! <br/><br/>
                    💬 Responda por favor ahora para mantener la conversación activa. <br/><br/>
                    👉 Si no responde, el chat se cerrará automáticamente. 😔</p>`;
        }

        const enlaces = '-';
        const lectura = dataEstatica.lecturaMensaje[0];
        const estadoRegistro = dataEstatica.estadoRegistro[0];
        const responsable = dataEstatica.responsable;

        await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
    }
};

// todo: Crear mensaje de cierre por inactividad
const crearMensajeCierreInactividad = async (idChatWeb) => {
    const chat = await modelChat.filtrar(idChatWeb);
    if (chat.length > 0) {
        const idChat = chat[0].ID_CHAT;
        const remitente = idChatWeb;
        const estadoMensaje = dataEstatica.estadoMensaje[1];
        const tipoMensaje = dataEstatica.tipoMensaje[4];
        const contenido = `<p class=\"mensajeCierreInactividadArbol\"><b>Chat cerrado por inactividad</b><br/><br/>
        🚫 Su sesión ha finalizado debido a un periodo prolongado de inactividad (5 minutos). <br/><br/>
        💬 ¡Estamos aquí para ayudarle! 😊<br/><br/>
        👉 <b>Por favor, cierre esta ventana y vuelva a abrir el chat para iniciar una nueva conversación.</b></p>`;
        const enlaces = '-';
        const lectura = dataEstatica.lecturaMensaje[0];
        const estadoRegistro = dataEstatica.estadoRegistro[0];
        const responsable = dataEstatica.responsable;
        const descripcion = 'Chat cerrado por inactividad.';

        await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
    }
};

// todo: Chat cerrado
const chatCerrado = async (idChat, remitente) => {
    const enlaces = '-';
    const lectura = dataEstatica.lecturaMensaje[0];
    const estadoRegistro = dataEstatica.estadoRegistro[0];
    const responsable = dataEstatica.responsable;
    const descripcion = 'Este chat está actualmente cerrado.'
    return await crearMensaje(idChat, remitente, dataEstatica.estadoMensaje[1], dataEstatica.tipoMensaje[4], dataEstatica.chatDiferenteAbierto, descripcion, enlaces, lectura, estadoRegistro, responsable);
};

// ! EXPORTACIONES
module.exports = {
    arbolChatBot,
    // actualizarRutaAdjuntos,
    // procesarArchivosAdjuntos,
    crearAlertaInactividad,
    crearMensajeCierreInactividad,
};