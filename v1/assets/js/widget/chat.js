// ! ================================================================================================================================================
// !                                                      CHAT WEB
// ! ================================================================================================================================================
// @author Ramón Dario Rozo Torres (24 de Enero de 2025)
// @lastModified Ramón Dario Rozo Torres (24 de Enero de 2025)
// @version 1.0.0
// v1/assets/js/widget/chat.js

// ! VARIABLES GLOBALES
let chatWeb = '';
let idChatWeb = '';
let inactividadInterval;
let reintentoInterval; // Declarar fuera para que sea accesible
var tempText = '';
let formularioEnviado = false;
let ultimaActividad = Date.now();
let tiempoInactividad = 0;
let umbralesNotificados = []; // <-- NUEVO: Para llevar registro de umbrales notificados
let debounceTimeout; // Para evitar múltiples llamadas seguidas

// ! EVENTOS DE ACTIVIDAD
// Eventos que se disparan frecuentemente (necesitan debounce)
const eventosFrecuentes = [
    'mousemove',
    'scroll',
    'touchmove',
    'pointermove'
];

// Eventos que se disparan ocasionalmente (no necesitan debounce)
const eventosOcasionales = [
    'mousedown',
    'keypress',
    'touchstart',
    'touchend',
    'pointerdown',
    'pointerup',
    'click',
    'input',
    'focus'
];

// ! INICIALIZAR MODAL TERMINOS Y CONDICIONES
$(function() {
    $('#modalTerminos').modal();
    $('#modalTerminos').modal('open');
    $('#modalTerminos').modal('close');
  })

// ! INICIALIZAR DROPIFY
$(document).ready(function(){
    const maxFiles = 5;
    const fileList = $('#file-list');
    let currentFiles = [];
    const txtMensaje = document.getElementById('txt_mensaje');

    const dropify = $('.dropify').dropify({
        messages: {
            default: 'Arrastre y suelte sus archivos y/o haz clic aquí',
            replace: 'Arrastre y suelte sus archivos o haz clic para reemplazar',
            remove:  'Eliminar',
            error:   'Lo siento, el archivo es demasiado grande'
        },
        error: {
            fileSize: 'El tamaño del archivo es demasiado grande ({{ value }} max).',
            fileExtension: 'Este tipo de archivo no está permitido.'
        }
    });

    const dropifyInstance = dropify.data('dropify');

    $('#input-file-now').on('change', function(event) {
        
        const files = Array.from(event.target.files);

        // Validar si no hay archivos adjuntos
        if (files.length === 0) {
            return;
        }

        const allowedExtensions = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'doc', 'docx'];
        const maxSizeMB = 5;

        const validFiles = files.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileSizeMB = file.size / 1024 / 1024;

            const dropifyMessageElement = $('.dropify-wrapper .dropify-message p').first();

            if (!allowedExtensions.includes(fileExtension)) {
                const errorMessage = `Extensión no permitida - `;
                dropifyMessageElement.text(errorMessage + 'Arrastre y suelte sus archivos y/o haz clic aquí');
                dropifyInstance.showError('fileExtension');
                dropifyInstance.clearElement();
                return false;
            }

            if (fileSizeMB > maxSizeMB) {
                const errorMessage = `El archivo ${file.name} supera el tamaño máximo permitido de ${maxSizeMB} MB. `;
                dropifyMessageElement.text(errorMessage + 'Arrastre y suelte sus archivos y/o haz clic aquí');
                dropifyInstance.showError('fileSize');
                dropifyInstance.clearElement();
                return false;
            }

            return true;
        });

        if (currentFiles.length + validFiles.length > maxFiles) {
            const errorMessage = 'Solo se permite adjuntar un máximo de 5 archivos. ';
            const dropifyMessageElement = $('.dropify-wrapper .dropify-message p').first();
            dropifyMessageElement.text(errorMessage + 'Arrastre y suelte sus archivos y/o haz clic aquí');
            dropifyInstance.showError('fileSize');
            dropifyInstance.clearElement();
            return;
        }

        validFiles.forEach(file => {
            currentFiles.push(file);
            const fileItem = $('<div>').addClass('file-item');
            const fileName = $('<span>').addClass('file-name').text(file.name);
            const fileSize = $('<span>').addClass('file-size').text((file.size / 1024 / 1024).toFixed(2) + ' MB');
            const removeButton = $('<button>').text('X').addClass('remove-file').on('click', function() {
                fileItem.remove();
                currentFiles = currentFiles.filter(f => f !== file);
                if (currentFiles.length < maxFiles) {
                    $('#input-file-now').parent().show();
                }
                if (currentFiles.length === 0) {
                    txtMensaje.value = '';
                }
            });
            fileItem.append(fileName, fileSize, removeButton);
            fileList.append(fileItem);
        });

        // Limpiar el contenedor después de agregar archivos
        dropifyInstance.clearElement();

        if (currentFiles.length >= maxFiles) {
            $('#input-file-now').parent().hide();
        }

        // Restablecer el valor del input para limpiar la selección
        $('#input-file-now').val('');
    });

    // * Evento para el botón "Adjuntar"
    $('#btnAdjuntar').on('click', function () {
        // Validar si no hay archivos adjuntos
        if (currentFiles.length === 0) {
            return; // Salir de la función
        }
    
        // Código existente para adjuntar archivos
        const allowedExtensions = ['pdf', 'xls', 'xlsx', 'jpg', 'png', 'doc', 'docx'];
        const invalidFiles = currentFiles.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return !allowedExtensions.includes(fileExtension);
        });
    
        if (invalidFiles.length > 0) {
            alert('Algunos archivos tienen extensiones no permitidas.');
            return;
        }
    
        const formData = new FormData();
        currentFiles.forEach(file => {
            formData.append('archivos', file);
        });
    
        formData.append('idChatWeb', idChatWeb);
        formData.append('mensaje', 'Adjunto archivos a la conversación.');
    
        const enviarArchivos = () => {
            fetch('/widget/mensaje/adjuntarArchivos', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(async (data) => {
                    if (data.status === 200) {
                        $('#contentAdjuntos').addClass('hide');
                        $('#contentFormTexto').removeClass('hide');
                        txtMensaje.value = '';
                        txtMensaje.style.height = 'auto';
                        if (window.M && M.textareaAutoResize) {
                            M.textareaAutoResize(txtMensaje);
                        }
                        listarMensajeNoLeido();
                        await desplazarScrollVentana();
                        await desplazarScrollConversacion();
                        txtMensaje.focus();
                    } else {
                        console.log('❌ Error en v1/assets/js/widget/chat.js → btnAdjuntar.enviarArchivos ', data.message);
                    }
                })
                .catch(error => {
                    console.log('❌ Error en v1/assets/js/widget/chat.js → btnAdjuntar.enviarArchivos ', error);
                });
        };
    
        enviarArchivos();
    });
});

