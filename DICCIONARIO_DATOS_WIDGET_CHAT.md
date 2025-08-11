# DICCIONARIO DE DATOS - SISTEMA WIDGET CHAT MINISTERIO TIC

## INFORMACIÓN GENERAL DEL SISTEMA

**Nombre del Sistema:** Widget Chat Web MinTic  
**Base de Datos:** `dbd_widget_chat_web_mintic`  
**Propósito:** Sistema de atención virtual para personas con discapacidad auditiva  
**Versión:** 1.0.0  
**Fecha de Creación:** 24 de Enero de 2025  
**Autor:** Ramón Dario Rozo Torres  

---

## ESTRUCTURA DE LA BASE DE DATOS

### 1. TABLA PRINCIPAL: `tbl_chat`

**Descripción:** Almacena la información principal de cada sesión de chat, incluyendo datos del usuario y contexto de la conversación.

| Campo | Tipo | Descripción | Valores Posibles | Ejemplo |
|-------|------|-------------|------------------|---------|
| `cht_id` | INT | Identificador único del chat (Auto-incremento) | Números secuenciales | 1, 2, 3... |
| `cht_fecha` | TIMESTAMP | Fecha y hora de creación del chat | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 10:30:00 |
| `cht_tipo` | VARCHAR(45) | Tipo de gestión del chat | 'Inbound', 'Outbound' | Inbound |
| `cht_remitente` | VARCHAR(255) | Identificación del remitente del chat | Texto libre | "Usuario123" |
| `cht_estado` | VARCHAR(45) | Estado actual del chat | 'Recibido', 'Enviado' | Recibido |
| `cht_gestion` | VARCHAR(45) | Estado de gestión del chat | 'Abierto', 'Cerrado' | Abierto |
| `cht_arbol` | VARCHAR(255) | Nodo del árbol de decisión actual | Ver valores en sección de datos estáticos | 'Saludo', 'Inicio' |
| `cht_control_api` | LONGTEXT | Control de respuesta de la API | 'Success', 'Error', 'Warning', 'Info' | Success |
| `cht_control_peticiones` | VARCHAR(45) | Contador de peticiones a la API | Números | 0, 1, 2... |
| `cht_resultado_api` | LONGTEXT | Respuesta completa de la API | JSON o texto | {"status": "success"} |
| `cht_nombres` | VARCHAR(45) | Nombres del usuario | Texto libre | "Juan Carlos" |
| `cht_apellidos` | VARCHAR(45) | Apellidos del usuario | Texto libre | "Pérez García" |
| `cht_numero_cedula` | VARCHAR(45) | Número de identificación del usuario | Números y letras | "12345678" |
| `cht_pais_residencia` | VARCHAR(250) | País de residencia del usuario | Texto libre | "Colombia" |
| `cht_ciudad_residencia` | VARCHAR(250) | Ciudad de residencia del usuario | Texto libre | "Bogotá" |
| `cht_indicativo_pais` | VARCHAR(45) | Código de país para llamadas | Texto | "+57" |
| `cht_numero_celular` | VARCHAR(45) | Número de teléfono del usuario | Números | "3001234567" |
| `cht_correo_electronico` | VARCHAR(45) | Correo electrónico del usuario | Email válido | "usuario@email.com" |
| `cht_autorizacion_datos_personales` | VARCHAR(45) | Autorización para tratamiento de datos | 'Si', 'No' | Si |
| `cht_adjuntos` | VARCHAR(45) | Indica si hay archivos adjuntos | 'Si', 'No' | No |
| `cht_ruta_adjuntos` | VARCHAR(1000) | Ruta de los archivos adjuntos | Ruta del sistema | "/uploads/chat123/" |
| `cht_descripcion` | VARCHAR(255) | Descripción adicional del chat | Texto libre | "Chat de consulta general" |
| `cht_registro` | VARCHAR(45) | Estado del registro en el sistema | 'Activo', 'Inactivo' | Activo |
| `cht_actualizacion` | TIMESTAMP | Fecha y hora de última actualización | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 15:45:00 |
| `cht_responsable` | VARCHAR(45) | Sistema responsable del chat | Texto fijo | "Chat Web MinTic" |

