// ! ================================================================================================================================================
// !                                                             ENRUTADOR DE CHAT WEB
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/routes/widget/chatWeb.routes.js

// ! REQUIRES
const express = require('express');
const router = express.Router();
const validator = require('../../validators/widget/mensaje.validator.js');
const controller = require('../../controllers/widget/mensaje.controller.js');
const multer = require('multer');
const path = require('path');

// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ! RUTAS
// TODO: CREAR MENSAJE
router.post('/crear', validator.crear, controller.crear);

// TODO: CREAR MENSAJE DESDE SOUL CHAT
router.post('/crearSoulChat', validator.crearSoulChat, controller.crearSoulChat);

// TODO: LISTAR MENSAJE NO LEÍDOS
router.get('/listarNoLeido', validator.listarNoLeido, controller.listarNoLeido);

// TODO: LEER MENSAJE
router.post('/leer', validator.leer, controller.leer);

// TODO: ADJUNTAR ARCHIVOS
router.post('/adjuntarArchivos', upload.array('archivos', 5), validator.adjuntarArchivos, controller.adjuntarArchivos);

// TODO: LISTAR CONVERSACIÓN COMPLETA
router.get('/listarConversacion', validator.listarConversacion, controller.listarConversacion);

// TODO: VIGILAR INACTIVIDAD DEL CHAT
router.post('/vigilaInactividadChat', validator.vigilaInactividadChat, controller.vigilaInactividadChat);

// ! EXPORTACIONES
module.exports = router;