// ! LEER DOCUMENTO
document.addEventListener('DOMContentLoaded', async (event) => {
    
    await obtenerInfoWidgetChatWeb();

    // Contenedor de formulario de texto
    const contentFormTexto = document.getElementById('contentFormTexto');
    // Contenedor de formulario de adjuntos
    const contentAdjuntos = document.getElementById('contentAdjuntos');    
    // Campo de mensaje
    const txtMensaje = document.getElementById('txt_mensaje');
    // Botón de enviar
    const btnEnviar = document.getElementById('btnEnviar'); 
    // Ocultar contenedor de adjuntos
    contentAdjuntos.classList.add('hide');;

    // * SI EL CHAT ES NUEVO
    if (chatWeb === 'Crear') {
        // todo: Listar mensajes
        listarMensajeNoLeido();

        // todo: Dar el foco al campo de mensaje
        txtMensaje.focus();

        // todo: Enviar mensajes
        btnEnviar.addEventListener('click', async () => {
            // Validar si el mensaje está vacío
            const mensaje = txtMensaje.value.trim();
            if (mensaje === '') {
                txtMensaje.focus();
                return;
            }
        
            // Deshabilitar el campo de mensaje
            txtMensaje.readOnly = true;
            contentFormTexto.classList.add('hide');
        
            // Función para enviar el mensaje
            const enviarMensajeConReintento = async () => {
                const resultEnviarMensaje = await enviarMensaje();

                if (resultEnviarMensaje.status === 200) {
                    clearInterval(reintentoInterval); // Detener el intervalo si el envío es exitoso
                    
                    await listarMensajeNoLeido();
                    await desplazarScrollVentana();
                    await desplazarScrollConversacion();
                    txtMensaje.value = '';
                    txtMensaje.style.height = 'auto';
                    if (window.M && M.textareaAutoResize) {
                        M.textareaAutoResize(txtMensaje);
                    }
                    txtMensaje.focus();
                    txtMensaje.readOnly = false;
                } else if (resultEnviarMensaje.status === 409) {
                    clearInterval(reintentoInterval); // Detener el intervalo si el envío es exitoso
                    await listarMensajeNoLeido();
                    await desplazarScrollVentana();
                    await desplazarScrollConversacion();
                    txtMensaje.value = '';
                    txtMensaje.style.height = 'auto';
                    if (window.M && M.textareaAutoResize) {
                        M.textareaAutoResize(txtMensaje);
                    }
                    txtMensaje.focus();
                    txtMensaje.readOnly = false;
                    
                    // Hacer esto cada 3 segundos por maximo lo equivalente a 1 minutos
                    let contador = 0;
                    const maximo = 20; // 1 minuto (20 intervalos de 3 segundos)
                    const intervaloListar = setInterval(async () => {
                        contador++;
                        
                        if (contador >= maximo) {
                            clearInterval(intervaloListar);
                            return;
                        }

                        await listarMensajeNoLeido();
                        await desplazarScrollVentana();
                    }, 3000);
                } else {
                    await listarMensajeNoLeido();
                    await desplazarScrollVentana();
                    await desplazarScrollConversacion();
                    console.log('❌ Error en v1/assets/js/widget/chat.js → btnEnviar.enviarMensaje ', resultEnviarMensaje);
                }
            };

            // Iniciar el envío del mensaje con reintento cada 30 segundos
            reintentoInterval = setInterval(enviarMensajeConReintento, 30000);
            enviarMensajeConReintento(); // Intentar enviar el mensaje inmediatamente
        });
        
    }

    if (chatWeb === 'Minimizar') {
        // todo: Minimizar el chat
        listarConversacion(); // Listar la conversación completa al abrir el chat
    }
});

