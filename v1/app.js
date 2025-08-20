// ! ================================================================================================================================================
// !                                                          LEVANTAR SERVIDOR EXPRESS
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/app.js

// ! REQUIRES
const express = require('express');
const app = express();
const os = require('os');
const morgan = require('morgan');
const moment = require('moment');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pkg = require('./package.json');
app.set('pkg', pkg);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const Handlebars = require('./helpers/handlebars.js');
const cors = require('cors');

// ! CONFIGURACIONES
// * CONFIGURACIÓN DE HORA LOCAL
morgan.token('localdate', function () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
});
// * CONFIGURACIÓN DEL CORS
app.use(cors());
// * CONFIGURACIÓN DEL PUERTO
const PORT = parseInt(process.env.APP_PORT) || 4000;
// * CONFIGURACIÓN DEL FORMATO JSON
app.set('json spaces', 2);

// * CONFIGURACION MOTOR DE PLANTILLAS HANDLEBARS
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: Handlebars,
}));
app.set('view engine', '.hbs');

// * CONFIGURACIÓN DE LAS RUTAS ESTÁTICAS
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'widget')));
app.use(express.static(path.join(__dirname, 'uploads')));

// ! MIDDLEWARES
// * MIDDLEWARE MORGAN PARA REGISTRAR SOLICITUDES HTTP
app.use(morgan('■ MinTic :localdate → :method → :status • :url → :response-time ms'));
// * MIDDLEWARE PARA ACEPTAR DATOS EN FORMATO JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ! RUTAS
// * MODULO DE WIDGET
// TODO: CHAT WEB
app.use('/widget/chat', require('./routes/widget/chat.routes.js'));
// TODO: MENSAJE
app.use('/widget/mensaje', require('./routes/widget/mensaje.routes.js'));

// * RUTA INICIAL
app.get('/', (req, res) => {
    res.send({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    });
});

// ! MANEJO DE RUTAS NO ENCONTRADAS
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        type: 'error',
        title: 'Error de Ruta',
        message: 'No se encontró la ruta solicitada...',
        error: `Ruta '${req.url}' no encontrada...`
    });
});

// ! MANEJO DE ERRORES
app.use((err, req, res, next) => {
    res.status(500).json({
        status: 500,
        type: 'error',
        title: 'Error Interno',
        message: 'Error interno del servidor...',
        error: err.message
    });
});

// ! FUNCIÓN PARA OBTENER LA IP DEL SERVIDOR
function getServerIP() {
    // todo: Obtiene las interfaces de red del servidor
    const networkInterfaces = os.networkInterfaces();
    let serverIP = 'IP no disponible';

    // todo: Lista de interfaces posibles
    const possibleInterfaces = ['Ethernet', 'eno1', 'eth0', 'Wi-Fi'];
    for (const iface of possibleInterfaces) {
        if (networkInterfaces[iface]) {
            const address = networkInterfaces[iface].find(ifaceInfo => ifaceInfo.address && !ifaceInfo.internal);
            if (address) {
                serverIP = address.address;
                break;
            }
        }
    }

    return serverIP;
}

// ! INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log('========================================================================================');
    console.log('                           ♦♦♦ INICIALIZANDO SISTEMA ♦♦♦');
    console.log('========================================================================================');

    // todo: Imprime la IP del servidor
    console.log('• IP:', getServerIP());
    // todo: Imprime el nombre del servidor
    console.log('• SERVIDOR:', os.hostname());
    // todo: Imprime el sistema operativo y arquitectura
    console.log('• SISTEMA:', os.type(), os.arch());
    // todo: Imprime el cliente
    console.log(`• CLIENTE: ${process.env.PROJECT_CLIENT}`);
    // todo: Imprime el tipo de aplicación
    console.log(`• TIPO: ${process.env.PROJECT_TIPO}`);
    // todo: Imprime el nombre del proyecto
    console.log(`• PROYECTO: ${process.env.PROJECT_NAME}`);
    // todo: Imprime la versión del proyecto
    console.log(`• VERSION: ${process.env.PROJECT_VERSION}`);
    // todo: Imprime el ambiente del proyecto
    console.log(`• AMBIENTE: ${process.env.PROJECT_ENV}`);
    // todo: Imprime el puerto de la aplicación
    console.log(`• PUERTO: ${process.env.APP_PORT}`);
    // todo: Imprime la url de la aplicación
    console.log(`• URL: ${process.env.APP_URL}`);
    // todo: Imprime nombre de la base de datos
    console.log(`• BASE DE DATOS: ${process.env.DB_NAME}`);
    console.log('========================================================================================');
    console.log('                           ♦♦♦ INICIALIZANDO SISTEMA ♦♦♦');
    console.log('========================================================================================');
});
