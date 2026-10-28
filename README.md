# Alrededor de los EE. UU. — API con Express

API REST construida con Node.js, Express y MongoDB que gestiona los usuarios y las
tarjetas del proyecto "Alrededor de los EE. UU.". Es el backend del proyecto que en
sprints anteriores se resolvió únicamente en el frontend.

Los datos se guardan en una base de datos MongoDB. La API permite consultar y crear
usuarios, editar el perfil y el avatar, publicar y eliminar tarjetas, y darles o
quitarles "me gusta".

## Funcionalidad

Todas las respuestas, correctas o de error, se envían en formato JSON. Las peticiones
que crean un documento responden con el estado 201.

### Usuarios

| Petición                 | Descripción                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `GET /users`             | Devuelve todos los usuarios                                              |
| `GET /users/:userId`     | Devuelve el usuario cuyo `_id` coincide con el identificador recibido    |
| `POST /users`            | Crea un usuario con los campos `name`, `about` y `avatar` del cuerpo     |
| `PATCH /users/me`        | Actualiza `name` y `about` del usuario actual (basta con enviar uno)     |
| `PATCH /users/me/avatar` | Actualiza el `avatar` del usuario actual                                 |

### Tarjetas

| Petición                      | Descripción                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| `GET /cards`                  | Devuelve todas las tarjetas                                          |
| `POST /cards`                 | Crea una tarjeta con `name` y `link`; el autor es el usuario actual  |
| `DELETE /cards/:cardId`       | Elimina la tarjeta cuyo `_id` coincide con el identificador recibido |
| `PUT /cards/:cardId/likes`    | Añade un "me gusta" del usuario actual (como máximo uno por usuario) |
| `DELETE /cards/:cardId/likes` | Quita el "me gusta" del usuario actual                               |

### Autorización temporal

El proyecto todavía no tiene registro ni inicio de sesión. Mientras tanto, un
middleware de `app.js` asigna a cada petición un usuario de prueba fijo
(`req.user._id`). Ese usuario es el autor de las tarjetas que se crean, el que da los
"me gusta" y el que se edita en las rutas `/users/me`.

Para probarlo en local, crea un usuario con `POST /users` y sustituye en `app.js` el
`_id` del middleware por el del usuario creado.

### Validación de datos

Antes de guardar o actualizar un documento, Mongoose comprueba que:

- `name` y `about` son textos obligatorios de 2 a 30 caracteres.
- `avatar` y `link` son enlaces válidos: empiezan por `http://` o `https://`, pueden
  incluir `www.`, tienen un dominio con su zona DNS y, opcionalmente, una ruta.

### Errores

Cuando algo falla, el servidor devuelve un objeto con un único campo `message`.

| Situación                                                              | Estado        | Mensaje                                                       |
| ---------------------------------------------------------------------- | ------------- | ------------------------------------------------------------- |
| Datos no válidos al crear un usuario o una tarjeta                     | 400           | `Datos de usuario no válidos` / `Datos de tarjeta no válidos` |
| Datos no válidos o ausentes al actualizar el perfil o el avatar        | 400           | `Datos de usuario no válidos`                                 |
| Identificador con formato no válido                                    | 400           | `ID de usuario no válido` / `ID de tarjeta no válido`         |
| Petición mal formada (JSON incorrecto, cuerpo demasiado grande, etc.)  | 400, 413, 415 | `Solicitud no válida`                                         |
| No existe un usuario o una tarjeta con ese identificador               | 404           | `ID de usuario no encontrado` / `ID de tarjeta no encontrado` |
| La dirección solicitada no existe                                      | 404           | `Recurso solicitado no encontrado`                            |
| Error inesperado del servidor                                          | 500           | `Ha ocurrido un error en el servidor`                         |

## Tecnologías y técnicas

- **Node.js** como entorno de ejecución del servidor.
- **Express** para el enrutamiento y el manejo de peticiones HTTP, con un **Router**
  por recurso montado sobre su prefijo desde el punto de entrada.
- **MongoDB** como base de datos y **Mongoose** para definir los esquemas y modelos
  `user` y `card`.
- **Validación con Mongoose**: validadores integrados (`required`, `minlength`,
  `maxlength`) y un **validador personalizado con expresión regular** para los enlaces.
  Las actualizaciones usan `runValidators` para aplicar las mismas reglas.
- **Operadores de MongoDB `$addToSet` y `$pull`** para que cada usuario pueda dar como
  máximo un "me gusta" por tarjeta.
- **Arquitectura por capas**: rutas, controladores y modelos en carpetas separadas.
- **Middlewares de Express**: lectura del cuerpo JSON con `express.json()` y
  autorización temporal del usuario.
- **Manejo de errores**:
  - `orFail()` convierte un resultado vacío en un `DocumentNotFoundError`.
  - Los controladores eligen el estado según `err.name` (`ValidationError`,
    `CastError`, `DocumentNotFoundError`).
  - Los códigos de estado se definen como constantes en `utils/errors.js`.
  - Un middleware de error centralizado responde a las peticiones mal formadas y a los
    errores inesperados; solo estos últimos se registran en la consola.
- **ESLint** con la guía de estilo de Airbnb, con excepciones documentadas para el campo
  `_id`, el uso de `console` y el estilo de salto de línea.
- **EditorConfig** para mantener un formato de archivo común entre editores.
- **nodemon** para recargar el servidor automáticamente durante el desarrollo.
- **CommonJS** con `require` para importar módulos, y sintaxis ES6 en el resto del
  código.

## Estructura del proyecto

```
app.js                 Punto de entrada: conexión a MongoDB, middlewares, routers y errores
routes/users.js        Rutas de usuarios
routes/cards.js        Rutas de tarjetas
controllers/users.js   Lógica de las rutas de usuarios
controllers/cards.js   Lógica de las rutas de tarjetas
models/user.js         Esquema y modelo user
models/card.js         Esquema y modelo card
utils/errors.js        Constantes de los códigos de estado de error
utils/validators.js    Expresión regular para validar enlaces
```

## Requisitos

- Node.js y npm.
- Un servidor de MongoDB en ejecución en `localhost:27017`. La aplicación usa la base
  de datos `aroundb`, que MongoDB crea automáticamente al guardar el primer documento.

## Instalación

```bash
npm install
```

## Comandos disponibles

| Comando         | Descripción                                                  |
| --------------- | ------------------------------------------------------------ |
| `npm run start` | Inicia el servidor en `localhost:3000`                       |
| `npm run dev`   | Inicia el servidor con recarga automática al guardar cambios |
| `npm run lint`  | Revisa el estilo del código con ESLint                       |

El puerto se toma de la variable de entorno `PORT` y, si no está definida, se usa el
3000 de forma predeterminada.