// ! ENVIAR FORMULARIO INICIAL
const observadorFormulario = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            // ! INICIALIZAR SELECT2
            $('#txt_paisResidencia').select2({
                allowClear: true,
                language: 'es',
                placeholder: 'Seleccione un país',
                width: '100%'
            }).on("select2:open", function() {
                $('#txt_paisResidencia').siblings('.select2-label').removeClass('active-ok').addClass('active');
            }).on("select2:select", function(e) {
                valida_txt_paisResidencia();
                if ($('#txt_paisResidencia').val()) {
                    $('#txt_paisResidencia').siblings('.select2-label').removeClass('active').addClass('active-ok');
                } else {
                    $('#txt_paisResidencia').siblings('.select2-label').removeClass('active');
                }

                 // Obtener el elemento seleccionado
                 const selectedOption = e.params.data.element;
                 const indicativo = selectedOption.getAttribute('data-indicativo') || '';
                 // Actualizar el campo de indicativo
                 $('#txt_indicativoPais').val(indicativo);
 
                 // Reposicionar el label si es necesario (Materialize)
                 const labelIndicativoPais = document.querySelector('label[for="txt_indicativoPais"]');
                 if (indicativo && labelIndicativoPais) {
                     labelIndicativoPais.classList.add('active');
                 }
                 // Validar el campo indicativo si tienes función
                 if (typeof valida_txt_indicativoPais === 'function') {
                     valida_txt_indicativoPais();
                 }

            }).on("select2:close", function() {
                valida_txt_paisResidencia();
                if ($('#txt_paisResidencia').val()) {
                    $('#txt_paisResidencia').siblings('.select2-label').removeClass('active').addClass('active-ok');
                } else {
                    $('#txt_paisResidencia').siblings('.select2-label').removeClass('active');
                }
            });

            const btn_Continuar = document.getElementById('btn_Continuar');
            if (btn_Continuar && !btn_Continuar.hasListener) {
                // Desconectar el observador una vez que encontramos el botón
                observadorFormulario.disconnect();
                
                // Marcar que ya tiene un listener
                btn_Continuar.hasListener = true;
                
                // Agregar el evento click al botón
                btn_Continuar.addEventListener('click', async () => {
                    try {
                        // Validar todos los campos
                        const validaciones = await Promise.all([
                            valida_txt_nombres(),
                            valida_txt_apellidos(),
                            valida_txt_numeroCedula(),
                            valida_txt_paisResidencia(),
                            valida_txt_ciudadResidencia(),
                            valida_txt_indicativoPais(),
                            valida_txt_numeroCelular(),
                            valida_txt_correoElectronico(),
                            valida_txt_autorizacionDatosPersonales()
                        ]);

                        // Si alguna validación falló, detener el envío
                        if (validaciones.includes(false)) {
                            return;
                        }

                        // Deshabilitar el botón mientras se envían los mensajes
                        btn_Continuar.disabled = true;

                        // Crear un objeto con los valores a enviar
                        const camposFormulario = {
                            nombres: document.getElementById('txt_nombres').value.trim(),
                            apellidos: document.getElementById('txt_apellidos').value.trim(),
                            numeroCedula: document.getElementById('txt_numeroCedula').value.trim(),
                            paisResidencia: document.getElementById('txt_paisResidencia').value.trim(),
                            ciudadResidencia: document.getElementById('txt_ciudadResidencia').value.trim(),
                            indicativoPais: document.getElementById('txt_indicativoPais').value.trim(),
                            numeroCelular: document.getElementById('txt_numeroCelular').value.trim(),
                            correoElectronico: document.getElementById('txt_correoElectronico').value.trim(),
                            autorizacionDatosPersonales: document.getElementById('autorizacionDatosPersonales').checked ? 'Si' : 'No'
                        };

                        let enviado = false; // Bandera para saber si ya se envió correctamente

                        // Función para intentar enviar el formulario
                        const enviarFormulario = async () => {
                            if (enviado) return; // Si ya se envió, no hacer nada

                            try {
                                const response = await fetch("/widget/chat/formularioInicial", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ idChatWeb, camposFormulario })
                                });

                                const resultFormulario = await response.json();
                                if (resultFormulario.status === 200) {
                                    enviado = true; // Marcar como enviado
                                    clearInterval(reintentoInterval); // <-- ¡DETENER EL INTERVALO AQUÍ!

                                    // Ocultar el formulario
                                    document.getElementById('content_form').classList.add('hide');

                                    // Llamar a la función para listar mensajes no leídos
                                    await listarMensajeNoLeido();

                                    // Hacer scroll al final del chat
                                    await desplazarScrollConversacion();

                                    // Habilitar el formulario de texto
                                    const contentFormTexto = document.getElementById('contentFormTexto');
                                    contentFormTexto.classList.remove('hide');

                                    // Habilitar el campo de mensaje
                                    const txtMensaje = document.getElementById('txt_mensaje');
                                    txtMensaje.value = '';
                                    txtMensaje.style.height = 'auto';
                                    if (window.M && M.textareaAutoResize) {
                                        M.textareaAutoResize(txtMensaje);
                                    }
                                    txtMensaje.focus();
                                    txtMensaje.readOnly = false;
                                } else {
                                    // Actualizar bandera
                                    enviado = false;

                                    // Habilitar el botón
                                    btn_Continuar.disabled = false;

                                    await listarMensajeNoLeido();
                                    await desplazarScrollVentana();
                                    await desplazarScrollConversacion();
                                    console.log('❌ Error en v1/assets/js/widget/chat.js → btn_Continuar.enviarFormulario ', resultFormulario);
                                }
                            } catch (error) {
                                // Puedes mostrar un mensaje de error si quieres, pero el reintento seguirá
                                console.warn('❌ Error al enviar el formulario, reintentando en 30 segundos...');
                            }
                        };

                        // Enviar el formulario la primera vez inmediatamente
                        await enviarFormulario();

                        // Iniciar el reintento cada 30 segundos si no se ha enviado con éxito
                        reintentoInterval = setInterval(enviarFormulario, 30000);
                    } catch (error) {
                        console.log('❌ Error en v1/assets/js/widget/chat.js → btn_Continuar.enviarFormulario ', error);
                    }
                });
            }
        }
    });
});

