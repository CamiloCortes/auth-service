const { v4: uuidv4 } = require('uuid');

function traceMiddleware(req, res, next) {
  const incomingTraceId = req.headers['x-trace-id'];

  const traceId = incomingTraceId || uuidv4();

  req.traceId = traceId;

  res.setHeader('x-trace-id', traceId);

  next();
}

module.exports = traceMiddleware;
