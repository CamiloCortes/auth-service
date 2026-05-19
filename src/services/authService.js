const axios = require('axios');
const { createSession, deleteSession } = require('./sessionService');
const { log } = require('../utils/logger');

const CORE_USUARIOS_URL = process.env.CORE_USUARIOS_URL;

function buildCoreError(error) {
  if (error.response) {
    const err = new Error(error.response.data?.message || 'Error del servicio');
    err.status = error.response.status;
    err.code = error.response.data?.errorCode || 'CORE_ERROR';
    return err;
  }

  const err = new Error('No se pudo conectar al Core Usuarios');
  err.status = 503;
  err.code = 'CORE_UNAVAILABLE';
  return err;
}

async function register(userData, traceId) {
  try {
    const response = await axios.post(
      `${CORE_USUARIOS_URL}/core1/users/register`,
      userData,
      {
        headers: {
          'x-trace-id': traceId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw buildCoreError(error);
  }
}

async function login(username, password, traceId) {
  try {
    const response = await axios.post(
      `${CORE_USUARIOS_URL}/core1/users/login`,
      { username, password },
      {
        headers: {
          'x-trace-id': traceId,
        },
      }
    );

    const user = response.data;

    const sessionPayload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      numeroCelular: user.numeroCelular,
      estado: user.estado,
    };

    const sessionId = await createSession(sessionPayload);

    return {
      sessionId,
      userId: user.userId,
      username: user.username,
      email: user.email,
      estado: user.estado,
    };
  } catch (error) {
    throw buildCoreError(error);
  }
}

async function logout(sessionId, traceId) {
  await deleteSession(sessionId);

  log('info', {
    traceId: traceId ?? null,
    sessionId,
    operation: 'LOGOUT',
    message: 'Sesión eliminada',
    status: 'SUCCESS',
    httpStatus: 200,
  });

  return { success: true };
}

module.exports = { register, login, logout };