// Iniciar la observación del DOM solo si no está ya observando
if (!observadorFormulario._isObserving) {
    document.addEventListener('DOMContentLoaded', () => {
        observadorFormulario.observe(document.body, {
            childList: true,
            subtree: true
        });
        observadorFormulario._isObserving = true;
    });
}

// ! FUNCIONES AUXILIARES
// * OBTENER INFORMACIÓN DEL WIDGET CHAT WEB
async function obtenerInfoWidgetChatWeb() {
    return new Promise((resolve) => {
        window.addEventListener("message", async (event) => {
            chatWeb = event.data.chatWeb; // Asegúrate de que chatWeb esté definido
            idChatWeb = event.data.idWidgetChatWeb; // Asegúrate de que idWidgetChatWeb esté definido
            resolve(); // Resuelve la promesa cuando se recibe el mensaje
        });
    });
}

// * ENVIAR MENSAJE
async function enviarMensaje() {
    // todo: Obtener el mensaje
    // Obtener el mensaje
    let mensaje = document.getElementById('txt_mensaje').value.replace(/\n/g, '<br/>');

    // Eliminar el último salto de línea si existe
    mensaje = mensaje.replace(/<br\/>$/, '');
    
    // todo: Enviar el mensaje
    try {
        const response = await fetch('/widget/mensaje/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idChatWeb, mensaje }),
        });
        return await response.json();
    } catch (error) {
        console.log('❌ Error en v1/assets/js/widget/chat.js → enviarMensaje ', error);
    }
}