---

### 2. TABLA HISTÓRICO: `tbl_historico_chat`

**Descripción:** Mantiene un historial de todos los cambios realizados en la tabla de chat para auditoría y trazabilidad.

| Campo | Tipo | Descripción | Valores Posibles | Ejemplo |
|-------|------|-------------|------------------|---------|
| `htcht_id` | INT | Identificador único del registro histórico (Auto-incremento) | Números secuenciales | 1, 2, 3... |
| `htcht_fk_id_chat` | INT | Referencia al chat original | ID de tbl_chat | 1, 2, 3... |
| `htcht_fecha` | TIMESTAMP | Fecha y hora del cambio | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 10:30:00 |
| `htcht_accion` | VARCHAR(45) | Acción realizada | 'INSERT', 'UPDATE', 'DELETE' | UPDATE |
| `htcht_tipo` | VARCHAR(45) | Tipo de gestión del chat (copia) | 'Inbound', 'Outbound' | Inbound |
| `htcht_remitente` | VARCHAR(255) | Remitente del chat (copia) | Texto libre | "Usuario123" |
| `htcht_estado` | VARCHAR(45) | Estado del chat (copia) | 'Recibido', 'Enviado' | Recibido |
| `htcht_gestion` | VARCHAR(45) | Estado de gestión (copia) | 'Abierto', 'Cerrado' | Abierto |
| `htcht_arbol` | VARCHAR(255) | Nodo del árbol (copia) | Ver valores en sección de datos estáticos | 'Saludo' |
| `htcht_control_api` | LONGTEXT | Control de API (copia) | 'Success', 'Error', 'Warning', 'Info' | Success |
| `htcht_control_peticiones` | VARCHAR(45) | Control de peticiones (copia) | Números | 0, 1, 2... |
| `htcht_resultado_api` | LONGTEXT | Resultado de API (copia) | JSON o texto | {"status": "success"} |
| `htcht_nombres` | VARCHAR(45) | Nombres del usuario (copia) | Texto libre | "Juan Carlos" |
| `htcht_apellidos` | VARCHAR(45) | Apellidos del usuario (copia) | Texto libre | "Pérez García" |
| `htcht_numero_cedula` | VARCHAR(45) | Número de cédula (copia) | Números y letras | "12345678" |
| `htcht_pais_residencia` | VARCHAR(250) | País de residencia (copia) | Texto libre | "Colombia" |
| `htcht_ciudad_residencia` | VARCHAR(250) | Ciudad de residencia (copia) | Texto libre | "Bogotá" |
| `htcht_indicativo_pais` | VARCHAR(45) | Indicativo de país (copia) | Texto | "+57" |
| `htcht_numero_celular` | VARCHAR(45) | Número de celular (copia) | Texto | "3001234567" |
| `htcht_correo_electronico` | VARCHAR(45) | Correo electrónico (copia) | Email válido | "usuario@email.com" |
| `htcht_autorizacion_datos_personales` | VARCHAR(45) | Autorización de datos (copia) | 'Si', 'No' | Si |
| `htcht_adjuntos` | VARCHAR(45) | Adjuntos (copia) | 'Si', 'No' | No |
| `htcht_ruta_adjuntos` | VARCHAR(1000) | Ruta de adjuntos (copia) | Ruta del sistema | "/uploads/chat123/" |
| `htcht_descripcion` | VARCHAR(255) | Descripción (copia) | Texto libre | "Chat de consulta general" |
| `htcht_registro` | VARCHAR(45) | Estado del registro (copia) | 'Activo', 'Inactivo' | Activo |
| `htcht_actualizacion` | TIMESTAMP | Fecha de actualización (copia) | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 15:45:00 |
| `htcht_responsable` | VARCHAR(45) | Responsable (copia) | Texto | "Chat Web MinTic" |

