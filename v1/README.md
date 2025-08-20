# WidgetChatWebMintic

**Autor:** Ramón Dario Rozo Torres 19 de Agosto de 2025
**Última Modificación:** Ramón Dario Rozo Torres 19 de Agosto de 2025
**Versión:** 1.0.0

## Descripción

Widget chat web para la empresa MinTic.

## 📦 Información Técnica

| Tecnología             | Versión         | Descripción                                        |
|------------------------|-----------------|----------------------------------------------------|
| **Node.js**            | 22.3.0          | Entorno de ejecución para JavaScript               |
| **Express**            | ^4.19.2         | Framework web para Node.js                         |
| **express-handlebars** | ^8.0.1          | Motor de plantillas para vistas                    |
| **mysql2**             | ^3.11.0         | Cliente MySQL para Node.js (con soporte promesas)  |
| **dotenv**             | ^16.4.5         | Manejo de variables de entorno                     |
| **morgan**             | ^1.10.0         | Logger de peticiones HTTP                          |
| **moment**             | ^2.30.1         | Manejo de fechas y horas                           |
| **axios**              | ^1.7.9          | Cliente HTTP para Node.js                          |
| **express-fileupload** | ^1.5.1          | Middleware para subir archivos                     |
| **jsonwebtoken**       | ^9.0.2          | Autenticación y manejo de JWT                      |
| **multer**             | ^1.4.5-lts.1    | Middleware para manejo de archivos                 |
| **cors**               | ^2.8.5          | Middleware para habilitar CORS                     |
| **express-validator**  | ^7.1.0          | Validación de datos en Express                     |
| **Materialize**        | (CDN)           | Framework CSS para UI                              |
| **Docker**             | 24+             | Contenerización de la aplicación                   |
| **docker-compose**     | 1.29+           | Orquestación de contenedores                       |




## 🐳 Modo Docker (App + MySQL Local)

Permite ejecutar la aplicación en un contenedor Docker, conectándose a tu base de datos MySQL local. Ideal para desarrollo y pruebas sin duplicar servidores de base de datos.

### Requisitos
- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)
- MySQL local corriendo en tu máquina (fuera de Docker)

### Configuración
1. **Variables de entorno**: El archivo `.env` contiene toda la configuración necesaria para la app y la conexión a tu MySQL local.
2. **Asegúrate de que tu MySQL local esté corriendo y accesible.**
3. **DB_HOST debe ser `host.docker.internal`** en tu `.env` para que el contenedor acceda a tu MySQL local.

### Comandos principales

#### Scripts npm
```bash
# Ver contenedores
npm run docker:view

# Levantar la app en Docker (usando tu MySQL local)
npm run docker:up

# Ver logs de la app
npm run docker:logs

# Detener la app en Docker
npm run docker:down

```

#### Comandos Docker directos
```bash
# Ver contenedores
docker compose ps

# Construir y levantar la app
docker compose up --build

# Ver logs
docker compose logs -f

# Detener la app
docker compose down

# Eliminar contenedores y volúmenes que no se estén usando
docker compose down -v --remove-orphans

```

### Características
- ✅ **Hot reload** en desarrollo con nodemon
- ✅ **Conexión directa a tu MySQL local** (no se levanta otro contenedor de base de datos)
- ✅ **Variables dinámicas** desde archivo `.env`
- ✅ **Simplicidad y compatibilidad** para múltiples proyectos













## Modo Manual (Servidor tradicional):

## Instalación