// * LISTAR MENSAJES NO LEÍDOS
async function listarMensajeNoLeido() {
    try {
        const response = await fetch('/widget/mensaje/listarNoLeido?idChatWeb=' + idChatWeb, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();
        // Contenedor de la conversación
        const conversacionDiv = document.getElementById('conversacion');

        // Mapeo de mensajes
        const mensajes = result.data;
        
        mensajes.forEach(async (mensaje) => {
            const contentFormTexto = document.getElementById('contentFormTexto');
            const txtMensaje = document.getElementById('txt_mensaje');
            // Mostrar el formulario de texto por defecto
            contentFormTexto.classList.remove('hide');

            // Si el mensaje es de tipo Formulario
            if (mensaje.TIPO === 'Formulario') {
                contentFormTexto.classList.add('hide');
            }
            // Si el mensaje es de tipo Multimedia
            if (mensaje.TIPO === 'Adjuntos') {
                contentAdjuntos.classList.remove('hide');
            } else {
                contentAdjuntos.classList.add('hide');
            }
            // Si el mensaje es de tipo Error API
            if (mensaje.TIPO === 'Error API') {
                txtMensaje.readOnly = true;
                contentFormTexto.classList.add('hide');
            }
            // Si el mensaje es de tipo Fin Chat
            if (mensaje.TIPO === 'Fin Chat') {
                txtMensaje.readOnly = true;
                contentFormTexto.classList.add('hide');
                // ¡NO ocultar ni modificar los controles del widget!
            }
            // Mostrar el mensaje
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = mensaje.ESTADO === 'Enviado' ? 'mensaje-enviado' : 'mensaje-recibido';
            mensajeDiv.innerHTML = `<div class="texto">${mensaje.CONTENIDO}</div>`;
            conversacionDiv.appendChild(mensajeDiv);
            // Actualizar la lectura del mensaje segun el ID_MENSAJE
            const idMensaje = mensaje.ID_MENSAJE;
            try {
                await fetch('/widget/mensaje/leer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idMensaje }),
                });
            } catch (error) {
                console.log('❌ Error en v1/assets/js/widget/chat.js → listarMensajeNoLeido.leerMensaje ', error);
            }
        });
    } catch (error) {
        console.log('❌ Error en v1/assets/js/widget/chat.js → listarMensajeNoLeido ', error);
    }
}

// * FUNCIÓN PARA DESPLAZAR EL SCROLL DE LA VENTANA
async function desplazarScrollVentana() {
    // Esperar un breve momento para asegurarse de que el DOM se haya actualizado
    await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100 ms
    // Desplazar el body hacia abajo
    window.scrollTo(0, document.body.scrollHeight);
}

// * FUNCIÓN PARA DESPLAZAR EL SCROLL DE LA CONVERSACIÓN
async function desplazarScrollConversacion() {
    // Esperar un breve momento para asegurarse de que el DOM se haya actualizado
    await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100 ms
    // Desplazar el scroll de la conversación
    const conversacionDiv = document.getElementById('conversacion');
    conversacionDiv.scrollTop = conversacionDiv.scrollHeight;
}

