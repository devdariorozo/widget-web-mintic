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
    'Rol Usuario',// 5
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
                    <b>3.</b> Deseo conocer más sobre este servicio</p>`;

// TODO: MENSAJE DE DESPEDIDA
const despedida = `<p class="despedidaChat">💙 ¡Gracias por contactarse con nosotros! <br/><br/>
                    Recuerde que este servicio está disponible de lunes a viernes de 8:00 a.m. a 8:00 p.m.<br/><br/>
                    Estamos para servirle.</p>`

// TODO: MENSAJE DE INSTRUCCIONES
const instrucciones = `<p class="instruccionesArbol">Hola,<br/><br/>
                        📝 <b>En el momento que desee volver a empezar, por favor escriba <b>inicio</b> o <b>INICIO</b> para regresar al menú principal🔄</b></p>`;

// TODO: OPCIONES SERVICIOS
const opcionesServicios = `<p class="opcionesServiciosArbol"><b>¿Cómo puedo ayudarle hoy?</b><br/><br/>
                    
                    Por favor, seleccione una opción:<br/><br/>

                    <b>1.</b> Soy una persona sorda y necesito ayuda<br/>
                    <b>2.</b> Deseo ayudar a una persona sorda<br/>
                    <b>3.</b> Deseo conocer más sobre este servicio</p>`;

// TODO: MENSAJE SOLICITANDO AUTORIZACION DE DATOS PERSONALES
const solicitarAutorizacionDatosPersonales = `  <p class="solicitarAutorizacionDatosPersonalesArbol">🛡️ <b>*Autorización de Tratamiento de Datos Personales*</b><br/><br/>
                                                Le informamos que sus datos serán utilizados únicamente para brindarle atención dentro del Servicio de Relevo de Comunicaciones, conforme a la Ley 1581 de 2012.</b><br/><br/>

                                                <a href="https://google.com" target="_blank">¿Autoriza usted el tratamiento de sus datos personales?</a><br/><br/>

                                                <b>✅ Responda Si para continuar</b><br/>
                                                <b>❌ Responda No para finalizar</b></p>`;

// TODO: MENSAJE SOLICITANDO ROL USUARIO
const solicitarRolUsuario = `  <p class="solicitarRolUsuarioArbol">🧑‍🦻 <b>¿Usted se identifica como…?</b><br/><br/>
                                                
                                                <b>1.</b> Persona con discapacidad auditiva<br/>
                                                <b>2.</b> Persona que respresenta, ayuda o acompaña a una persona con discapacidad auditiva</p>`;

// TODO: MENSAJE SOLICITANDO TIPO DE DOCUMENTO
const solicitarTipoDocumento = `  <p class="solicitarTipoDocumentoArbol">📄 <b>¿Cuál es su tipo de documento?</b><br/><br/>
                                                
                                                Ejemplo: C.C, C.E., P., T.I.<br/><br/>

                                                <b>C.C.</b> Cédula de ciudadanía<br/>
                                                <b>C.E.</b> Cédula de extranjería<br/>
                                                <b>P.</b> Pasaporte<br/>
                                                <b>T.I.</b> Tarjeta de identidad</p>`;

// TODO: MENSAJE SOLICITANDO NUMERO DE DOCUMENTO
const solicitarNumeroDocumento = `  <p class="solicitarNumeroDocumentoArbol">🔢 <b>¿Cuál es su número de documento?</b><br/><br/>

                                                Por favor, ingrese su número de documento.</p>`;

// TODO: MENSAJE SOLICITANDO NOMBRE COMPLETO
const solicitarNombreCompleto = `  <p class="solicitarNombreCompletoArbol">👤 <b>¿Cuál es su nombre completo?</b><br/><br/>

                                                Por favor, ingrese su nombre completo.</p>`;

// TODO: MENSAJE SOLICITANDO SEXO
const solicitarSexo = `  <p class="solicitarSexoArbol">⚧️ <b>¿Cuál es su sexo?</b><br/><br/>

                                                Por favor, ingrese su sexo.</p>`;

// TODO: MENSAJE SOLICITANDO TELEFONO
const solicitarTelefono = `  <p class="solicitarTelefonoArbol">📱 <b>¿Cuál es su número de teléfono?</b><br/><br/>

                                                Por favor, ingrese su número de teléfono.</p>`;

// TODO: MENSAJE SOLICITANDO CORREO ELECTRONICO
const solicitarCorreoElectronico = `  <p class="solicitarCorreoElectronicoArbol">📧 <b>¿Cuál es su correo electrónico?</b><br/><br/>

                                                Por favor, ingrese su correo electrónico.</p>`;

// TODO: MENSAJE SOLICITANDO CIUDAD
const solicitarCiudadMunicipio = `  <p class="solicitarCiudadMunicipioArbol">🏙️ <b>A continuación, le presentamos un resumen de los datos registrados:</b><br/><br/>

                                                Por favor, ingrese su ciudad o municipio.</p>`;

// TODO: MENSAJE CONFIRMAR DATOS INGRESADOS
const confirmarDatosIngresados = `  <p class="confirmarDatosIngresadosArbol">📋 <b>¿Está seguro de que los datos ingresados son correctos?</b><br/><br/>

                                                <b>Tipo de documento:</b> <br/>
                                                <b>Número de documento:</b> <br/>
                                                <b>Nombre completo:</b> <br/>
                                                <b>Sexo:</b> <br/>
                                                <b>Teléfono:</b> <br/>
                                                <b>Correo electrónico:</b> <br/>
                                                <b>Ciudad o municipio:</b> <br/><br/>
                                                
                                                <b>✅ Responda Sí para continuar</b> <br/>
                                                <b>❌ Responda No si desea corregir algún dato</b></p>`;

// TODO: MENSAJE SOLICITANDO CORREGIR ALGUNO DE LOS DATOS INGRESADOS
const solicitarCorregirDatosIngresados = `  <p class="solicitarCorregirDatosIngresadosArbol">📝 <b>¿Desea corregir algún dato?</b> <br/><br/>

                                                <b>1.</b> Tipo de documento<br/>
                                                <b>2.</b> Número de documento<br/>
                                                <b>3.</b> Nombre completo<br/>
                                                <b>4.</b> Sexo<br/>
                                                <b>5.</b> Teléfono<br/>
                                                <b>6.</b> Correo electrónico<br/>
                                                <b>7.</b> Ciudad o municipio</p>`;

// TODO: MENSAJE SOLICITANDO CANAL DE ATENCION
const solicitarCanalAtencion = `  <p class="solicitarCanalAtencionArbol">💬 <b>¿Cómo desea continuar con la atención?</b> <br/><br/>

                                                <b>1.</b> Ser atendido por un agente humano a través del chat<br/>
                                                <b>2.</b> Conectarse a una videollamada con intérprete en lengua de señas</p>`;

// TODO: MENSAJE SOLICITANDO PASO AGENTE HUMANO
const solicitarPasoAgenteHumano = `  <p class="solicitarPasoAgenteHumanoArbol">🔄 <b>Estamos transfiriendo su solicitud a uno de nuestros agentes</b> <br/><br/>

                                                 Por favor, espere un momento mientras lo conectamos.</p>`;

// TODO: MENSAJE SOLICITANDO VIDEOLLAMADA
const solicitarVideoLlamada = `  <p class="solicitarVideoLlamadaArbol">🎥 <b>Estamos abriendo la videollamada de atención.</b> <br/><br/>

                                                 Por favor, espere un momento mientras se establece la conexión con el intérprete en lengua de señas colombiana.</p>`;

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
    opcionesServicios,
    solicitarAutorizacionDatosPersonales,
    solicitarRolUsuario,
    solicitarTipoDocumento,
    solicitarNumeroDocumento,
    solicitarNombreCompleto,
    solicitarSexo,
    solicitarTelefono,
    solicitarCorreoElectronico,
    solicitarCiudadMunicipio,
    confirmarDatosIngresados,
    solicitarCorregirDatosIngresados,
    solicitarCanalAtencion,
    solicitarPasoAgenteHumano,
    solicitarVideoLlamada,
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