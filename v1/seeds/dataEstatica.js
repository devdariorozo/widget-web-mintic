// ! ================================================================================================================================================
// !                                                          SEEDS DE DATOS ESTATICOS
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/seeds/dataEstatica.js

// ! VALORES ESTATICOS
// * TIPO DE GESTION
const tipoGestion = [
    'Inbound',
    'Outbound'
];

// * ESTADO DE CHAT
const estadoChat = [
    'Recibido',
    'Enviado'
];

// * ESTADO DE GESTION
const estadoGestion = [
    'Abierto',
    'Cerrado'
];

// * ARBOL
const arbol = [
    'Saludo',// 0
    'Despedida',// 1
    'Instrucciones',// 2
    'Inicio',// 3
    'Autorizacion Datos Personales',// 4
    'Procesar Autorizacion Datos Personales',// 5
    'Interaccion AI Soul',// 6
    'Error API',// 8
    'Cliente Desiste',// 9
    'Alerta Inactividad',// 10
    'Cerrado Por Inactividad',// 11
    'Condicion Adjuntos',// 12
    'Confirmar Adjuntos',// 13    
];

// * CONTROL DE ARBOL
const controlApi = [
    'Success',// 0
    'Error',// 1
    'Warning',// 2
    'Info',// 3
];

// * MENSAJES
// TODO: MENSAJE DE SALUDO
const saludo = `<p class="saludoChat">
                    👋 ¡Bienvenido(a)! Le saluda el Asistente Virtual del Ministerio TIC.<br/>
                    Este es un servicio de apoyo para personas con discapacidad auditiva o personas que desean ayudarles.<br/>
                    Estamos aquí para orientarle y facilitar su comunicación con otras personas o entidades.<br/>
                    Este servicio es completamente gratuito y confidencial.<br/><br/>
                    
                    <b>¿Cómo puedo ayudarle hoy?</b><br/>
                    Por favor, seleccione una opción:<br/><br/>

                    <b>1.</b> Soy una persona sorda y necesito ayuda<br/>
                    <b>2.</b> Deseo ayudar a una persona sorda<br/>
                    <b>3.</b> Deseo conocer más sobre este servicio<br/>
                </p>`;

// TODO: MENSAJE DE DESPEDIDA
const despedida = `<p class="despedidaChat">💙 ¡Gracias por contactarse con nosotros! <br/><br/>
                    Recuerde que este servicio está disponible de lunes a viernes de 8:00 a.m. a 8:00 p.m.<br/><br/>
                    Estamos para servirle.</p>`

// TODO: MENSAJE DE INSTRUCCIONES
const instrucciones = `<p class="instruccionesArbol">Hola,<br/><br/>
                        📝 <b>En el momento que desee volver a empezar, por favor escriba <b>inicio</b> o <b>INICIO</b> para regresar al menú principal🔄</b></p>`;

// TODO: OPCIONES INICIALES AYUDA
const opcionesInicialesAyuda = `<p class="opcionesInicialesAyudaArbol"><b>¿Cómo puedo ayudarle hoy?</b><br/><br/>
                    
                    Por favor, seleccione una opción:<br/><br/>

                    <b>1.</b> Soy una persona sorda y necesito ayuda<br/>
                    <b>2.</b> Deseo ayudar a una persona sorda<br/>
                    <b>3.</b> Deseo conocer más sobre este servicio<br/>
                </p>`;

// TODO: MENSAJE SOLICITANDO AUTORIZACION DE DATOS PERSONALES
const solicitarAutorizacionDatosPersonales = `  <p class="solicitarAutorizacionDatosPersonalesArbol">🛡️ <b>*Autorización de Tratamiento de Datos Personales*</b><br/><br/>
                                                Le informamos que sus datos serán utilizados únicamente para brindarle atención dentro del Servicio de Relevo de Comunicaciones, conforme a la Ley 1581 de 2012.</b><br/><br/>

                                                <a href="https://google.com" target="_blank">¿Autoriza usted el tratamiento de sus datos personales?</a><br/><br/>

                                                <b>Responda Si para continuar</b><br/>
                                                <b>Responda No para finalizar</b></p>`;

