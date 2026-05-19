# Auth Service

Servicio de autenticación para backend , basado en Express y Redis.

Este proyecto expone endpoints de registro, login y logout, y delega la validación de credenciales al servicio externo de Core Usuarios. Las sesiones se almacenan en Redis en forma cifrada.

## Características

- Registro de usuarios mediante POST `/auth/register`
- Login de usuarios mediante POST `/auth/login`
- Logout con validación de sesión mediante POST `/auth/logout`
- Almacenamiento de sesiones en Redis
- Cifrado de sesiones con AES-256-GCM
- Propagación de `x-trace-id` para trazabilidad
- Manejo centralizado de errores

## Requisitos

- Node.js 18+ o compatible
- Redis accesible desde la aplicación
- Variables de entorno configuradas

## Instalación

1. Clonar el repositorio

```bash
git clone <repo-url>
cd auth-service
```

2. Instalar dependencias

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto y definir las siguientes variables:

```env
PORT=3001
FRONT_ALLOWED_ORIGIN=http://localhost:3000
CORE_USUARIOS_URL=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
SESSION_TTL_SECONDS=3600
SESSION_ENCRYPTION_KEY=<clave-hex-256-bits>
```

- `PORT`: puerto donde correrá el servicio.
- `FRONT_ALLOWED_ORIGIN`: origen permitido para CORS.
- `CORE_USUARIOS_URL`: URL base del servicio Core Usuarios.
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: configuración de Redis.
- `SESSION_TTL_SECONDS`: tiempo de vida de la sesión en Redis (en segundos).
- `SESSION_ENCRYPTION_KEY`: clave de cifrado en formato hexadecimal para AES-256-GCM (64 caracteres hex). 

> `SESSION_ENCRYPTION_KEY` debe ser una cadena hex válida de 32 bytes (64 caracteres).

## Uso

Iniciar la aplicación:

```bash
node src/app.js
```

El servicio quedará escuchando en `http://localhost:3001` (o el puerto configurado).

## Endpoints

### POST `/auth/register`

Registra un usuario. El servicio envía la información al Core Usuarios.

Body JSON esperado:

```json
{
  "numeroDocumento": "12345678",
  "tipoDocumento": "CC",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "numeroCelular": "3001234567",
  "username": "juanp",
  "password": "secret"
}
```

Respuesta exitosa: `201 Created`.

### POST `/auth/login`

Inicia sesión del usuario y crea una sesión en Redis.

Body JSON esperado:

```json
{
  "username": "juanp",
  "password": "secret"
}
```

Respuesta exitosa: `200 OK` con `sessionId` y datos mínimos del usuario.

### POST `/auth/logout`

Cierra la sesión activa y elimina los datos de sesión en Redis.

Headers requeridos:

- `x-session-id`: identificador de sesión retornado en el login

Respuesta exitosa: `200 OK`

## Arquitectura

- `src/app.js`: configuración de Express, middlewares y rutas.
- `src/routes/authRoutes.js`: definición de rutas `/auth`.
- `src/controllers/authController.js`: lógica de controladores.
- `src/services/authService.js`: integración con Core Usuarios y manejo de sesión.
- `src/services/sessionService.js`: creación, lectura y eliminación de sesiones en Redis.
- `src/config/redisClient.js`: cliente Redis con `ioredis`.
- `src/middlewares/sessionMiddleware.js`: validación de sesiones.
- `src/middlewares/traceMiddleware.js`: generación y propagación de `x-trace-id`.
- `src/utils/cryptoService.js`: cifrado AES-256-GCM de datos de sesión.
- `src/utils/logger.js`: logs en formato JSON.

## Logs

El servicio imprime logs en consola en formato JSON con campos como:

- `timestamp`
- `service`
- `level`
- `traceId`
- `operation`
- `message`
- `status`
- `httpStatus`

## Notas

- Actualmente no se incluyen tests automatizados.
- El endpoint de Core Usuarios debe estar disponible para registrar y validar credenciales.

## Licencia

Este proyecto está licenciado bajo ISC.