---

### 3. TABLA MENSAJES: `tbl_mensaje`

**Descripción:** Almacena todos los mensajes intercambiados en cada chat, incluyendo contenido, tipo y estado de lectura.

| Campo | Tipo | Descripción | Valores Posibles | Ejemplo |
|-------|------|-------------|------------------|---------|
| `msg_id` | INT | Identificador único del mensaje (Auto-incremento) | Números secuenciales | 1, 2, 3... |
| `msg_fecha` | TIMESTAMP | Fecha y hora del mensaje | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 10:30:00 |
| `msg_fk_id_chat` | INT | Referencia al chat al que pertenece | ID de tbl_chat | 1, 2, 3... |
| `msg_remitente` | VARCHAR(255) | Quien envía el mensaje | Texto libre | "Usuario123", "Sistema" |
| `msg_estado` | VARCHAR(45) | Estado del mensaje | 'Recibido', 'Enviado' | Recibido |
| `msg_tipo` | VARCHAR(45) | Tipo de mensaje | Ver valores en sección de datos estáticos | 'Texto', 'Adjuntos' |
| `msg_contenido` | LONGTEXT | Contenido del mensaje | HTML, texto, JSON | "<p>Hola, ¿cómo estás?</p>" |
| `msg_enlaces` | VARCHAR(1000) | Enlaces incluidos en el mensaje | URLs separadas por comas | "https://google.com" |
| `msg_lectura` | VARCHAR(45) | Estado de lectura del mensaje | 'No leido', 'Leido' | No leido |
| `msg_descripcion` | VARCHAR(255) | Descripción del mensaje | Texto libre | "Mensaje de saludo inicial" |
| `msg_registro` | VARCHAR(45) | Estado del registro | 'Activo', 'Inactivo' | Activo |
| `msg_actualizacion` | TIMESTAMP | Fecha de última actualización | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 15:45:00 |
| `msg_responsable` | VARCHAR(45) | Sistema responsable | Texto fijo | "Chat Web MinTic" |

---

### 4. TABLA HISTÓRICO MENSAJES: `tbl_historico_mensaje`

**Descripción:** Mantiene un historial de todos los cambios en los mensajes para auditoría y trazabilidad.

| Campo | Tipo | Descripción | Valores Posibles | Ejemplo |
|-------|------|-------------|------------------|---------|
| `htmsg_id` | INT | Identificador único del registro histórico (Auto-incremento) | Números secuenciales | 1, 2, 3... |
| `htmsg_fk_id_mensaje` | INT | Referencia al mensaje original | ID de tbl_mensaje | 1, 2, 3... |
| `htmsg_fecha` | TIMESTAMP | Fecha y hora del cambio | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 10:30:00 |
| `htmsg_accion` | VARCHAR(45) | Acción realizada | 'INSERT', 'UPDATE', 'DELETE' | UPDATE |
| `htmsg_fk_id_chat` | INT | Referencia al chat (copia) | ID de tbl_chat | 1, 2, 3... |
| `htmsg_remitente` | VARCHAR(255) | Remitente del mensaje (copia) | Texto libre | "Usuario123" |
| `htmsg_estado` | VARCHAR(45) | Estado del mensaje (copia) | 'Recibido', 'Enviado' | Recibido |
| `htmsg_tipo` | VARCHAR(45) | Tipo de mensaje (copia) | Ver valores en sección de datos estáticos | 'Texto' |
| `htmsg_contenido` | LONGTEXT | Contenido del mensaje (copia) | HTML, texto, JSON | "<p>Hola</p>" |
| `htmsg_enlaces` | VARCHAR(1000) | Enlaces del mensaje (copia) | URLs separadas por comas | "https://google.com" |
| `htmsg_lectura` | VARCHAR(45) | Estado de lectura (copia) | 'No leido', 'Leido' | No leido |
| `htmsg_descripcion` | VARCHAR(255) | Descripción (copia) | Texto libre | "Mensaje de saludo" |
| `htmsg_registro` | VARCHAR(45) | Estado del registro (copia) | 'Activo', 'Inactivo' | Activo |
| `htmsg_actualizacion` | TIMESTAMP | Fecha de actualización (copia) | Formato: YYYY-MM-DD HH:MM:SS | 2025-01-24 15:45:00 |
| `htmsg_responsable` | VARCHAR(45) | Responsable (copia) | Texto | "Chat Web MinTic" |

