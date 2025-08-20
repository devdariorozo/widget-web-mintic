// ! ================================================================================================================================================
// !                                                             VALIDADOR DE MENSAJE
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/validators/widget/mensaje.validator.js

// ! REQUIRES
const { body } = require('express-validator');
const { query } = require('express-validator');

// ! VALIDADORES
// * CREAR
const crear = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
        
    // todo: Validar campo 'mensaje'
    body('mensaje')
        .trim()
        .notEmpty().withMessage('El campo "mensaje" no puede estar vacío...'),
];

// * CREAR MENSJAJE DESDE SOUL CHAT
const crearSoulChat = [
    // todo: Vallidar campo 'idChat'
    body('idChat')
        .trim()
        .notEmpty().withMessage('El campo "idChat" no puede estar vacío...')
        .isInt().withMessage('El campo "idChat" debe ser un número entero...'),

    // todo: Validar campo 'remitente'
    body('remitente')
        .trim()
        .notEmpty().withMessage('El campo "remitente" no puede estar vacío...'),

    // todo: Validar campo 'estado'
    body('estado')
        .trim()
        .notEmpty().withMessage('El campo "estado" no puede estar vacío...')
        .isIn(['Enviado']).withMessage('El campo "estado" debe ser "Enviado"'),

    // todo: Validar campo 'tipo'
    body('tipo')
        .trim()
        .notEmpty().withMessage('El campo "tipo" no puede estar vacío...'),

    // todo: Validar campo 'contenido'
    body('contenido')
        .trim()
        .notEmpty().withMessage('El campo "contenido" no puede estar vacío...'),

    // todo: Validar campo 'enlaces'
    body('enlaces')
        .trim()
        .custom(value => {
            if (value === '-') {
                return true;
            }
            return value.length > 0;
        }).withMessage('El campo "enlaces" debe ser un guión (-) o contener un valor válido...'),

    // todo: Validar campo 'lectura'
    body('lectura')
        .trim()
        .notEmpty().withMessage('El campo "lectura" no puede estar vacío...')
        .isIn(['No leido']).withMessage('El campo "lectura" debe ser "No leido"'),

    // todo: Validar campo 'descripcion'
    body('descripcion')
        .trim()
        .notEmpty().withMessage('El campo "descripcion" no puede estar vacío...'),

    // todo: Validar campo 'registro'
    body('registro')
        .trim()
        .notEmpty().withMessage('El campo "registro" no puede estar vacío...')
        .isIn(['Activo']).withMessage('El campo "registro" debe ser "Activo"'),

    // todo: Validar campo 'responsable'
    body('responsable')
        .trim()
        .notEmpty().withMessage('El campo "responsable" no puede estar vacío...')
        .isIn(['Chat Web MinTic']).withMessage('El campo "responsable" debe ser "Chat Web MinTic"'),
    
];

// * LISTAR NO LEÍDOS
const listarNoLeido = [
    // todo: Validar campo 'idChatWeb'
    query('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// * LEER
const leer = [
    // todo: Validar campo 'idMensaje'
    body('idMensaje')
        .trim()
        .notEmpty().withMessage('El campo "idMensaje" no puede estar vacío...'),
];

// * ADJUNTAR ARCHIVOS
const adjuntarArchivos = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),

    // todo: Validar campo 'mensaje'
    body('mensaje')
        .trim()
        .notEmpty().withMessage('El campo "mensaje" no puede estar vacío...'),
];

// * LISTAR CONVERSACIÓN COMPLETA
const listarConversacion = [
    // todo: Validar campo 'idChatWeb'
    query('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// * VIGILAR INACTIVIDAD DEL CHAT
const vigilaInactividadChat = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
    
    // todo: Validar campo 'tiempoInactividad'
    body('tiempoInactividad')
        .isInt({ min: 0 })
        .withMessage('El campo "tiempoInactividad" debe ser un número entero positivo...'),
    
    // todo: Validar campo 'resetearInactividad'
    body('resetearInactividad')
        .optional()
        .isBoolean()
        .withMessage('El campo "resetearInactividad" debe ser un valor booleano...'),
];

// * LIMPIAR MENSAJES DE INACTIVIDAD
const limpiarMensajesInactividad = [
    // todo: Validar campo 'idChatWeb'
    body('idChatWeb')
        .trim()
        .notEmpty().withMessage('El campo "idChatWeb" no puede estar vacío...'),
];

// ! EXPORTACIONES
module.exports = { 
    crear,
    crearSoulChat,
    listarNoLeido,
    leer,
    adjuntarArchivos,
    listarConversacion,
    vigilaInactividadChat,
    limpiarMensajesInactividad,
};