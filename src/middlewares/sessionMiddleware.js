const { getSession } = require('../services/sessionService');
const { log } = require('../utils/logger');

async function validateSession(req, res, next) {
  try {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
      return res.status(401).json({ errorCode: 'SESSION_MISSING', message: 'SessionId requerido' });
    }

    const sessionData = await getSession(sessionId);

    if (!sessionData) {
      log('warn', {
        traceId: req.traceId ?? null,
        sessionId,
        operation: 'VALIDATE_SESSION',
        message: 'Sesión expirada o inexistente',
        status: 'ERROR',
        httpStatus: 401,
        errorCode: 'SESSION_EXPIRED',
      });

      return res.status(401).json({ errorCode: 'SESSION_EXPIRED', message: 'Sesión expirada o inválida' });
    }

    req.user = sessionData;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validateSession };