---

## RELACIONES ENTRE TABLAS

### Diagrama de Relaciones:
```
tbl_chat (1) ←→ (N) tbl_mensaje
     ↑                    ↑
     |                    |
     |                    |
tbl_historico_chat  tbl_historico_mensaje
```

### Descripción de Relaciones:
- **`tbl_chat` → `tbl_mensaje`**: Un chat puede tener múltiples mensajes (relación 1:N)
- **`tbl_chat` → `tbl_historico_chat`**: Cada cambio en un chat se registra en el histórico (relación 1:N)
- **`tbl_mensaje` → `tbl_historico_mensaje`**: Cada cambio en un mensaje se registra en el histórico (relación 1:N)

---

## VALORES ESTÁTICOS DEL SISTEMA

### Tipos de Gestión (`cht_tipo`, `htcht_tipo`)
- **Inbound**: Chat iniciado por el usuario
- **Outbound**: Chat iniciado por el sistema

### Estados de Chat (`cht_estado`, `htcht_estado`)
- **Recibido**: Mensaje recibido por el sistema
- **Enviado**: Mensaje enviado por el sistema

### Estados de Gestión (`cht_gestion`, `htcht_gestion`)
- **Abierto**: Chat activo y en proceso
- **Cerrado**: Chat finalizado

### Nodos del Árbol de Decisión (`cht_arbol`, `htcht_arbol`)
- **Saludo**: Mensaje de bienvenida inicial
- **Despedida**: Mensaje de cierre
- **Instrucciones**: Instrucciones para el usuario
- **Inicio**: Menú principal del sistema
- **Autorizacion Datos Personales**: Solicitud de consentimiento
- **Rol Usuario**: Identificación del tipo de usuario
- **Interaccion AI Soul**: Interacción con inteligencia artificial
- **Error API**: Manejo de errores de API
- **Cliente Desiste**: Usuario decide no continuar
- **Alerta Inactividad**: Advertencia por inactividad
- **Cerrado Por Inactividad**: Chat cerrado por inactividad
- **Condicion Adjuntos**: Verificación de archivos adjuntos
- **Confirmar Adjuntos**: Confirmación de archivos adjuntos

### Control de API (`cht_control_api`, `htcht_control_api`)
- **Success**: Operación exitosa
- **Error**: Error en la operación
- **Warning**: Advertencia en la operación
- **Info**: Información de la operación

### Tipos de Mensaje (`msg_tipo`, `htmsg_tipo`)
- **Texto**: Mensaje de texto plano o HTML
- **Adjuntos**: Mensaje con archivos adjuntos
- **Multimedia**: Mensaje con contenido multimedia
- **Inactividad**: Mensaje por inactividad del usuario
- **Fin Chat**: Mensaje de finalización del chat
- **Error API**: Mensaje de error de API
- **Formulario**: Mensaje con formulario

### Estados de Mensaje (`msg_estado`, `htmsg_estado`)
- **Recibido**: Mensaje recibido por el sistema
- **Enviado**: Mensaje enviado por el sistema

### Estados de Lectura (`msg_lectura`, `htmsg_lectura`)
- **No leido**: Mensaje no ha sido leído
- **Leido**: Mensaje ha sido leído

