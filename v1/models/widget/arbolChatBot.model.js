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

// ! FUNCIONES DE UTILIDAD
// * Capitalizar texto (primera letra de cada palabra en mayúscula)
const capitalizarTexto = (texto) => {
    if (!texto || texto === '-') return texto;
    return texto
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

// * Capitalizar abreviaciones en "letra capital" (ej: C.c, C.e, P, T.i)
const capitalizarAbreviacion = (abreviacion) => {
    if (!abreviacion || abreviacion === '-') return abreviacion;
    const partes = abreviacion.split('.');
    if (partes.length === 1) {
        const p = partes[0];
        return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : '';
    }
    // Primera parte en mayúscula, las siguientes en minúscula
    const [primera, ...resto] = partes;
    const primeraCap = primera ? primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase() : '';
    const restoCap = resto.map(p => (p ? p.charAt(0).toLowerCase() + p.slice(1).toLowerCase() : ''));
    return [primeraCap, ...restoCap].join('.');
};

// * Formatear número con separadores de miles
const formatearNumeroConMiles = (numero) => {
    if (!numero || numero === '-') return numero;
    // Si ya tiene separadores de miles, no hacer nada
    if (numero.toString().includes('.')) return numero;
    // Convertir a string y eliminar cualquier formato previo
    const numeroLimpio = numero.toString().replace(/\D/g, '');
    // Formatear con separadores de miles
    return numeroLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// * Formatear teléfono con espacios
const formatearTelefono = (telefono) => {
    if (!telefono || telefono === '-') return telefono;
    // Si ya tiene espacios, no hacer nada
    if (telefono.toString().includes(' ')) return telefono;
    // Convertir a string y eliminar cualquier formato previo
    const numeroLimpio = telefono.toString().replace(/\D/g, '');
    // Formatear con espacios: XXX XXX XXXX
    if (numeroLimpio.length === 10) {
        return `${numeroLimpio.substring(0, 3)} ${numeroLimpio.substring(3, 6)} ${numeroLimpio.substring(6, 10)}`;
    }
    // Si no es de 10 dígitos, devolver tal como está
    return numeroLimpio;
};

// ! VARIABLES GLOBALES
let chatData = {
    controlApi: '-',
    controlPeticiones: '-',
    resultadoApi: '-',
    servicio: '-',
    autorizacionDatosPersonales: '-',
    tipoDocumento: '-',
    numeroDocumento: '-',
    nombreCompleto: '-',
    sexo: '-',
    contacto: '-',
    correo: '-',
    ciudadMunicipio: '-',
    canalAtencion: '-',
    adjuntos: '-',
    rutaAdjuntos: '-',
    descripcion: '-',
    estadoRegistro: '-',
    responsable: '-',
    modoCorreccion: false // Flag para detectar si estamos corrigiendo datos
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
    chatData.servicio = chat[0].SERVICIO || defaultData;
    chatData.autorizacionDatosPersonales = chat[0].AUTORIZACION_DATOS_PERSONALES || defaultData;
    chatData.tipoDocumento = chat[0].TIPO_DOCUMENTO || defaultData;
    chatData.numeroDocumento = chat[0].NUMERO_DOCUMENTO || defaultData;
    chatData.nombreCompleto = chat[0].NOMBRE_COMPLETO || defaultData;
    chatData.sexo = chat[0].SEXO || defaultData;
    chatData.contacto = chat[0].CONTACTO || defaultData;
    chatData.correo = chat[0].CORREO || defaultData;
    chatData.ciudadMunicipio = chat[0].CIUDAD_MUNICIPIO || defaultData;
    chatData.canalAtencion = chat[0].CANAL_ATENCION || defaultData;
    chatData.adjuntos = chat[0].ADJUNTOS || defaultData;
    chatData.rutaAdjuntos = chat[0].RUTA_ADJUNTOS || defaultData;
    chatData.descripcion = chat[0].DESCRIPCION || defaultData;
    chatData.estadoRegistro = chat[0].REGISTRO || defaultData;
    chatData.responsable = chat[0].RESPONSABLE || defaultData;

    if (estadoGestionChat !== 'Cerrado') {
        try {
            // todo: Saludo Arbol
            if (arbolChat === 'Saludo' || arbolChat === 'Alerta No Entiendo - Saludo' || arbolChat === 'Opciones Servicios' || arbolChat === 'Alerta No Entiendo - Opciones Servicios') {
                if (contenido === '1' || contenido === '2' || contenido === '3') {
                    // Guardar el servicio seleccionado
                    const servicios = {
                        '1': 'Soy una persona sorda y necesito ayuda',
                        '2': 'Deseo ayudar a una persona sorda',
                        '3': 'Deseo conocer más sobre este servicio'
                    };
                    chatData.servicio = servicios[contenido];
                    
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
            if (arbolChat === 'Inicio' || arbolChat === 'inicio' || contenido.toUpperCase() === 'INICIO') {
                const pasoArbol = dataEstatica.arbol.saludo;
                chatData.descripcion = 'Se empieza de nuevo el flujo del chat.';
                // Actualizar el chat
                await modelChat.actualizar(idChat, pasoArbol, chatData);
                return await modelMensaje.crear(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.saludo, '-', dataEstatica.configuracion.lecturaMensaje.noLeido, 'Se crea el mensaje de bienvenida.', dataEstatica.configuracion.estadoRegistro.activo, dataEstatica.configuracion.responsable);
            }

            // todo: Autorizacion Datos Personales Arbol
            if (arbolChat === 'Autorizacion Datos Personales' || arbolChat === 'Alerta No Entiendo - Autorizacion Datos Personales') {
                // ! Se refiere a consumir el endpoint de interaccion AI Soul
                return await procesarAutorizacionDatosPersonales(idChat, remitente, contenido);
            }

            // todo: Rol Usuario Arbol
            if (arbolChat === 'Rol Usuario' || arbolChat === 'Alerta No Entiendo - Rol Usuario') {
                return await procesarRolUsuario(idChat, remitente, contenido);
            }

            // todo: Tipo Documento Arbol
            if (arbolChat === 'Solicitar Tipo Documento' || arbolChat === 'Alerta No Entiendo - Tipo Documento') {
                return await procesarTipoDocumento(idChat, remitente, contenido);
            }

            // todo: Numero Documento Arbol
            if (arbolChat === 'Solicitar Numero Documento' || arbolChat === 'Alerta No Entiendo - Numero Documento') {
                return await procesarNumeroDocumento(idChat, remitente, contenido);
            }

            // todo: Nombre Completo Arbol
            if (arbolChat === 'Solicitar Nombre Completo' || arbolChat === 'Alerta No Entiendo - Nombre Completo') {
                return await procesarNombreCompleto(idChat, remitente, contenido);
            }

            // todo: Sexo Arbol
            if (arbolChat === 'Solicitar Sexo' || arbolChat === 'Alerta No Entiendo - Sexo') {
                return await procesarSexo(idChat, remitente, contenido);
            }

            // todo: Telefono Arbol
            if (arbolChat === 'Solicitar Telefono' || arbolChat === 'Alerta No Entiendo - Telefono') {
                return await procesarTelefono(idChat, remitente, contenido);
            }

            // todo: Correo Electronico Arbol
            if (arbolChat === 'Solicitar Correo Electronico' || arbolChat === 'Alerta No Entiendo - Correo Electronico') {
                return await procesarCorreoElectronico(idChat, remitente, contenido);
            }

            // todo: Ciudad Municipio Arbol
            if (arbolChat === 'Solicitar Ciudad Municipio' || arbolChat === 'Alerta No Entiendo - Ciudad Municipio') {
                return await procesarCiudadMunicipio(idChat, remitente, contenido);
            }

            // todo: Confirmar Datos Ingresados Arbol
            if (arbolChat === 'Confirmar Datos Ingresados' || arbolChat === 'Alerta No Entiendo - Confirmacion Datos') {
                return await procesarConfirmacionDatos(idChat, remitente, contenido);
            }

            // todo: Corregir Datos Ingresados Arbol
            if (arbolChat === 'Corregir Datos Ingresados' || arbolChat === 'Alerta No Entiendo - Corregir Datos') {
                return await procesarCorregirDatosIngresados(idChat, remitente, contenido);
            }

            // todo: Canal Atencion Arbol
            if (arbolChat === 'Solicitar Canal Atencion' || arbolChat === 'Alerta No Entiendo - Canal Atencion') {
                return await procesarCanalAtencion(idChat, remitente, contenido);
            }

            // todo: Paso Agente Humano Arbol
            if (arbolChat === 'Paso Agente Humano' || arbolChat === 'Alerta No Entiendo - Paso Agente Humano') {
                return await procesarPasoAgenteHumano_SoulChat(idChat, remitente, contenido);
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
        const pasoArbol = dataEstatica.arbol.clienteDesiste;
        chatData.descripcion = 'Cliente desiste de continuar con la atención en el sistema.';

        await modelChat.actualizar(idChat, pasoArbol, chatData);

        await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.clienteDesiste, chatData.descripcion);

        await modelChat.cerrar(remitente, dataEstatica.configuracion.estadoChat.recibido, dataEstatica.configuracion.estadoGestion.cerrado, dataEstatica.arbol.despedida, dataEstatica.configuracion.controlApi.success, chatData.descripcion, dataEstatica.configuracion.estadoRegistro.activo, dataEstatica.configuracion.responsable);

        chatData.descripcion = 'Se envía mensaje de despedida.';
        return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.finChat, dataEstatica.mensajes.despedida, chatData.descripcion);
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
    const solicitarOpcionesServiciosArbol = dataEstatica.arbol.opcionesServicios;
    chatData.descripcion = 'Se solicitan nuevamente las opciones de servicios.';
    await modelChat.actualizar(idChat, solicitarOpcionesServiciosArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.opcionesServicios, chatData.descripcion);
};

// todo: Solicitar Autorizacion Datos Personales Arbol
const solicitarAutorizacionDatosPersonales = async (idChat, remitente) => {
    const solicitarAutorizacionDatosPersonalesArbol = dataEstatica.arbol.autorizacionDatosPersonales;
    chatData.descripcion = 'Se solicita la autorización de datos personales.';
    await modelChat.actualizar(idChat, solicitarAutorizacionDatosPersonalesArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarAutorizacionDatosPersonales, chatData.descripcion);
};

// todo: Procesar Autorizacion Datos Personales Arbol
const procesarAutorizacionDatosPersonales = async (idChat, remitente, contenido) => {
    // Convertir la primera letra a mayúscula y el resto a minúscula
    contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
    console.log('contenido: ', contenido);
    if (contenido === 'Si') {
        // Guardar la autorización
        chatData.autorizacionDatosPersonales = 'Si';
        // Solicitar rol usuario
        return await solicitarRolUsuario(idChat, remitente);
    } else if (contenido === 'No') {
        // Guardar la autorización
        chatData.autorizacionDatosPersonales = 'No';
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
    const solicitarRolUsuarioArbol = dataEstatica.arbol.rolUsuario;
    chatData.descripcion = 'Se solicita el rol del usuario.';
    await modelChat.actualizar(idChat, solicitarRolUsuarioArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarRolUsuario, chatData.descripcion);
};

// todo: Procesar Rol Usuario Arbol
const procesarRolUsuario = async (idChat, remitente, contenido) => {
    // Convertir la primera letra a mayúscula y el resto a minúscula
    contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1).toLowerCase();
    console.log('contenido: ', contenido);
    if (contenido === '1' || contenido === '2') {
        // Continuar con el siguiente paso: solicitar tipo de documento
        return await solicitarTipoDocumento(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Rol Usuario';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, responda 1 o 2.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    // todo: Volver a Solicitar Rol Usuario
    return await solicitarRolUsuario(idChat, remitente);
};

// todo: Solicitar Tipo Documento Arbol
const solicitarTipoDocumento = async (idChat, remitente) => {
    const solicitarTipoDocumentoArbol = dataEstatica.arbol.solicitarTipoDocumento;
    chatData.descripcion = 'Se solicita el tipo de documento.';
    await modelChat.actualizar(idChat, solicitarTipoDocumentoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarTipoDocumento, chatData.descripcion);
};

// todo: Procesar Tipo Documento Arbol
const procesarTipoDocumento = async (idChat, remitente, contenido) => {
    // Mapeo de números a tipos de documento válidos
    const mapeoTiposDocumento = {
        '1': 'C.C',
        '2': 'C.E', 
        '3': 'P',
        '4': 'T.I'
    };
    
    // Mapeo de formatos sin puntos a formatos con puntos
    const mapeoFormatos = {
        'CC': 'C.C',
        'CE': 'C.E',
        'TI': 'T.I',
        'P': 'P'
    };
    
    // Tipos de documento válidos (con puntos)
    const tiposValidos = ['C.C', 'C.E', 'P', 'T.I'];
    
    let tipoDocumento = null;
    
    // Si el usuario ingresa un número, mapearlo al tipo correspondiente
    if (mapeoTiposDocumento[contenido]) {
        tipoDocumento = mapeoTiposDocumento[contenido];
    }
    // Si el usuario ingresa directamente el tipo de documento (con o sin puntos)
    else {
        const contenidoNormalizado = contenido.toUpperCase().trim();
        
        // Verificar si es un formato válido con puntos
        if (tiposValidos.includes(contenidoNormalizado)) {
            tipoDocumento = contenidoNormalizado;
        }
        // Verificar si es un formato sin puntos
        else if (mapeoFormatos[contenidoNormalizado]) {
            tipoDocumento = mapeoFormatos[contenidoNormalizado];
        }
    }
    
    // Validar que se haya obtenido un tipo válido
    if (tipoDocumento) {
        // Guardar el tipo de documento en la variable correcta (capitalizado)
        chatData.tipoDocumento = capitalizarAbreviacion(tipoDocumento);
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar número de documento
        return await solicitarNumeroDocumento(idChat, remitente);
    }

    // Si no es válido, mostrar mensaje de error
    const pasoArbol = 'Alerta No Entiendo - Tipo Documento';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, seleccione una opción válida:<br/><br/>
    <b>1.</b> C.C (Cédula de Ciudadanía)<br/>
    <b>2.</b> C.E (Cédula de Extranjería)<br/>
    <b>3.</b> P (Pasaporte)<br/>
    <b>4.</b> T.I (Tarjeta de Identidad)<br/><br/>
    O escriba directamente: C.C, C.E, P, T.I</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarTipoDocumento(idChat, remitente);
};

// ! FUNCIONES DE CORRECCIÓN (vuelven a confirmación)
// * Procesar Tipo Documento en modo corrección
const procesarTipoDocumentoCorreccion = async (idChat, remitente, contenido) => {
    // Mapeo de números a tipos de documento válidos
    const mapeoTiposDocumento = {
        '1': 'C.C',
        '2': 'C.E', 
        '3': 'P',
        '4': 'T.I'
    };
    
    // Mapeo de formatos sin puntos a formatos con puntos
    const mapeoFormatos = {
        'CC': 'C.C',
        'CE': 'C.E',
        'TI': 'T.I',
        'P': 'P'
    };
    
    // Tipos de documento válidos (con puntos)
    const tiposValidos = ['C.C', 'C.E', 'P', 'T.I'];
    
    let tipoDocumento = null;
    
    // Si el usuario ingresa un número, mapearlo al tipo correspondiente
    if (mapeoTiposDocumento[contenido]) {
        tipoDocumento = mapeoTiposDocumento[contenido];
    }
    // Si el usuario ingresa directamente el tipo de documento (con o sin puntos)
    else {
        const contenidoNormalizado = contenido.toUpperCase().trim();
        
        // Verificar si es un formato válido con puntos
        if (tiposValidos.includes(contenidoNormalizado)) {
            tipoDocumento = contenidoNormalizado;
        }
        // Verificar si es un formato sin puntos
        else if (mapeoFormatos[contenidoNormalizado]) {
            tipoDocumento = mapeoFormatos[contenidoNormalizado];
        }
    }
    
    // Validar que se haya obtenido un tipo válido
    if (tipoDocumento) {
        // Guardar el tipo de documento en la variable correcta (capitalizado)
        chatData.tipoDocumento = capitalizarAbreviacion(tipoDocumento);
        
        // En modo corrección, volver a la confirmación de datos
        return await confirmarDatosIngresados(idChat, remitente);
    }

    // Si no es válido, mostrar mensaje de error
    const pasoArbol = 'Alerta No Entiendo - Tipo Documento';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, seleccione una opción válida:<br/><br/>
    <b>1.</b> C.C (Cédula de Ciudadanía)<br/>
    <b>2.</b> C.E (Cédula de Extranjería)<br/>
    <b>3.</b> P (Pasaporte)<br/>
    <b>4.</b> T.I (Tarjeta de Identidad)<br/><br/>
    O escriba directamente: C.C, C.E, P, T.I</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarTipoDocumento(idChat, remitente);
};

// todo: Solicitar Numero Documento Arbol
const solicitarNumeroDocumento = async (idChat, remitente) => {
    const solicitarNumeroDocumentoArbol = dataEstatica.arbol.solicitarNumeroDocumento;
    chatData.descripcion = 'Se solicita el número de documento.';
    await modelChat.actualizar(idChat, solicitarNumeroDocumentoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarNumeroDocumento, chatData.descripcion);
};

// todo: Procesar Numero Documento Arbol
const procesarNumeroDocumento = async (idChat, remitente, contenido) => {
    // Normalizar: permitir espacios, puntos u otros, quedarnos solo con dígitos
    const soloDigitos = (contenido || '').replace(/\D/g, '');
    // Validar que sea un número válido (mínimo 5 dígitos)
    if (soloDigitos && soloDigitos.length >= 5) {
        // Guardar el número formateado con separadores de miles
        chatData.numeroDocumento = formatearNumeroConMiles(soloDigitos);
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar nombre completo
        return await solicitarNombreCompleto(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Numero Documento';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, ingrese un número de documento válido (mínimo 5 dígitos). Puede escribirlo con o sin puntos/espacios.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarNumeroDocumento(idChat, remitente);
};

// todo: Solicitar Nombre Completo Arbol
const solicitarNombreCompleto = async (idChat, remitente) => {
    const solicitarNombreCompletoArbol = dataEstatica.arbol.solicitarNombreCompleto;
    chatData.descripcion = 'Se solicita el nombre completo.';
    await modelChat.actualizar(idChat, solicitarNombreCompletoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarNombreCompleto, chatData.descripcion);
};

// todo: Procesar Nombre Completo Arbol
const procesarNombreCompleto = async (idChat, remitente, contenido) => {
    // Validar que tenga al menos 2 palabras (nombre y apellido)
    if (contenido && contenido.trim().split(' ').length >= 2) {
        // Guardar el nombre completo (capitalizado)
        chatData.nombreCompleto = capitalizarTexto(contenido.trim());
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar sexo
        return await solicitarSexo(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Nombre Completo';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, ingrese su nombre completo (nombre y apellido).</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarNombreCompleto(idChat, remitente);
};

// todo: Solicitar Sexo Arbol
const solicitarSexo = async (idChat, remitente) => {
    const solicitarSexoArbol = dataEstatica.arbol.solicitarSexo;
    chatData.descripcion = 'Se solicita el sexo.';
    await modelChat.actualizar(idChat, solicitarSexoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarSexo, chatData.descripcion);
};

// todo: Procesar Sexo Arbol
const procesarSexo = async (idChat, remitente, contenido) => {
    // Mapeo de números a sexos válidos
    const mapeoSexos = {
        '1': 'Masculino',
        '2': 'Femenino'
    };
    
    // Sexos válidos
    const sexosValidos = ['Masculino', 'Femenino'];
    
    let sexo = null;
    
    // Si el usuario ingresa un número, mapearlo al sexo correspondiente
    if (mapeoSexos[contenido]) {
        sexo = mapeoSexos[contenido];
    }
    // Si el usuario ingresa directamente el sexo
    else if (sexosValidos.includes(contenido)) {
        sexo = contenido;
    }
    
    // Validar que se haya obtenido un sexo válido
    if (sexo) {
        // Guardar el sexo (capitalizado)
        chatData.sexo = capitalizarTexto(sexo);
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar teléfono
        return await solicitarTelefono(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Sexo';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, seleccione una opción válida:<br/><br/>
    <b>1.</b> Masculino<br/>
    <b>2.</b> Femenino<br/><br/>
    O escriba directamente: Masculino, Femenino</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarSexo(idChat, remitente);
};

// todo: Solicitar Telefono Arbol
const solicitarTelefono = async (idChat, remitente) => {
    const solicitarTelefonoArbol = dataEstatica.arbol.solicitarTelefono;
    chatData.descripcion = 'Se solicita el número de teléfono.';
    await modelChat.actualizar(idChat, solicitarTelefonoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarTelefono, chatData.descripcion);
};

// todo: Procesar Telefono Arbol
const procesarTelefono = async (idChat, remitente, contenido) => {
    // Normalizar: permitir espacios, puntos, guiones, quedarnos solo con dígitos
    const soloDigitos = (contenido || '').replace(/\D/g, '');
    // Validar que sea un número válido (mínimo 7 dígitos)
    if (soloDigitos && soloDigitos.length >= 7) {
        // Guardar el teléfono formateado con espacios
        chatData.contacto = formatearTelefono(soloDigitos);
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar correo electrónico
        return await solicitarCorreoElectronico(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Telefono';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, ingrese un número de teléfono válido (mínimo 7 dígitos). Puede escribirlo con o sin espacios, guiones o puntos.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarTelefono(idChat, remitente);
};

// todo: Solicitar Correo Electronico Arbol
const solicitarCorreoElectronico = async (idChat, remitente) => {
    const solicitarCorreoElectronicoArbol = dataEstatica.arbol.solicitarCorreoElectronico;
    chatData.descripcion = 'Se solicita el correo electrónico.';
    await modelChat.actualizar(idChat, solicitarCorreoElectronicoArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarCorreoElectronico, chatData.descripcion);
};

// todo: Procesar Correo Electronico Arbol
const procesarCorreoElectronico = async (idChat, remitente, contenido) => {
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contenido && emailRegex.test(contenido)) {
        // Guardar el correo electrónico
        chatData.correo = contenido;
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el flujo normal: solicitar ciudad/municipio
        return await solicitarCiudadMunicipio(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Correo Electronico';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarCorreoElectronico(idChat, remitente);
};

// todo: Solicitar Ciudad Municipio Arbol
const solicitarCiudadMunicipio = async (idChat, remitente) => {
    const solicitarCiudadMunicipioArbol = dataEstatica.arbol.solicitarCiudadMunicipio;
    chatData.descripcion = 'Se solicita la ciudad o municipio.';
    await modelChat.actualizar(idChat, solicitarCiudadMunicipioArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarCiudadMunicipio, chatData.descripcion);
};

// todo: Procesar Ciudad Municipio Arbol
const procesarCiudadMunicipio = async (idChat, remitente, contenido) => {
    // Validar que tenga al menos 3 caracteres
    if (contenido && contenido.trim().length >= 3) {
        // Guardar la ciudad/municipio (capitalizada)
        chatData.ciudadMunicipio = capitalizarTexto(contenido.trim());
        
        // Si estamos en modo corrección, volver a la confirmación
        if (chatData.modoCorreccion) {
            chatData.modoCorreccion = false; // Resetear el flag
            return await confirmarDatosIngresados(idChat, remitente);
        }
        
        // Si no es corrección, continuar con el siguiente paso: confirmar datos ingresados
        return await confirmarDatosIngresados(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Ciudad Municipio';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, ingrese su ciudad o municipio (mínimo 3 caracteres).</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarCiudadMunicipio(idChat, remitente);
};

// todo: Confirmar Datos Ingresados Arbol
const confirmarDatosIngresados = async (idChat, remitente) => {
    const confirmarDatosIngresadosArbol = dataEstatica.arbol.confirmarDatosIngresados;
    chatData.descripcion = 'Se solicitan confirmar los datos ingresados.';
    await modelChat.actualizar(idChat, confirmarDatosIngresadosArbol, chatData);
    
    const numDocMostrar = chatData.numeroDocumento;
    const telMostrar = chatData.contacto;
    
    // Construir mensaje con los datos ingresados (capitalizados y respetando formato ingresado donde aplica)
    const mensajeConfirmacion = dataEstatica.mensajes.confirmarDatosIngresados
        .replace('<b>Tipo de documento:</b> <br/>', `<b>Tipo de documento:</b> ${capitalizarAbreviacion(chatData.tipoDocumento)}<br/>`)
        .replace('<b>Número de documento:</b> <br/>', `<b>Número de documento:</b> ${numDocMostrar}<br/>`)
        .replace('<b>Nombre completo:</b> <br/>', `<b>Nombre completo:</b> ${capitalizarTexto(chatData.nombreCompleto)}<br/>`)
        .replace('<b>Sexo:</b> <br/>', `<b>Sexo:</b> ${capitalizarTexto(chatData.sexo)}<br/>`)
        .replace('<b>Teléfono:</b> <br/>', `<b>Teléfono:</b> ${telMostrar}<br/>`)
        .replace('<b>Correo electrónico:</b> <br/>', `<b>Correo electrónico:</b> ${chatData.correo}<br/>`)
        .replace('<b>Ciudad o municipio:</b> <br/>', `<b>Ciudad o municipio:</b> ${capitalizarTexto(chatData.ciudadMunicipio)}<br/>`)
    
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, mensajeConfirmacion, chatData.descripcion);
};

// todo: Procesar Confirmacion Datos Arbol
const procesarConfirmacionDatos = async (idChat, remitente, contenido) => {
    // Validar respuesta de confirmación
    const respuestasValidas = ['SI', 'SÍ', 'Si', 'Sí', 'si', 'sí', '1', 'S', 'Y', 'YES', 'Yes', 'yes'];
    if (respuestasValidas.includes(contenido.toUpperCase())) {
        // Datos confirmados, continuar con el siguiente paso: solicitar canal de atención
        return await solicitarCanalAtencion(idChat, remitente);
    } else if (contenido.toUpperCase() === 'NO' || contenido.toUpperCase() === 'N' || contenido === '2') {
        // Datos no confirmados, ir a corregir datos
        return await solicitarCorregirDatosIngresados(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Confirmacion Datos';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, responda Si para confirmar o No para corregir los datos.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await confirmarDatosIngresados(idChat, remitente);
};

// todo: Solicitar Corregir Datos Ingresados Arbol
const solicitarCorregirDatosIngresados = async (idChat, remitente) => {
    const solicitarCorregirDatosIngresadosArbol = dataEstatica.arbol.corregirDatosIngresados;
    chatData.descripcion = 'Se solicitan corregir los datos ingresados.';
    await modelChat.actualizar(idChat, solicitarCorregirDatosIngresadosArbol, chatData);
    
    const mensajeCorreccion = `<p class="solicitarCorregirDatosIngresadosArbol">📝 <b>¿Desea corregir algún dato?</b><br/><br/>
    Por favor, seleccione una opción:<br/><br/>
    <b>1.</b> Tipo de documento<br/>
    <b>2.</b> Número de documento<br/>
    <b>3.</b> Nombre completo<br/>
    <b>4.</b> Sexo<br/>
    <b>5.</b> Teléfono<br/>
    <b>6.</b> Correo electrónico<br/>
    <b>7.</b> Ciudad o municipio<br/><br/>
    <i>O responda Sí para continuar con el flujo del árbol</i></p>`;
    
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, mensajeCorreccion, chatData.descripcion);
};

// todo: Procesar Corregir Datos Ingresados Arbol
const procesarCorregirDatosIngresados = async (idChat, remitente, contenido) => {
    // Validar si quiere continuar
    const respuestasContinuar = ['SI', 'SÍ', 'Si', 'Sí', 'si', 'sí', 'S', 'Y', 'YES', 'Yes', 'yes'];
    if (respuestasContinuar.includes(contenido.toUpperCase())) {
        // Continuar con el flujo del árbol
        return await solicitarCanalAtencion(idChat, remitente);
    }
    
    // Validar que sea una opción válida del 1 al 9
    if (contenido && /^[1-9]$/.test(contenido)) {
        const opcion = parseInt(contenido);
        
        // Activar modo corrección
        chatData.modoCorreccion = true;
        
        switch (opcion) {
            case 1: // Servicio
                return await solicitarTipoDocumento(idChat, remitente);
            case 2: // Tipo de documento
                return await solicitarNumeroDocumento(idChat, remitente);
            case 3: // Nombre completo
                return await solicitarNombreCompleto(idChat, remitente);
            case 4: // Sexo
                return await solicitarSexo(idChat, remitente);
            case 5: // Teléfono
                return await solicitarTelefono(idChat, remitente);
            case 6: // Correo electrónico
                return await solicitarCorreoElectronico(idChat, remitente);
            case 7: // Ciudad o municipio
                return await solicitarCiudadMunicipio(idChat, remitente);
        }
    }

    const pasoArbol = 'Alerta No Entiendo - Corregir Datos';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, seleccione una opción del 1 al 9 para corregir el dato correspondiente, o responda Sí para continuar:<br/><br/>
    <b>1.</b> Servicio<br/>
    <b>2.</b> Tipo de documento<br/>
    <b>3.</b> Número de documento<br/>
    <b>4.</b> Nombre completo<br/>
    <b>5.</b> Sexo<br/>
    <b>6.</b> Teléfono<br/>
    <b>7.</b> Correo electrónico<br/>
    <b>8.</b> Ciudad o municipio<br/>
    <b>9.</b> Canal de atención</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarCorregirDatosIngresados(idChat, remitente, contenido); // Recursividad para volver a preguntar
};

// todo: Solicitar Canal de Atención Arbol
const solicitarCanalAtencion = async (idChat, remitente) => {
    const solicitarCanalAtencionArbol = dataEstatica.arbol.solicitarCanalAtencion;
    chatData.descripcion = 'Se solicita el canal de atención.';
    await modelChat.actualizar(idChat, solicitarCanalAtencionArbol, chatData);
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarCanalAtencion, chatData.descripcion);
};

// todo: Procesar Canal de Atención Arbol
const procesarCanalAtencion = async (idChat, remitente, contenido) => {
    // Validar que sea una opción válida
    if (contenido === '1') {
        // Guardar el canal de atención
        chatData.canalAtencion = 'Ser atendido por un agente humano a través del chat';
        // Agente humano, continuar con el siguiente paso
        return await solicitarPasoAgenteHumano(idChat, remitente);
    } else if (contenido === '2') {
        // Guardar el canal de atención
        chatData.canalAtencion = 'Conectarse a una videollamada con intérprete en lengua de señas';
        // Videollamada, continuar con el siguiente paso
        return await solicitarVideoLlamada(idChat, remitente);
    }

    const pasoArbol = 'Alerta No Entiendo - Canal Atencion';
    const alertaNoEntiendo = `<p class="alertaNoEntiendoArbol">❓ <b>No entiendo su respuesta.</b><br/><br/>
    ⚠️ <i>Por favor, seleccione una opción: 1 para agente humano o 2 para videollamada.</i></p>`;

    await manejarNoEntiendo(idChat, remitente, pasoArbol, alertaNoEntiendo);
    return await solicitarCanalAtencion(idChat, remitente);
};

// todo: Solicitar Paso Agente Humano Arbol
const solicitarPasoAgenteHumano = async (idChat, remitente) => {
    const solicitarPasoAgenteHumanoArbol = dataEstatica.arbol.solicitarPasoAgenteHumano;
    chatData.descripcion = 'Se solicita paso a agente humano.';
    await modelChat.actualizar(idChat, solicitarPasoAgenteHumanoArbol, chatData);
    await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarPasoAgenteHumano, chatData.descripcion);
    return await procesarPasoAgenteHumano_SoulChat(idChat, remitente);
};

// todo: Procesar Paso Agente Humano Soul Chat Arbol
const procesarPasoAgenteHumano_SoulChat = async (idChat, remitente) => {
    try {
        // Construir el mensaje con los datos del cliente
        const contenido = `Cliente solicita paso a agente humano. Datos del cliente:
- Tipo de documento: ${chatData.tipoDocumento}
- Número de documento: ${chatData.numeroDocumento}
- Nombre completo: ${chatData.nombreCompleto}
- Sexo: ${chatData.sexo}
- Teléfono: ${chatData.contacto}
- Correo: ${chatData.correo}
- Ciudad: ${chatData.ciudadMunicipio}
- Servicio: ${chatData.servicio}`;

        const estructuraMensaje = {
            provider: "web",
            canal: 3,
            idChat: idChat,
            remitente: remitente,
            estado: "START",
            mensaje: contenido,
            type: "TEXT"
        };
        
        // Control de intentos
        if (chatData.controlPeticiones <= 5) {
            
            // Consumir servicio de AI Soul
            const response = await serviceSoulChat.procesarMensajeAISoul(estructuraMensaje);
            chatData.resultadoApi = JSON.stringify(response.data);

            // Si la respuesta tiene status 200 o 202
            if (response.status === 200 || response.status === 202) {
                chatData.controlApi = dataEstatica.configuracion.controlApi.success;
                chatData.descripcion = 'AI Soul ha recibido el mensaje, se encuentra procesando la respuesta.';
                
                // Actualizar el chat
                await modelChat.actualizar(idChat, dataEstatica.arbol.solicitarPasoAgenteHumano, chatData);
                
                // No enviar mensaje adicional, ya se envió el mensaje inicial en solicitarPasoAgenteHumano
                return true;
            } else {
                chatData.controlPeticiones++;
                chatData.descripcion = 'AI Soul está presentando una novedad o incidencia técnica.';
                
                // Actualizar el chat
                await modelChat.actualizar(idChat, dataEstatica.arbol.errorApi, chatData);

                // Enviar mensaje de error por API
                const api = 'Soul Chat';
                const procesoApi = 'Procesar Mensaje AI';
                const error = response;
                return await errorAPI(api, procesoApi, error, idChat, remitente);
            }

        } else {
            chatData.descripcion = 'Se presenta novedad con el servicio de AI Soul, se procede a cerrar el chat por límite de intentos.';
            
            // Crear mensaje de novedad o incidencia técnica
            await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.novedadIncidenciaTecnica, chatData.descripcion);

            // Cerrar el chat
            await modelChat.cerrar(remitente, dataEstatica.configuracion.estadoChat.recibido, dataEstatica.configuracion.estadoGestion.cerrado, dataEstatica.arbol.despedida, dataEstatica.configuracion.controlApi.error, chatData.descripcion, dataEstatica.configuracion.estadoRegistro.activo, dataEstatica.configuracion.responsable);
            
            return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.finChat, dataEstatica.mensajes.despedida, 'Chat cerrado por límite de intentos con AI Soul.');
        }

    } catch (error) {
        const api = 'Soul Chat';
        const procesoApi = 'Procesar Mensaje AI';
        console.log('❌ Error en v1/models/widget/arbolChatBot.model.js → procesarPasoAgenteHumano_SoulChat: ', error);
        return await errorAPI(api, procesoApi, error, idChat, remitente);
    }
};

// todo: Solicitar Video Llamada Arbol
const solicitarVideoLlamada = async (idChat, remitente) => {
    const solicitarVideoLlamadaArbol = dataEstatica.arbol.solicitarVideoLlamada;
    chatData.descripcion = 'Se solicita videollamada.';
    await modelChat.actualizar(idChat, solicitarVideoLlamadaArbol, chatData);
    
    // Enviar mensaje con información de videollamada
    await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, dataEstatica.mensajes.solicitarVideoLlamada, chatData.descripcion);
    
    // Cerrar el chat después de enviar el mensaje
    chatData.descripcion = 'Chat cerrado por solicitud de videollamada.';
    await modelChat.cerrar(remitente, dataEstatica.configuracion.estadoChat.recibido, dataEstatica.configuracion.estadoGestion.cerrado, dataEstatica.arbol.despedida, dataEstatica.configuracion.controlApi.success, chatData.descripcion, dataEstatica.configuracion.estadoRegistro.activo, dataEstatica.configuracion.responsable);
    
    // Enviar mensaje de despedida
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.finChat, dataEstatica.mensajes.despedida, 'Chat finalizado por solicitud de videollamada.');
};

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
//     await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.multimedia, mensajeEnlaces, descripcion);

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
        const mensaje = await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.texto, alertaNoEntiendo, chatData.descripcion);
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
    const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
    const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
    const responsable = dataEstatica.configuracion.responsable;
    return await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
};

// todo: Función para manejar errores de API
const errorAPI = async (api, procesoApi, error, idChat, remitente) => {
    // Variables
    let estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
    let tipoMensaje = dataEstatica.configuracion.tipoMensaje.errorApi;
    let contenidoAlertaErrorAPI = dataEstatica.mensajes.alertaErrorAPI;
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
    const controlApi = dataEstatica.configuracion.controlApi.error;
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
        const estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
        const tipoMensaje = dataEstatica.configuracion.tipoMensaje.inactividad;

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
                    ⏳ Apreciado Usuario, lleva 3 minutos de inactividad.<br/><br/>
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
                    ⚠️ Apreciado Usuario, su sesión se cerrará en 1 minuto por inactividad.<br/><br/>
                    🚨 ¡Última advertencia! <br/><br/>
                    💬 Responda por favor ahora para mantener la conversación activa. <br/><br/>
                    👉 Si no responde, el chat se cerrará automáticamente. 😔</p>`;
        }

        const enlaces = '-';
        const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
        const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
        const responsable = dataEstatica.configuracion.responsable;

        await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
    }
};

// todo: Crear mensaje de cierre por inactividad
const crearMensajeCierreInactividad = async (idChatWeb) => {
    const chat = await modelChat.filtrar(idChatWeb);
    if (chat.length > 0) {
        const idChat = chat[0].ID_CHAT;
        const remitente = idChatWeb;
        const estadoMensaje = dataEstatica.configuracion.estadoMensaje.enviado;
        const tipoMensaje = dataEstatica.configuracion.tipoMensaje.finChat;
        const contenido = `<p class=\"mensajeCierreInactividadArbol\"><b>Chat cerrado por inactividad</b><br/><br/>
        🚫 Su sesión ha finalizado debido a un periodo prolongado de inactividad (5 minutos). <br/><br/>
        💬 ¡Estamos aquí para ayudarle! 😊<br/><br/>
        👉 <b>Por favor, cierre esta ventana y vuelva a abrir el chat para iniciar una nueva conversación.</b></p>`;
        const enlaces = '-';
        const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
        const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
        const responsable = dataEstatica.configuracion.responsable;
        const descripcion = 'Chat cerrado por inactividad.';

        await modelMensaje.crear(idChat, remitente, estadoMensaje, tipoMensaje, contenido, enlaces, lectura, descripcion, estadoRegistro, responsable);
    }
};

// todo: Chat cerrado
const chatCerrado = async (idChat, remitente) => {
    const enlaces = '-';
    const lectura = dataEstatica.configuracion.lecturaMensaje.noLeido;
    const estadoRegistro = dataEstatica.configuracion.estadoRegistro.activo;
    const responsable = dataEstatica.configuracion.responsable;
    const descripcion = 'Este chat está actualmente cerrado.'
    return await crearMensaje(idChat, remitente, dataEstatica.configuracion.estadoMensaje.enviado, dataEstatica.configuracion.tipoMensaje.finChat, dataEstatica.mensajes.chatDiferenteAbierto, descripcion, enlaces, lectura, estadoRegistro, responsable);
};

// ! EXPORTACIONES
module.exports = {
    arbolChatBot,
    crearAlertaInactividad,
    crearMensajeCierreInactividad,
    solicitarTipoDocumento,
    procesarTipoDocumento,
    solicitarNumeroDocumento,
    procesarNumeroDocumento,
    solicitarNombreCompleto,
    procesarNombreCompleto,
    solicitarSexo,
    procesarSexo,
    solicitarTelefono,
    procesarTelefono,
    solicitarCorreoElectronico,
    procesarCorreoElectronico,
    solicitarCiudadMunicipio,
    procesarCiudadMunicipio,
    confirmarDatosIngresados,
    procesarConfirmacionDatos,
    solicitarCorregirDatosIngresados,
    procesarCorregirDatosIngresados,
    solicitarCanalAtencion,
    procesarCanalAtencion,
    solicitarPasoAgenteHumano,
    procesarPasoAgenteHumano_SoulChat,
    solicitarVideoLlamada,
};