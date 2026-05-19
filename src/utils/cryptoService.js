const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

if (!process.env.SESSION_ENCRYPTION_KEY) {
  throw new Error('SESSION_ENCRYPTION_KEY no está configurada');
}

function encrypt(data) {
 
  const iv = crypto.randomBytes(16);
  
  const key = Buffer.from(process.env.SESSION_ENCRYPTION_KEY, 'hex');

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const stringData = JSON.stringify(data);


  const encrypted = cipher.update(stringData, 'utf8', 'hex') + cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(encryptedData) {

  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  
  const key = Buffer.from(process.env.SESSION_ENCRYPTION_KEY, 'hex');

  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

  const data = JSON.parse(decrypted);

  return data;
}

module.exports = { encrypt, decrypt };
