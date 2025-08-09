// ! ================================================================================================================================================
// !                                                             ENRUTADOR DE CHAT WEB
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/routes.routes.js

// ! REQUIRES
const express = require('express');
const router = express.Router();
const validator = require('../../validators/widget/chat.validator.js');
const controller = require('../../controllers/widget/chat.controller.js');

// ! RUTAS
// * CHAT WEB
// TODO: RENDERIZAR VISTA
router.get('/web', (req, res) => {
    res.render('widget/chat.hbs');
});

// * CREAR
// TODO: CREAR
router.post('/crear', validator.crear, controller.crear);

// * FORMULARIO INICIAL
// TODO: ACTUALIZAR - RECIBE DATOS DE FORMULARIO INICIAL
router.post('/formularioInicial', validator.formularioInicial, controller.formularioInicial);

// * OPCIONES
// TODO: OPCIONES CONTROL API
router.get('/opcionesControlApi', controller.opcionesControlApi);

// * MONITOR
// TODO: RENDERIZAR VISTA
router.get('/monitor', (req, res) => {
    res.render('widget/monitor.hbs');
});
// TODO: MONITOR
router.post('/monitor', validator.monitor, controller.monitor);

// * LISTAR ARCHIVOS ADJUNTOS
// TODO: LISTAR ARCHIVOS ADJUNTOS
router.get('/listarArchivosAdjuntos', validator.listarArchivosAdjuntos, controller.listarArchivosAdjuntos);

// * FILTRAR
router.get('/filtrar', validator.filtrar, controller.filtrar);

// * CERRAR - ACTUALIZAR
// TODO: CERRAR
router.post('/cerrar', validator.cerrar, controller.cerrar);

// * CERRAR CHAT AI
// TODO: CERRAR CHAT AI
router.post('/cerrarChatAI', validator.cerrarChatAI, controller.cerrarChatAI);

// ! EXPORTACIONES
module.exports = router;
