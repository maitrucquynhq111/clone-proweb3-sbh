import { Buffer } from 'buffer';
import crypto from 'crypto';
import { SECRET_KEY } from '~app/configs';

const algorithm = 'aes-256-gcm';
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;

export function encrypt(message: string) {
  const iv = Buffer.from(crypto.randomBytes(IV_LEN));
  const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv, {
    authTagLength: AUTH_TAG_LEN,
  });
  const encryptedData = Buffer.concat([cipher.update(message), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const raw = Buffer.concat([iv, encryptedData, authTag]).toString('hex');
  return raw;
}

function base64URLEncode(str: Buffer) {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function sha256(buffer: ExpectedAny) {
  return crypto.createHash('sha256').update(buffer).digest();
}

export function generateZaloCodeChallenge() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  return { verifier, challenge };
}
