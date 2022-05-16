import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

//Encrypting text
export const encrypt = ({
  text,
  key = crypto.randomBytes(32),
  iv = crypto.randomBytes(16),
}) => {
  if (!text) throw new Error('text doesn\'t specified!');
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final()
  ]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
    key: key.toString('hex'),
  };
};

// Decrypting text
export const decrypt = ({
  encryptedData,
  iv = crypto.randomBytes(16),
  key = crypto.randomBytes(32),
}) => {
  if (!encryptedData) throw new Error('encryptedData doesn\'t specified!');

  const keyBuff = Buffer.from(key, 'hex');
  const ivBuff = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyBuff), ivBuff);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);
  return decrypted.toString();
};