```bash
    1.  Clonar repositorio (https://dev.azure.com/MontecheloPipelines/_git/MinTIC).

    2.  Entrar a la carpeta raiz del proyecto.

    3.  Instalar dependencias del proyecto de la siguiente manera:
        
        •   cd v1/
                npm i o  npm install

    4.  Configurar variables de entorno:
        •   Monolito
            *   Copiar el archivo .env.example y dejarlo como .env (cp .env.example .env).
                -   Digitar los datos solicitados en la estructura del archivo
                -   Guardar el archivo .env
                -   Ejecutar el comando npm run env para encriptar el archivo .env (* Agregar Sus Nombres y Apellidos para poderlo ejecutar).

                Nota: El archivo .env debe estar en la carpeta v1

        •   Widget
            *   Ubicarse en la ruta cd v1/widget/chatWeb.js
                -   En el archivo chatWeb.js configurar la variable global para alcance externo.

                Nota: Esto se debe hacer para que el widget tenga alcance externo y se pueda aplicar en el ambiente de pruebas y producción que se desea. Tener presente tambien los valores estaticos de los subgrupos o skill tanto para ambiente QA como para ambiente PROD.

    5.  Levantar base de datos ejecutando el codigo que se encuentran en la carpeta migrations.
        •   Ubicarse en la ruta cd v1/migrations
            *    Defina en el archivo 2025_01_24_create_database.sql la base de datos sobre la que se va a trabajar.

        •   Ejectuar los siguientes archivos en el siguiente orden:
            *   Primero ejecute el codigo del archivo en que se crea la tabla tbl_chat.
            *   Segundo ejecute el codigo del archivo en que se crea la tabla tbl_historico_chat.
            *   Tercero ejecute el codigo del archivo en que se crean los triggers para la tabla tbl_chat.

            Nota: Para la tabla mensaje se debe ejecutar en el mismo orden o si hubieran mas tablas se debe ejecutar en el mismo orden.

    6.  Cargar la data inicial de la base de datos que se encuentra en la carpeta seeds.
        •   Ubicarse en la ruta cd v1/seeds
            *  Por ahora no hay data que se deba tener en cuenta para inicializar el proyecto.

    *   Nota: La carpeta (cd v1/uploads) debe tener permisos totales ya que en esta se crean carpetas nuevas para guardar los archivos adjuntos desde el chat.

```

## Uso