### Estados de Registro (`cht_registro`, `msg_registro`)
- **Activo**: Registro activo en el sistema
- **Inactivo**: Registro inactivo en el sistema

---

## CONSULTAS ÚTILES PARA REPORTING

### 1. Total de Chats por Período
```sql
SELECT 
    DATE(cht_fecha) as fecha,
    COUNT(*) as total_chats
FROM tbl_chat 
WHERE cht_fecha BETWEEN '2025-01-01' AND '2025-01-31'
GROUP BY DATE(cht_fecha)
ORDER BY fecha;
```

### 2. Chats por Estado de Gestión
```sql
SELECT 
    cht_gestion,
    COUNT(*) as cantidad
FROM tbl_chat 
GROUP BY cht_gestion;
```

### 3. Mensajes por Tipo
```sql
SELECT 
    msg_tipo,
    COUNT(*) as cantidad
FROM tbl_mensaje 
GROUP BY msg_tipo;
```

### 4. Chats por Nodo del Árbol
```sql
SELECT 
    cht_arbol,
    COUNT(*) as cantidad
FROM tbl_chat 
GROUP BY cht_arbol
ORDER BY cantidad DESC;
```

### 5. Tiempo Promedio de Duración de Chat
```sql
SELECT 
    AVG(TIMESTAMPDIFF(MINUTE, cht_fecha, cht_actualizacion)) as tiempo_promedio_minutos
FROM tbl_chat 
WHERE cht_gestion = 'Cerrado';
```

### 6. Usuarios por Ciudad
```sql
SELECT 
    cht_ciudad_residencia,
    COUNT(DISTINCT cht_numero_cedula) as usuarios_unicos
FROM tbl_chat 
WHERE cht_ciudad_residencia != '-'
GROUP BY cht_ciudad_residencia
ORDER BY usuarios_unicos DESC;
```

---

## CONSIDERACIONES PARA REPORTING

### 1. **Auditoría y Trazabilidad**
- Todas las tablas principales tienen su correspondiente tabla histórica
- Los campos de fecha incluyen tanto creación como última actualización
- Se registra el sistema responsable de cada operación

### 2. **Datos Personales**
- Los datos personales están protegidos por autorización explícita
- Se puede rastrear el consentimiento del usuario
- Los datos sensibles están encriptados o protegidos

### 3. **Métricas de Rendimiento**
- Control de peticiones a API para monitoreo de rendimiento
- Estados de API para identificar problemas técnicos
- Tiempos de respuesta y duración de chats

### 4. **Flujo de Usuario**
- El árbol de decisión permite mapear el recorrido del usuario
- Estados de gestión para identificar puntos de abandono
- Tipos de mensaje para entender la interacción

### 5. **Geolocalización**
- Datos de país y ciudad para análisis geográfico
- Indicativos de país para análisis internacional

---

## GLOSARIO DE TÉRMINOS

- **Widget Chat**: Sistema de chat integrado en páginas web
- **Árbol de Decisión**: Flujo lógico de opciones y respuestas del sistema
- **Inbound/Outbound**: Dirección de la comunicación (entrante/saliente)
- **API**: Interfaz de programación para comunicación entre sistemas
- **LONGTEXT**: Tipo de dato para contenido extenso (hasta 4GB)
- **Trigger**: Procedimiento automático que se ejecuta ante cambios en la base de datos
- **Auditoría**: Registro de todas las operaciones para trazabilidad

---

## CONTACTO Y SOPORTE

**Sistema:** Widget Chat Web MinTic  
**Base de Datos:** `dbd_widget_chat_web_mintic`  
**Responsable Técnico:** Ramón Dario Rozo Torres  
**Fecha de Actualización:** 24 de Enero de 2025  

---

*Este diccionario de datos debe ser actualizado cada vez que se modifique la estructura de la base de datos o se agreguen nuevos valores estáticos al sistema.*
