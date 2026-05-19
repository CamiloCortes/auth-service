const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redisClient');
const { encrypt, decrypt } = require('../utils/cryptoService');
const ttl = parseInt(process.env.SESSION_TTL_SECONDS) || 3600;
async function createSession(userData) {
  const sessionId = uuidv4();

  const sessionData = {
    ...userData,
    sessionId,
    createdAt: new Date().toISOString(),
  };

  const encrypted = encrypt(sessionData);

  const ttl = parseInt(process.env.SESSION_TTL_SECONDS);

  await redisClient.setex(`session:${sessionId}`, ttl, encrypted);

  return sessionId;
}

async function getSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  const encrypted = await redisClient.get(`session:${sessionId}`);

  if (!encrypted) {
    return null;
  }

  const sessionData = decrypt(encrypted);
  return sessionData;
}

async function deleteSession(sessionId) {
  if (!sessionId) {
    return;
  }

  await redisClient.del(`session:${sessionId}`);
}

module.exports = { createSession, getSession, deleteSession };