```bash
1.  Iniciar servicios y aplicaciones ambiente de desarrollo.

    •   cd v1/
        npm run dev


2.  Iniciar servicios y aplicaciones ambiente de producción.

    •   cd v1/
        npm run prod

3.  Consumir endpoint para listar archivos adjuntos.

    •   Tipo: GET
    •   Endpoint: APP_URL/widget/chatWeb/listarArchivosAdjuntos
    •   Params:
        *   idChat: Número id del chat.

    •   Ejemplo:
        *   APP_URL/widget/chatWeb/listarArchivosAdjuntos?idChat=1

4.  Instrucciones de implementación interna:
    *   Nota: Para iniciar el widget debes primero levantar el servicio y luego abrir el archivo chat_web_corporativo_etb_prod.html en un navegador garantizando que se vinculen los archivos css y js e imagen corporativa.

5.  Instrucciones de implementación externa:
    •   Agregar la referencia a google icon font en la sección <head> del sitio web:
        *   Copie y pegue el siguiente código dentro de la sección <head> de su página para incluir los estilos necesarios del widget:

        <!--Import Google Icon Font-->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">  

    •   Agregar el contenedor del widget en el <body> del sitio web:
        *   Incluya el siguiente contenedor HTML en la sección <body> de la página, en el lugar donde desea que se muestre el widget:

        <!-- Contenedor Widget -->
        <div id="contenedorWidget"></div> 

    •   Añadir el script JavaScript para la funcionalidad del widget:
        *   Incluya el siguiente script al final de la sección <body> del sitio web, antes del cierre de la etiqueta </body>. Esto asegurará que el script necesario para el widget se cargue y funcione correctamente; configurar la constante URL_BASE con la URL base de la aplicación (APP_URL):

        <!-- Import js y css -->
        <script>
            // Definición de constantes para las URLs
            const URL_BASE = 'APP_URL';
            const URL_CSS = `${URL_BASE}/chatWeb.css`;
            const URL_JS = `${URL_BASE}/chatWeb.js`;

            // Función para cargar con timeout
            function cargarConTimeout(cargarFn, src, timeout = 1500) {
            return new Promise((resolve, reject) => {
                let el;
                const timer = setTimeout(() => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
                reject(new Error('Timeout al cargar: ' + src));
                }, timeout);

                cargarFn(src)
                .then(() => {
                    clearTimeout(timer);
                    resolve();
                })
                .catch((err) => {
                    clearTimeout(timer);
                    reject(err);
                });

                // Guardar el elemento para poder removerlo si hay timeout
                if (cargarFn === cargarCSS) {
                el = document.querySelector(`link[href='${src}']`);
                }
                if (cargarFn === cargarJS) {
                el = document.querySelector(`script[src='${src}']`);
                }
            });
            }

            // Funcion para cargar el css
            function cargarCSS(src) {
            return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = src;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
                // Devuelve el elemento para poder removerlo si hay timeout
                resolve.el = link;
            });
            }

            // Funcion para cargar el js
            function cargarJS(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            }

            // Carga con timeout de 3 segundos
            cargarConTimeout(cargarCSS, URL_CSS, 1500)
            .then(() => cargarConTimeout(cargarJS, URL_JS, 1500))
            .then(() => {
                if (window.WidgetChat && typeof window.WidgetChat.init === 'function' && document.getElementById('contenedorWidget')) {
                window.WidgetChat.init();
                console.log('✅ Widget cargado exitosamente');
                } else {
                console.error('❌ El widget o el contenedor no están disponibles.');
                }
            })
            .catch((error) => {
                console.error('❌ Error al cargar recursos del widget, por favor contactenos:', error);
                
                // Configuración de reintentos
                const intervaloReintento = 15000; // 15 segundos
                const tiempoMaximo = 300000; // 5 minutos
                const tiempoInicio = Date.now();
                
                // Funcion para intentar cargar nuevamente los recursos
                function intentarCarga() {
                const tiempoTranscurrido = Date.now() - tiempoInicio;
                
                if (tiempoTranscurrido >= tiempoMaximo) {
                    console.error('❌ Tiempo máximo de reintentos alcanzado');
                    return;
                }
                
                console.log('🔄 Reintentando cargar el widget...');
                
                cargarConTimeout(cargarCSS, URL_CSS, 1500)
                    .then(() => cargarConTimeout(cargarJS, URL_JS, 1500))
                    .then(() => {
                    if (window.WidgetChat && typeof window.WidgetChat.init === 'function' && document.getElementById('contenedorWidget')) {
                        window.WidgetChat.init();
                        console.log('✅ Widget cargado exitosamente');
                    } else {
                        throw new Error('El widget o el contenedor no están disponibles');
                    }
                    })
                    .catch((error) => {
                    console.error('❌ Error en reintento:', error);
                    setTimeout(intentarCarga, intervaloReintento);
                    });
                }
                
                // Iniciar el primer reintento
                setTimeout(intentarCarga, intervaloReintento);
            });
        </script>

    Ejemplo:

        <!DOCTYPE html>
            <html lang='en'>

            <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Widget Mintic Dev</title>
            <!--Import Google Icon Font-->
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

            <style>
                html,
                body {
                height: 100%;
                /* Asegura que html y body ocupen el 100% de la altura */
                margin: 0;
                /* Elimina márgenes por defecto */
                }

                body {
                background-image: url('http://localhost:5002/images/imagen-corporativa/fondo.png');
                /* Llama a la imagen de fondo */
                background-repeat: no-repeat;
                /* No repetir la imagen */
                background-size: cover;
                /* Ajustar la imagen para cubrir todo el fondo */
                background-position: center;
                /* Centrar la imagen */
                background-attachment: fixed;
                /* Hacer que la imagen de fondo quede fija al hacer scroll */
                }
            </style>
            </head>

            <body>

            <div class="titlePagina" style="background: #0b06ff; height: 8%; position: fixed; top: 0; left: 0; right: 0; z-index: 1000;">
                <h1 style="text-align: center; margin: 0rem; color: rgb(255, 255, 255);"><strong>Pagina de prueba DEV - Widget / Chat Web MinTic</strong></h1>
            </div>

            
            <p>Lorem ipsum dolor sit amet consectetur, adipiscing elit phasellus egestas integer proin, eleifend quisque montes dignissim. Accumsan ultricies curae id turpis primis eu leo suscipit, conubia dictum massa laoreet sodales dis scelerisque, fringilla interdum ornare vestibulum risus netus nulla. Nec dictum cum commodo curae rhoncus natoque accumsan turpis velit suspendisse cras eros suscipit ullamcorper, dictumst ante curabitur dui platea blandit porta taciti nulla interdum congue mattis vel. Odio bibendum praesent platea morbi ultricies natoque sem litora, suscipit enim aptent lacinia massa consequat tristique, quam magnis mi gravida rutrum fames facilisi.

                Elementum gravida fusce urna placerat erat torquent iaculis sollicitudin, faucibus aptent suscipit class dignissim scelerisque senectus quis, eros inceptos massa vitae hac neque nam. Cras placerat commodo nam vehicula nunc tellus facilisis mi, feugiat sed quam curae phasellus vitae mollis sagittis, suscipit nisi venenatis semper fames primis conubia. Vel nisi ac magnis eros sodales, torquent volutpat malesuada. Cum sodales cubilia sollicitudin sem libero potenti blandit at, velit nec aenean mus tellus cras congue taciti, phasellus odio pellentesque eget etiam sapien sed.
                
                Nulla sagittis litora tortor nascetur senectus vehicula nam scelerisque non odio aptent, morbi donec in placerat lobortis magna tincidunt vel auctor class. Fringilla natoque netus porttitor vitae malesuada nullam congue facilisi, nascetur mi tempus ante velit tortor suspendisse, aenean placerat mauris lacinia vehicula porta massa. Facilisi ridiculus tellus elementum duis inceptos faucibus aenean condimentum lectus, egestas ac parturient at mus quis sagittis penatibus, interdum leo habitasse fermentum urna eget ultricies dui.
                
                Augue quisque sollicitudin euismod tellus aenean molestie, interdum cum et commodo donec varius, est class nullam nostra gravida. Primis auctor nascetur velit metus lacus varius iaculis nibh torquent, nostra eu accumsan non mattis porta consequat ut lacinia, fermentum nunc ultrices vitae magna elementum nulla dignissim. Tempor porttitor penatibus metus faucibus justo natoque odio, dignissim himenaeos auctor montes at quam, elementum duis feugiat est sociis erat.
                
                Porta hendrerit netus nibh odio laoreet rhoncus ligula vitae natoque accumsan, integer ad facilisis orci lectus purus nam varius massa, id quam nunc urna augue a feugiat dui nostra. Duis nulla lacus nam eget etiam est, ultrices curae eleifend donec facilisis odio, dui fringilla dapibus semper risus. Proin lectus eget sem integer cum mi consequat suspendisse, morbi vivamus non ut nunc interdum.
                
                Nulla sollicitudin fames inceptos odio hac euismod metus blandit, dui sociosqu ac scelerisque diam pharetra fusce sodales in, quam urna nam aenean himenaeos turpis cubilia. Hendrerit nullam dui vehicula magna duis pellentesque porttitor dis eget, ac molestie cras justo tempus metus suscipit vitae nostra, malesuada congue dictum tempor leo eros bibendum varius. Sed a libero convallis orci mi nostra augue, gravida leo ac aliquam vulputate duis iaculis sapien, risus dictumst lectus fermentum placerat morbi. Condimentum fames feugiat semper suscipit porttitor varius ultrices, mus cum cras morbi per eleifend viverra sociosqu, montes proin habitasse lobortis quam dapibus.
                
                Urna facilisis gravida natoque ligula nullam suspendisse, nostra mollis inceptos pulvinar aliquet aenean semper, maecenas montes nisi tellus habitasse. Libero cursus natoque fusce vivamus proin duis lacinia cum ultrices, aliquet magnis cubilia placerat hac est integer. Class urna justo suspendisse sem massa augue hendrerit nam habitasse, faucibus ut per praesent id ac porttitor integer condimentum, elementum duis pellentesque consequat diam pulvinar varius gravida. Nibh penatibus morbi viverra habitant dignissim facilisis congue dictum fringilla, faucibus lacus taciti sodales eget a turpis lectus, nec non vel egestas eu sociis libero commodo.
                
                Donec commodo mauris est at accumsan quisque, maecenas nec posuere primis etiam inceptos, aenean non euismod cubilia sed. Hac dis lobortis etiam libero senectus risus porta fames sociis mollis, penatibus sagittis sodales nam consequat tortor eros imperdiet habitasse et, inceptos ornare malesuada eleifend iaculis facilisis cursus netus ac. Etiam pellentesque per torquent aliquet primis a pharetra mus habitant, vehicula eros faucibus justo vel sociosqu viverra sagittis ultricies, ac habitasse fringilla felis sed neque magnis nullam.</p>
            
            <p>Lorem ipsum dolor sit amet consectetur, adipiscing elit phasellus egestas integer proin, eleifend quisque montes dignissim. Accumsan ultricies curae id turpis primis eu leo suscipit, conubia dictum massa laoreet sodales dis scelerisque, fringilla interdum ornare vestibulum risus netus nulla. Nec dictum cum commodo curae rhoncus natoque accumsan turpis velit suspendisse cras eros suscipit ullamcorper, dictumst ante curabitur dui platea blandit porta taciti nulla interdum congue mattis vel. Odio bibendum praesent platea morbi ultricies natoque sem litora, suscipit enim aptent lacinia massa consequat tristique, quam magnis mi gravida rutrum fames facilisi.

                Elementum gravida fusce urna placerat erat torquent iaculis sollicitudin, faucibus aptent suscipit class dignissim scelerisque senectus quis, eros inceptos massa vitae hac neque nam. Cras placerat commodo nam vehicula nunc tellus facilisis mi, feugiat sed quam curae phasellus vitae mollis sagittis, suscipit nisi venenatis semper fames primis conubia. Vel nisi ac magnis eros sodales, torquent volutpat malesuada. Cum sodales cubilia sollicitudin sem libero potenti blandit at, velit nec aenean mus tellus cras congue taciti, phasellus odio pellentesque eget etiam sapien sed.
                
                Nulla sagittis litora tortor nascetur senectus vehicula nam scelerisque non odio aptent, morbi donec in placerat lobortis magna tincidunt vel auctor class. Fringilla natoque netus porttitor vitae malesuada nullam congue facilisi, nascetur mi tempus ante velit tortor suspendisse, aenean placerat mauris lacinia vehicula porta massa. Facilisi ridiculus tellus elementum duis inceptos faucibus aenean condimentum lectus, egestas ac parturient at mus quis sagittis penatibus, interdum leo habitasse fermentum urna eget ultricies dui.
                
                Augue quisque sollicitudin euismod tellus aenean molestie, interdum cum et commodo donec varius, est class nullam nostra gravida. Primis auctor nascetur velit metus lacus varius iaculis nibh torquent, nostra eu accumsan non mattis porta consequat ut lacinia, fermentum nunc ultrices vitae magna elementum nulla dignissim. Tempor porttitor penatibus metus faucibus justo natoque odio, dignissim himenaeos auctor montes at quam, elementum duis feugiat est sociis erat.
                
                Porta hendrerit netus nibh odio laoreet rhoncus ligula vitae natoque accumsan, integer ad facilisis orci lectus purus nam varius massa, id quam nunc urna augue a feugiat dui nostra. Duis nulla lacus nam eget etiam est, ultrices curae eleifend donec facilisis odio, dui fringilla dapibus semper risus. Proin lectus eget sem integer cum mi consequat suspendisse, morbi vivamus non ut nunc interdum.
                
                Nulla sollicitudin fames inceptos odio hac euismod metus blandit, dui sociosqu ac scelerisque diam pharetra fusce sodales in, quam urna nam aenean himenaeos turpis cubilia. Hendrerit nullam dui vehicula magna duis pellentesque porttitor dis eget, ac molestie cras justo tempus metus suscipit vitae nostra, malesuada congue dictum tempor leo eros bibendum varius. Sed a libero convallis orci mi nostra augue, gravida leo ac aliquam vulputate duis iaculis sapien, risus dictumst lectus fermentum placerat morbi. Condimentum fames feugiat semper suscipit porttitor varius ultrices, mus cum cras morbi per eleifend viverra sociosqu, montes proin habitasse lobortis quam dapibus.
                
                Urna facilisis gravida natoque ligula nullam suspendisse, nostra mollis inceptos pulvinar aliquet aenean semper, maecenas montes nisi tellus habitasse. Libero cursus natoque fusce vivamus proin duis lacinia cum ultrices, aliquet magnis cubilia placerat hac est integer. Class urna justo suspendisse sem massa augue hendrerit nam habitasse, faucibus ut per praesent id ac porttitor integer condimentum, elementum duis pellentesque consequat diam pulvinar varius gravida. Nibh penatibus morbi viverra habitant dignissim facilisis congue dictum fringilla, faucibus lacus taciti sodales eget a turpis lectus, nec non vel egestas eu sociis libero commodo.
                
                Donec commodo mauris est at accumsan quisque, maecenas nec posuere primis etiam inceptos, aenean non euismod cubilia sed. Hac dis lobortis etiam libero senectus risus porta fames sociis mollis, penatibus sagittis sodales nam consequat tortor eros imperdiet habitasse et, inceptos ornare malesuada eleifend iaculis facilisis cursus netus ac. Etiam pellentesque per torquent aliquet primis a pharetra mus habitant, vehicula eros faucibus justo vel sociosqu viverra sagittis ultricies, ac habitasse fringilla felis sed neque magnis nullam.</p>
            
            <p>Lorem ipsum dolor sit amet consectetur, adipiscing elit phasellus egestas integer proin, eleifend quisque montes dignissim. Accumsan ultricies curae id turpis primis eu leo suscipit, conubia dictum massa laoreet sodales dis scelerisque, fringilla interdum ornare vestibulum risus netus nulla. Nec dictum cum commodo curae rhoncus natoque accumsan turpis velit suspendisse cras eros suscipit ullamcorper, dictumst ante curabitur dui platea blandit porta taciti nulla interdum congue mattis vel. Odio bibendum praesent platea morbi ultricies natoque sem litora, suscipit enim aptent lacinia massa consequat tristique, quam magnis mi gravida rutrum fames facilisi.

                Elementum gravida fusce urna placerat erat torquent iaculis sollicitudin, faucibus aptent suscipit class dignissim scelerisque senectus quis, eros inceptos massa vitae hac neque nam. Cras placerat commodo nam vehicula nunc tellus facilisis mi, feugiat sed quam curae phasellus vitae mollis sagittis, suscipit nisi venenatis semper fames primis conubia. Vel nisi ac magnis eros sodales, torquent volutpat malesuada. Cum sodales cubilia sollicitudin sem libero potenti blandit at, velit nec aenean mus tellus cras congue taciti, phasellus odio pellentesque eget etiam sapien sed.
                
                Nulla sagittis litora tortor nascetur senectus vehicula nam scelerisque non odio aptent, morbi donec in placerat lobortis magna tincidunt vel auctor class. Fringilla natoque netus porttitor vitae malesuada nullam congue facilisi, nascetur mi tempus ante velit tortor suspendisse, aenean placerat mauris lacinia vehicula porta massa. Facilisi ridiculus tellus elementum duis inceptos faucibus aenean condimentum lectus, egestas ac parturient at mus quis sagittis penatibus, interdum leo habitasse fermentum urna eget ultricies dui.
                
                Augue quisque sollicitudin euismod tellus aenean molestie, interdum cum et commodo donec varius, est class nullam nostra gravida. Primis auctor nascetur velit metus lacus varius iaculis nibh torquent, nostra eu accumsan non mattis porta consequat ut lacinia, fermentum nunc ultrices vitae magna elementum nulla dignissim. Tempor porttitor penatibus metus faucibus justo natoque odio, dignissim himenaeos auctor montes at quam, elementum duis feugiat est sociis erat.
                
                Porta hendrerit netus nibh odio laoreet rhoncus ligula vitae natoque accumsan, integer ad facilisis orci lectus purus nam varius massa, id quam nunc urna augue a feugiat dui nostra. Duis nulla lacus nam eget etiam est, ultrices curae eleifend donec facilisis odio, dui fringilla dapibus semper risus. Proin lectus eget sem integer cum mi consequat suspendisse, morbi vivamus non ut nunc interdum.
                
                Nulla sollicitudin fames inceptos odio hac euismod metus blandit, dui sociosqu ac scelerisque diam pharetra fusce sodales in, quam urna nam aenean himenaeos turpis cubilia. Hendrerit nullam dui vehicula magna duis pellentesque porttitor dis eget, ac molestie cras justo tempus metus suscipit vitae nostra, malesuada congue dictum tempor leo eros bibendum varius. Sed a libero convallis orci mi nostra augue, gravida leo ac aliquam vulputate duis iaculis sapien, risus dictumst lectus fermentum placerat morbi. Condimentum fames feugiat semper suscipit porttitor varius ultrices, mus cum cras morbi per eleifend viverra sociosqu, montes proin habitasse lobortis quam dapibus.
                
                Urna facilisis gravida natoque ligula nullam suspendisse, nostra mollis inceptos pulvinar aliquet aenean semper, maecenas montes nisi tellus habitasse. Libero cursus natoque fusce vivamus proin duis lacinia cum ultrices, aliquet magnis cubilia placerat hac est integer. Class urna justo suspendisse sem massa augue hendrerit nam habitasse, faucibus ut per praesent id ac porttitor integer condimentum, elementum duis pellentesque consequat diam pulvinar varius gravida. Nibh penatibus morbi viverra habitant dignissim facilisis congue dictum fringilla, faucibus lacus taciti sodales eget a turpis lectus, nec non vel egestas eu sociis libero commodo.
                
                Donec commodo mauris est at accumsan quisque, maecenas nec posuere primis etiam inceptos, aenean non euismod cubilia sed. Hac dis lobortis etiam libero senectus risus porta fames sociis mollis, penatibus sagittis sodales nam consequat tortor eros imperdiet habitasse et, inceptos ornare malesuada eleifend iaculis facilisis cursus netus ac. Etiam pellentesque per torquent aliquet primis a pharetra mus habitant, vehicula eros faucibus justo vel sociosqu viverra sagittis ultricies, ac habitasse fringilla felis sed neque magnis nullam.</p>
            
            
            <!-- Contenedor Widget -->
            <div id="contenedorWidget"></div>

            <!-- Import js y css -->
            <script>
                // Definición de constantes para las URLs
                const URL_BASE = 'https://owns-portrait-fiction-lose.trycloudflare.com';
                const URL_CSS = `${URL_BASE}/chatWeb.css`;
                const URL_JS = `${URL_BASE}/chatWeb.js`;

                // Función para cargar con timeout
                function cargarConTimeout(cargarFn, src, timeout = 1500) {
                return new Promise((resolve, reject) => {
                    let el;
                    const timer = setTimeout(() => {
                    if (el && el.parentNode) el.parentNode.removeChild(el);
                    reject(new Error('Timeout al cargar: ' + src));
                    }, timeout);

                    cargarFn(src)
                    .then(() => {
                        clearTimeout(timer);
                        resolve();
                    })
                    .catch((err) => {
                        clearTimeout(timer);
                        reject(err);
                    });

                    // Guardar el elemento para poder removerlo si hay timeout
                    if (cargarFn === cargarCSS) {
                    el = document.querySelector(`link[href='${src}']`);
                    }
                    if (cargarFn === cargarJS) {
                    el = document.querySelector(`script[src='${src}']`);
                    }
                });
                }

                // Funcion para cargar el css
                function cargarCSS(src) {
                return new Promise((resolve, reject) => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = src;
                    link.onload = resolve;
                    link.onerror = reject;
                    document.head.appendChild(link);
                    // Devuelve el elemento para poder removerlo si hay timeout
                    resolve.el = link;
                });
                }

                // Funcion para cargar el js
                function cargarJS(src) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                }

                // Carga con timeout de 3 segundos
                cargarConTimeout(cargarCSS, URL_CSS, 1500)
                .then(() => cargarConTimeout(cargarJS, URL_JS, 1500))
                .then(() => {
                    if (window.WidgetChat && typeof window.WidgetChat.init === 'function' && document.getElementById('contenedorWidget')) {
                    window.WidgetChat.init();
                    console.log('✅ Widget cargado exitosamente');
                    } else {
                    console.error('❌ El widget o el contenedor no están disponibles.');
                    }
                })
                .catch((error) => {
                    console.error('❌ Error al cargar recursos del widget, por favor contactenos:', error);
                    
                    // Configuración de reintentos
                    const intervaloReintento = 15000; // 15 segundos
                    const tiempoMaximo = 300000; // 5 minutos
                    const tiempoInicio = Date.now();
                    
                    // Funcion para intentar cargar nuevamente los recursos
                    function intentarCarga() {
                    const tiempoTranscurrido = Date.now() - tiempoInicio;
                    
                    if (tiempoTranscurrido >= tiempoMaximo) {
                        console.error('❌ Tiempo máximo de reintentos alcanzado');
                        return;
                    }
                    
                    console.log('🔄 Reintentando cargar el widget...');
                    
                    cargarConTimeout(cargarCSS, URL_CSS, 1500)
                        .then(() => cargarConTimeout(cargarJS, URL_JS, 1500))
                        .then(() => {
                        if (window.WidgetChat && typeof window.WidgetChat.init === 'function' && document.getElementById('contenedorWidget')) {
                            window.WidgetChat.init();
                            console.log('✅ Widget cargado exitosamente');
                        } else {
                            throw new Error('El widget o el contenedor no están disponibles');
                        }
                        })
                        .catch((error) => {
                        console.error('❌ Error en reintento:', error);
                        setTimeout(intentarCarga, intervaloReintento);
                        });
                    }
                    
                    // Iniciar el primer reintento
                    setTimeout(intentarCarga, intervaloReintento);
                });
            </script>
            </body>

</html>

    •   Consideraciones Adicionales:
        *   Asegúrese de que los archivos referenciados sean accesibles desde la red donde está alojada la página oficial en la cual se desea integrar el widget.
        *   Verifique que no existan conflictos con otros estilos o scripts en el sitio web que puedan afectar el diseño o el funcionamiento del widget.
        *   Se recomienda realizar pruebas en un ambiente de desarrollo antes de implementar los cambios en el sitio de producción.
        *   Por favor, no duden en contactarnos si necesitan mayor información o soporte técnico durante el proceso de integración.

```