// * FUNCION PARA LISTAR LA CONVERSACION COMPLETA
async function listarConversacion() {
    try {
        const response = await fetch('/widget/mensaje/listarConversacion?idChatWeb=' + idChatWeb, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();

        if (result.status === 200) {
            const mensajes = result.data;
            const conversacionDiv = document.getElementById('conversacion');
            conversacionDiv.innerHTML = ''; // Limpiar el contenedor

            mensajes.forEach(mensaje => {
                const mensajeDiv = document.createElement('div');
                mensajeDiv.className = mensaje.ESTADO === 'Enviado' ? 'mensaje-enviado' : 'mensaje-recibido';
                mensajeDiv.innerHTML = `<div class="texto">${mensaje.CONTENIDO}</div>`;
                conversacionDiv.appendChild(mensajeDiv);
            });
        }
    } catch (error) {
        console.log('❌ Error en v1/assets/js/widget/chat.js → listarConversacion ', error);
    }
}

// ! FUNCIÓN PARA VERIFICAR SI EL MENSAJE DE OPCIONES SERVICIOS HA SIDO MOSTRADO
function verificarOpcionesServiciosMostradas() {
    // Busca si existe algún mensaje que contenga "¿Cómo podemos ayudarle hoy?"
    const mensajes = document.querySelectorAll('.mensaje-enviado .texto');
    for (const mensaje of mensajes) {
        const contenido = mensaje.textContent || mensaje.innerText;
        if (contenido && contenido.includes('¿Cómo podemos ayudarle hoy?')) {
            return true;
        }
    }
    return false;
}

// ! FUNCIÓN PARA ACTUALIZAR ÚLTIMA ACTIVIDAD (SOLO ACTIVIDAD REAL DEL USUARIO)
function actualizarUltimaActividad() {
    if (verificarOpcionesServiciosMostradas()) {
        // Implementar debounce para evitar múltiples llamadas seguidas
        clearTimeout(debounceTimeout);
        
        debounceTimeout = setTimeout(() => {
            // SIEMPRE resetear cuando hay actividad real del usuario
            // La actividad del usuario es lo que importa, no el contenido de los mensajes
            ultimaActividad = Date.now();
            tiempoInactividad = 0;
            umbralesNotificados = []; // Limpiar array de umbrales notificados
        }, 100); // Esperar 100ms antes de procesar la actividad
    }
}

// ! AGREGAR EVENTOS DE ACTIVIDAD REAL DEL USUARIO
// Eventos frecuentes (con debounce)
eventosFrecuentes.forEach(evento => {
    document.addEventListener(evento, actualizarUltimaActividad);
});

// Eventos ocasionales (sin debounce - respuesta inmediata)
eventosOcasionales.forEach(evento => {
    document.addEventListener(evento, () => {
        if (verificarOpcionesServiciosMostradas()) {
            // Respuesta inmediata para eventos importantes
            ultimaActividad = Date.now();
            tiempoInactividad = 0;
            umbralesNotificados = [];
        }
    });
});

// * FUNCION PARA VIGILAR LA INACTIVIDAD DEL CHAT
async function vigilarInactividad() {
    if (!verificarOpcionesServiciosMostradas()) return;

    const tiempoActual = Date.now();
    tiempoInactividad = Math.floor((tiempoActual - ultimaActividad) / 1000);
    const tiempoInactividadMinutos = Math.floor(tiempoInactividad / 60);

    // --- Notificar solo una vez por umbral ---
    const umbrales = [2, 3, 4, 5];
    if (umbrales.includes(tiempoInactividadMinutos) && !umbralesNotificados.includes(tiempoInactividadMinutos)) {
        umbralesNotificados.push(tiempoInactividadMinutos);
    }
    // --- FIN ---

    const response = await fetch('/widget/mensaje/vigilaInactividadChat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            idChatWeb,
            tiempoInactividad: tiempoInactividadMinutos,
        }),
    });
    const result = await response.json();

    if (result.status === 200) {
        await listarMensajeNoLeido();
        await desplazarScrollVentana();
        await desplazarScrollConversacion();
    }
}

function iniciarVigilanciaInactividad() {
    if (inactividadInterval) clearInterval(inactividadInterval);
    // Solo iniciar la vigilancia si el formulario ha sido enviado
    if (verificarOpcionesServiciosMostradas()) {
        inactividadInterval = setInterval(vigilarInactividad, 10000); // Vigilar cada 10 segundos
    }
}

