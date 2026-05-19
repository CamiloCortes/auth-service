const { log } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Error interno del servidor';
  const responseMessage = status === 500 ? 'Error interno del servidor' : message;

  log('error', {
    traceId: req.traceId ?? null,
    sessionId: req.sessionId ?? null,
    operation: 'ERROR_HANDLER',
    message: message,
    status: 'ERROR',
    httpStatus: status,
    errorCode,
  });

  res.status(status).json({
    errorCode,
    message: responseMessage,
  });
}

module.exports = errorHandler;
