function log(level, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    level: typeof level === 'string' ? level.toUpperCase() : 'INFO',
    traceId: data.traceId ?? null,
    operation: data.operation ?? null,
    message: data.message ?? null,
    status: data.status ?? null,
    sessionId: data.sessionId ?? null,
    errorCode: data.errorCode ?? null,

    httpStatus: data.httpStatus ?? null,
    durationMs: data.durationMs ?? null,
  };

  delete logEntry.password;
  delete logEntry.password_hash;
  delete logEntry.token;
  delete logEntry.encryptionKey;

  console.log(JSON.stringify(logEntry));
}

module.exports = { log };
