const authService = require('../services/authService');
const { log } = require('../utils/logger');

async function register(req, res, next) {
  const start = Date.now();

  try {
    const requiredFields = [
      'numeroDocumento',
      'tipoDocumento',
      'nombre',
      'apellido',
      'email',
      'numeroCelular',
      'username',
      'password',
    ];

    const missingFields = requiredFields.filter((field) => !req.body?.[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        errorCode: 'MISSING_FIELDS',
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
      });
    }

    const userData = {
      numeroDocumento: req.body.numeroDocumento,
      tipoDocumento: req.body.tipoDocumento,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      numeroCelular: req.body.numeroCelular,
      username: req.body.username,
      password: req.body.password,
    };

    const createdUser = await authService.register(userData, req.traceId);

    const durationMs = Date.now() - start;
    log('info', {
      traceId: req.traceId ?? null,
      operation: 'REGISTER',
      message: 'Registro de usuario exitoso',
      status: 'SUCCESS',
      httpStatus: 201,
      durationMs,
      userId: createdUser.userId ?? null,
      username: createdUser.username ?? null,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const start = Date.now();

  try {
    const { username, password } = req.body || {};

    const result = await authService.login(username, password, req.traceId);

    const durationMs = Date.now() - start;
    log('info', {
      traceId: req.traceId ?? null,
      operation: 'LOGIN',
      message: 'Login exitoso',
      status: 'SUCCESS',
      httpStatus: 200,
      durationMs,
      userId: result.userId ?? null,
      username: result.username ?? null,
      sessionId: result.sessionId,
    });

    return res.status(200).json(result);
  } catch (error) {
      log('warn', {
    traceId: req.traceId,
    operation: 'LOGIN',
    message: 'Intento de login fallido',
    status: 'ERROR',
    username: req.body?.username ?? null,
    durationMs: Date.now() - start,
    errorCode: error.code ?? 'UNKNOWN'
  });
  next(error);
  }
}

async function logout(req, res, next) {
  const start = Date.now();

  try {
    const sessionId = req.sessionId;
    await authService.logout(sessionId, req.traceId);

    const durationMs = Date.now() - start;
    log('info', {
      traceId: req.traceId ?? null,
      operation: 'LOGOUT',
      message: 'Logout exitoso',
      status: 'SUCCESS',
      httpStatus: 200,
      durationMs,
      sessionId,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