// TODO: MENSAJE SOLICITANDO CONDICION DE ADJUNTOS
const condicionAdjuntos = `<p class="condicionAdjuntosArbol">📝 <b>Adjuntar documentos:</b> <br/><br/>
                            📢 <i>No es obligatorio.</i><br/><br/>
                            ⚠️ <i>Se permite un máximo de 5 archivos.</i><br/>
                            ⚠️ <i>Los documentos deben ser archivos tipo .pdf .xls .xlsx .jpg .png .doc .docx únicamente y no deben superar los 5 MB.</i><br/><br/>
                            1. Adjuntar documentos <br/>
                            2. Continuar.</p>`;

// TODO: MENSAJE DE CONFIRMAR ADJUNTOS
const confirmarAdjuntos = `<p class="confirmarAdjuntosArbol">📝 <b>Por favor, adjuntar los archivos.</b></p>`;

// TODO: MENSAJE DE ALERTA DE NO ENTIENDO
const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
                            ⚠️ <i>Por favor, asegúrese de seguir las instrucciones y proporcione una respuesta válida.</i></p>`;
// // TODO: MENSAJE DE ALERTA DE NO ENTIENDO
// const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
//                             ⚠️ <i>Por favor, asegúrese de seguir las instrucciones y proporcione una respuesta válida.</i><br/><br/>
//                             ⚠️ <i>En el momento que desee volver, por favor escriba <b>inicio</b> o <b>INICIO</b> para volver a empezar 🔄.</i></p>`;

// TODO: MENSAJE DE ALERTA DE ERROR API
const alertaErrorAPI = `<p class="alertaErrorAPIArbol">⏳ <b>Estamos experimentando una incidencia técnica.</b><br/><br/>
                            🙏 <i>Le pedimos que espere o nos visite nuevamente en breve mientras solucionamos el inconveniente; agradecemos su comprensión.</i></p>`;

// TODO: MENSAJE DE NOVEDAD O INCIDENCIA TECNICA
const novedadIncidenciaTecnica = `<p class="novedadIncidenciaTecnicaArbol">🚨 ¡Atención!<br/><br/>
                                🔄 Estamos experimentando una novedad o incidencia técnica.<br/>
                                🕰️ Por favor, intente nuevamente más tarde. Agradecemos su paciencia.</p>`;

// TODO: MENSAJE DE CLIENTE DESISTE
const clienteDesiste = `<p class="clienteDesisteArbol">⚠️ <b>Hemos notado que ha decidido no continuar con la atención en nuestro sistema.</b><br/><br/>
                           👉 <i>Si necesita asistencia no dude en contactarnos nuevamente.</i></p>`;

// TODO: MENSAJE POR CHAT DIFERENTE A ABIERTO
const chatDiferenteAbierto = `<p class="chatDiferenteAbiertoArbol">⚠️ <b>Este chat está actualmente cerrado.</b><br/><br/>
                            📞 <i>Para continuar la comunicación, por favor, inicie un nuevo chat o contáctenos a través de nuestros canales oficiales.<br/><br/>
                            Agradecemos su comprensión, estamos aquí para ayudarle.</i></p>`;



// * ESTADO DE MENSAJE
const estadoMensaje = [
    'Recibido',
    'Enviado'
];

// * TIPO DE MENSAJE
const tipoMensaje = [
    'Texto', // 0
    'Adjuntos', // 1
    'Multimedia', // 2
    'Inactividad', // 3
    'Fin Chat', // 4
    'Error API', // 5
    'Formulario' // 6
];

// * LECTURA MENSAJE
const lecturaMensaje = [
    'No leido',
    'Leido'
];

// * ESTADO REGISTRO
const estadoRegistro = [
    'Activo',
    'Inactivo'
];

// * RESPONSABLE
const responsable = 'Chat Web Ministerio TIC';

// ! EXPORTACIONES
module.exports = {
    tipoGestion,
    estadoChat,
    estadoGestion,
    arbol,
    controlApi,
    saludo,
    despedida,
    instrucciones,
    opcionesInicialesAyuda,
    solicitarAutorizacionDatosPersonales,
    condicionAdjuntos,
    confirmarAdjuntos,
    alertaNoEntiendo,
    alertaErrorAPI,
    clienteDesiste,
    novedadIncidenciaTecnica,
    chatDiferenteAbierto,
    tipoMensaje,
    estadoMensaje,
    lecturaMensaje,
    estadoRegistro,
    responsable,
};