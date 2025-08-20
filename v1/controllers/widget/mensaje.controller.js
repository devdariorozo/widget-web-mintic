// ! ================================================================================================================================================
// !                                                      CONTROLADORES PARA MENSAJE
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/controllers/widget/mensaje.controller.js

// ! REQUIRES
const moment = require('moment');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, './../../.env') });
const model = require('../../models/widget/mensaje.model.js');
const dataEstatica = require('../../seeds/dataEstatica.js');
const modelChat = require('../../models/widget/chat.model.js');
const modelArbolChatBot = require('../../models/widget/arbolChatBot.model.js');

// ! CONTROLADORES
// * CREAR
const crear = async (req, res) => {
    try {
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChatWeb,
            mensaje
        } = req.body;

        // todo: Validar si el chat existe
        const verificarChat = await modelChat.filtrar(idChatWeb);
        if (verificarChat.length > 0) {
            // todo: Preparamos los datos por defecto
            let idChat = verificarChat[0].ID_CHAT;
            let remitente = idChatWeb;
            let estadoMensaje = dataEstatica.configuracion.estadoMensaje.recibido;
            let tipoMensaje = dataEstatica.configuracion.tipoMensaje.texto;
            let contenido = mensaje;
            let enlaces = '-';
            let lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
            let descripcion = 'Se crea el mensaje con éxito.';
            let estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
            let responsable = dataEstatica.configuracion.responsable;

            // todo: Crear el registro
            const result = await model.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);

            // todo: Enviar respuesta
            if (result) {

                // todo: Navegar arbol chat bot
                const resultArbol = await modelArbolChatBot.arbolChatBot(remitente, contenido);
                if (resultArbol) {
                    // todo: Enviar respuesta
                    return res.json({
                        status: 200,
                        type: 'success',
                        title: 'Chat Web MinTic',
                        message: 'El mensaje se ha creado correctamente en el sistema.',
                    });
                } else {
                    // todo: Enviar respuesta
                    return res.json({
                        status: 409,
                        type: 'warning',
                        title: 'Chat Web MinTic',
                        message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
                    });
                }
            }
        } else {
            // todo: Enviar respuesta
            res.json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: 'El chat no existe en el sistema.'
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → crear ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * CREAR MENSAJE DESDE SOUL CHAT
const crearSoulChat = async (req, res) => {
    try {
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChat,
            remitente,
            estado,
            tipo,
            contenido,
            enlaces,
            lectura,
            descripcion,
            registro,
            responsable
        } = req.body;

        // todo: Crear el registro
        const result = await model.crear(idChat, remitente, estado, tipo, contenido, enlaces, lectura, descripcion, registro, responsable);

        // todo: Enviar respuesta
        if (result) {
            // todo: Enviar respuesta
            return res.json({
                status: 200,
                type: 'success',
                title: 'Chat Web MinTic',
                message: 'El mensaje se ha creado correctamente en el sistema.',
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → crearSoulChat ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo crear el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LISTAR NO LEÍDOS
const listarNoLeido = async (req, res) => {
    try {
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idChatWeb
        } = req.query;

        // todo: Valores por defecto
        let lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;

        // todo: Listar los mensajes
        const result = await model.listarNoLeido(idChatWeb, lectura);

        if (result) {
            // todo: Enviar respuesta
            res.json({
                status: 200,
                type: 'success',
                title: 'Chat Web MinTic',
                message: 'Los mensajes se han listado correctamente en el sistema.',
                data: result
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → listarNoLeido ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo listar los mensajes, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LEER
const leer = async (req, res) => {
    try {
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const {
            idMensaje
        } = req.body;

        // todo: Valores por defecto
        let lectura = dataEstatica.configuracion.lecturaMensaje.leido;

        // todo: Leer el mensaje
        const result = await model.leer(idMensaje, lectura);

        if (result) {
        // todo: Enviar respuesta
        res.json({
            status: 200,
                type: 'success',
                title: 'Chat Web MinTic',
                message: 'El mensaje se ha leído correctamente en el sistema.',
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → leer ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo leer el mensaje, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * ADJUNTAR ARCHIVOS
const adjuntarArchivos = async (req, res) => {
    try {
        // Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // Obtener los datos de la petición
        const { idChatWeb, mensaje } = req.body;
        const archivos = req.files;

        if (!archivos || archivos.length === 0) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: 'No se han recibido archivos.'
            });
        }

        // Validar extensiones de archivos
        const allowedExtensions = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'doc', 'docx'];
        const invalidFiles = archivos.filter(file => {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            return !allowedExtensions.includes(fileExtension);
        });

        if (invalidFiles.length > 0) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: 'Algunos archivos tienen extensiones no permitidas.'
            });
        }

        // Validar si el chat existe
        const verificarChat = await modelChat.filtrar(idChatWeb);
        if (verificarChat.length > 0) {
            const idChat = verificarChat[0].ID_CHAT;
            const remitente = idChatWeb;
            const estadoMensaje = dataEstatica.configuracion.estadoMensaje.recibido; // No leído
            const tipoMensaje = dataEstatica.configuracion.tipoMensaje.adjuntos; // Adjuntos

            // Crear carpeta para el chat si no existe
            const chatDir = path.join(__dirname, '../../uploads', idChatWeb);
            if (!fs.existsSync(chatDir)) {
                fs.mkdirSync(chatDir, { recursive: true });
            }

            // Mover archivos a la carpeta del chat
            const nuevosEnlaces = archivos.map(file => {
                const filePath = path.join(chatDir, file.originalname);
                fs.renameSync(file.path, filePath);
                return `/${idChatWeb}/${file.originalname}`;
            }).join('|');

            // Obtener enlaces existentes
            const chatData = await modelChat.filtrarEnlaces(idChat);
            const enlacesExistentes = chatData.RUTA_ADJUNTOS && chatData.RUTA_ADJUNTOS !== '-' ? chatData.RUTA_ADJUNTOS : '';

            // Concatenar enlaces
            const enlaces = enlacesExistentes ? `${enlacesExistentes}|${nuevosEnlaces}` : nuevosEnlaces;

            const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
            const descripcion = 'Archivos adjuntos subidos con éxito.';
            const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
            const responsable = dataEstatica.configuracion.responsable;

            // Crear el registro en tbl_mensaje
            const result = await model.crear(idChat, remitente, estadoMensaje, tipoMensaje, mensaje, enlaces, lectura, descripcion, estadoRegistro, responsable);

            // Actualizar el campo cht_ruta_adjuntos en tbl_chat
            await modelArbolChatBot.actualizarRutaAdjuntos(idChat, enlaces);

            // Enviar los archivos adjuntos en un mensaje
            await modelArbolChatBot.procesarArchivosAdjuntos(idChat, remitente, mensaje);

            // Enviar respuesta
            if (result) {
                return res.json({
                    status: 200,
                    type: 'success',
                    title: 'Chat Web MinTic',
                    message: 'Archivos y mensaje subidos exitosamente.',
                });
            }
        } else {
            res.json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: 'El chat no existe en el sistema.'
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → adjuntarArchivos ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo adjuntar los archivos, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * LISTAR CONVERSACIÓN COMPLETA
const listarConversacion = async (req, res) => {
    try {
        // todo: Validar los datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        // todo: Obtener los datos de la petición
        const { idChatWeb } = req.query;

        // todo: Listar todos los mensajes de la conversación
        const result = await model.listarConversacion(idChatWeb);

        if (result) {
            // todo: Enviar respuesta
            res.json({
                status: 200,
                type: 'success',
                title: 'Chat Web MinTic',
                message: 'La conversación se ha listado correctamente en el sistema.',
                data: result
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → listarConversacion ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'No se pudo listar la conversación, por favor intenta de nuevo o comunícate con nosotros.',
            error: error.message
        });
    }
};

// * VIGILAR INACTIVIDAD DEL CHAT
const vigilaInactividadChat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                type: 'warning',
                title: 'Chat Web MinTic',
                message: errors.array()[0].msg
            });
        }

        const { idChatWeb, tiempoInactividad} = req.body;
        
        const ultimoMensaje = await model.filtrarUltimoMensaje(idChatWeb);

        if (ultimoMensaje && ultimoMensaje.ESTADO === 'Enviado') {
            const chat = await modelChat.filtrar(idChatWeb);

            if (chat.length > 0 && chat[0].GESTION === 'Abierto') {
                const nombreCliente = chat[0].NOMBRE_COMPLETO || null;

                // Primer aviso a los 2 minutos
                if (tiempoInactividad >= 2 && tiempoInactividad < 3) {
                    const descripcion = `Inactividad de 2 minutos.`;
                    if (ultimoMensaje.DESCRIPCION !== descripcion) {
                        await modelArbolChatBot.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
                    }
                }
                // Segundo aviso a los 3 minutos
                else if (tiempoInactividad >= 3 && tiempoInactividad < 4) {
                    const descripcion = `Inactividad de 3 minutos.`;
                    if (ultimoMensaje.DESCRIPCION !== descripcion) {
                        await modelArbolChatBot.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
                    }
                }
                // Tercer aviso a los 4 minutos
                else if (tiempoInactividad >= 4 && tiempoInactividad < 5) {
                    const descripcion = `Inactividad de 4 minutos.`;
                    if (ultimoMensaje.DESCRIPCION !== descripcion) {
                        await modelArbolChatBot.crearAlertaInactividad(idChatWeb, descripcion, nombreCliente);
                    }
                }
                // Cierre del chat a los 5 minutos
                else if (tiempoInactividad >= 5) {
                    await modelArbolChatBot.crearMensajeCierreInactividad(idChatWeb);
                    await modelChat.cerrar(
                        idChatWeb,
                        dataEstatica.configuracion.estadoChat.recibido,
                        dataEstatica.configuracion.estadoGestion.cerrado,
                        dataEstatica.arbol.cerradoPorInactividad,
                        dataEstatica.configuracion.controlApi.success,
                        'Chat cerrado por inactividad.',
                        dataEstatica.configuracion.estadoRegistro.activo,
                        dataEstatica.configuracion.responsable
                    );
                }
            }
        }

        const mensajesNoLeidos = await model.listarNoLeido(idChatWeb, dataEstatica.configuracion.lecturaMensaje.noLeido);

        res.json({
            status: 200,
            type: 'success',
            title: 'Chat Web MinTic',
            message: 'Proceso de vigilancia de inactividad completado.',
            data: mensajesNoLeidos
        });
    } catch (error) {
        console.log('❌ Error en v1/controllers/widget/mensaje.controller.js → vigilaInactividadChat ', error);
        res.status(500).json({
            status: 500,
            type: 'error',
            title: 'Chat Web MinTic',
            message: 'Error al vigilar la inactividad del chat.',
            error: error.message
        });
    }
};

// ! EXPORTACIONES
module.exports = {
    crear,
    crearSoulChat,
    listarNoLeido,
    leer,
    adjuntarArchivos,
    listarConversacion,
    vigilaInactividadChat,
};