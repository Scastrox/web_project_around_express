# Alrededor de los EE. UU. — API con Express

API REST construida con Node.js y Express que sirve los datos de usuarios y
tarjetas del proyecto "Alrededor de los EE. UU.". Es el backend del proyecto que
en sprints anteriores se resolvió únicamente en el frontend.

En esta etapa los datos se leen desde archivos JSON almacenados en el propio
repositorio. Se trata de una solución temporal: en el siguiente sprint esos
archivos se reemplazan por una base de datos MongoDB.

## Funcionalidad

El servidor expone tres rutas de lectura y responde con JSON en todos los casos,
tanto en las respuestas correctas como en los errores.

| Petición | Respuesta |
| --- | --- |
| `GET /users` | Lista completa de usuarios |
| `GET /cards` | Lista completa de tarjetas |
| `GET /users/:id` | Datos del usuario cuyo `_id` coincide con el identificador recibido |

Cuando algo falla, el servidor devuelve un objeto con un único campo `message`.

| Situación | Estado | Mensaje |
| --- | --- | --- |
| No existe un usuario con ese identificador | 404 | `ID de usuario no encontrado` |
| La dirección solicitada no existe | 404 | `Recurso solicitado no encontrado` |
| Fallo al leer los archivos de datos | 500 | `Ha ocurrido un error en el servidor` |

## Tecnologías y técnicas

- **Node.js** como entorno de ejecución del servidor.
- **Express** para el enrutamiento y el manejo de peticiones HTTP.
- **Router de Express** para separar las rutas por recurso en archivos propios,
  montados sobre un prefijo desde el punto de entrada.
- **Módulo `fs`** en su versión basada en promesas para leer los archivos de
  datos sin bloquear el hilo principal.
- **Módulo `path`** con `__dirname` para construir rutas absolutas hacia los
  archivos de datos, de modo que el servidor funcione sin importar desde qué
  carpeta se ejecute.
- **Manejo de errores con `catch`** en cada lectura de archivo, para que ningún
  fallo quede sin gestionar ni detenga el proceso.
- **ESLint** con la guía de estilo de Airbnb, con excepciones documentadas para
  el campo `_id`, el uso de `console` y el estilo de salto de línea.
- **nodemon** para recargar el servidor automáticamente durante el desarrollo.
- **CommonJS** con `require` para importar módulos, y sintaxis ES6 en el resto
  del código.

## Estructura del proyecto

```
app.js              Punto de entrada: monta los routers y el manejador de 404
data/users.json     Datos de usuarios
data/cards.json     Datos de tarjetas
routes/users.js     Rutas de usuarios
routes/cards.js     Rutas de tarjetas
```

## Instalación

```bash
npm install
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run start` | Inicia el servidor en `localhost:3000` |
| `npm run dev` | Inicia el servidor con recarga automática al guardar cambios |
| `npm run lint` | Revisa el estilo del código con ESLint |

El puerto se toma de la variable de entorno `PORT` y, si no está definida, se
usa el 3000 de forma predeterminada.