function detenerVigilanciaInactividad() {
    if (inactividadInterval) clearInterval(inactividadInterval);
}

// Llamar a iniciarVigilanciaInactividad cuando se inicie el chat
document.addEventListener('DOMContentLoaded', () => {
    // Verificar el estado del formulario cada 5 segundos hasta que sea enviado
    const verificarFormularioInterval = setInterval(() => {
        if (verificarOpcionesServiciosMostradas()) {
            clearInterval(verificarFormularioInterval);
            iniciarVigilanciaInactividad();
        }
    }, 5000);
});

// Detener la vigilancia cuando el cliente envíe un mensaje
document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', async () => {
            detenerVigilanciaInactividad();
            actualizarUltimaActividad(); // Actualizar la última actividad (resetear inactividad)
            iniciarVigilanciaInactividad(); // Reiniciar vigilancia después de enviar el mensaje
        });
    }
});

async function listarConversacionCompleta() {
    try {
        // 1. Mostrar toda la conversación
        const response = await fetch('/widget/mensaje/listarConversacion?idChatWeb=' + idChatWeb, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();

        const conversacionDiv = document.getElementById('conversacion');
        conversacionDiv.innerHTML = '';

        const mensajes = result.data;
        mensajes.forEach((mensaje) => {
            const mensajeDiv = document.createElement('div');
            mensajeDiv.className = mensaje.ESTADO === 'Enviado' ? 'mensaje-enviado' : 'mensaje-recibido';
            mensajeDiv.innerHTML = `<div class="texto">${mensaje.CONTENIDO}</div>`;
            conversacionDiv.appendChild(mensajeDiv);
        });

        // 2. Después de mostrar, buscar los mensajes no leídos y marcarlos como leídos
        marcarMensajesNoLeidosComoLeidos();
    } catch (error) {
        console.log('❌ Error en listarConversacionCompleta', error);
    }
}

async function marcarMensajesNoLeidosComoLeidos() {
    try {
        const response = await fetch('/widget/mensaje/listarNoLeido?idChatWeb=' + idChatWeb, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();
        const mensajesNoLeidos = result.data;
        for (const mensaje of mensajesNoLeidos) {
            await fetch('/widget/mensaje/leer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idMensaje: mensaje.ID_MENSAJE }),
            });
        }
    } catch (error) {
        console.log('❌ Error en marcarMensajesNoLeidosComoLeidos', error);
    }
}

function ajustarAltoChat() {
  var main = document.getElementById('main');
  if (main) {
    main.style.height = window.innerHeight + 'px';
  }
}
window.addEventListener('resize', ajustarAltoChat);
window.addEventListener('orientationchange', ajustarAltoChat);
document.addEventListener('DOMContentLoaded', ajustarAltoChat);

// Al final de la sección de eventos de actividad globales, agregar:
document.addEventListener('DOMContentLoaded', () => {
    // Agregar evento de scroll al contenedor de la conversación (para móviles y contenedores con overflow)
    const conversacionDiv = document.getElementById('conversacion');
    if (conversacionDiv) {
        conversacionDiv.addEventListener('scroll', () => {
            // Solo actualizar la última actividad sin resetear el tiempo de inactividad
            // Esto se usa para eventos que NO indican actividad real del usuario
            // como scroll automático, mensajes del servidor, etc.
            // No hacer nada - mantener el timestamp original
        });
    }
    
    // Agregar evento para cuando se reciba un mensaje del servidor
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Verificar si se agregó un nuevo mensaje
                const nuevoMensaje = mutation.addedNodes[0];
                if (nuevoMensaje.nodeType === Node.ELEMENT_NODE && 
                    (nuevoMensaje.classList.contains('mensaje-recibido') || 
                     nuevoMensaje.classList.contains('mensaje-enviado'))) {
                    // Si es un mensaje recibido del servidor, actualizar la actividad sin resetear inactividad
                    if (nuevoMensaje.classList.contains('mensaje-recibido')) {
                        // No hacer nada - mantener el timestamp original
                    }
                }
            }
        });
    });
    
    if (conversacionDiv) {
        observer.observe(conversacionDiv, { childList: true, subtree: true });
    }
});