## Acceso

```bash
    1.  Ambiente de pruebas
            https://demoXXXXXXXXXXXXXX.com

        Monitor
            https://demoXXXXXXXXXXXXXX.com/widget/chat/monitor

    2.  Ambiente de produccion
            https://XXXXXXXXXXXXXX.com

        Monitor    
            https://XXXXXXXXXXXXXX.com/widget/chat/monitor

```

## Modulos - permisos

```bash
    1.  WIDGET CHAT WEB
        •   Arbol de atencion.
        •   Consumo de API's.
        •   Mensaje de cierre por inactividad.
        •   Alerta de inactividad.
        •   Listar archivos adjuntos.
        •   Monitor

```

## Contribuyendo

Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

1. Desde la rama master, crea una rama nombre_tu_rama.
2. Clone el proyecto desde el repositorio oficial y rama master.
3. Crea una rama para tu funcionalidad (`git checkout -b nombre_tu_rama`).
4. Realiza un commit de tus cambios (`git commit -m 'Mensaje de commit...'`).
5. Sube los cambios al repositorio (`git push origin nombre_tu_rama`)
6. Solicita un merge a la rama quality.
7. Si el merge es exitoso, solicita un merge a la rama master desde la rama quality.
8. Solicita el deploy de la rama master.

## Licencia

Todos los derechos reservados a Montechelo.