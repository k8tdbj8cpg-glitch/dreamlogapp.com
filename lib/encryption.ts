// lib/encryption.ts - Updated to fix PBKDF2 salt type error and resolve lint errors.

import { createCipheriv, createDecipheriv, randomBytes, scrypt as scryptSync } from 'crypto';

function deriveKey(password: string, salt: Uint8Array, iterations: number = 100000) {
    const saltBuffer = salt.buffer as ArrayBuffer;
    return new Promise<Buffer>((resolve, reject) => {
        scryptSync(password, saltBuffer, 32, (err, key) => {
            if (err) reject(err);
            resolve(key);
        });
    });
}

export function encrypt(text: string, password: string) {
    const iv = randomBytes(16);
    const salt = randomBytes(32);
    return deriveKey(password, salt).then((key) => {
        const cipher = createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { iv: iv.toString('hex'), salt: salt.toString('hex'), encrypted }; 
    });
}

export function decrypt(encryptedData: { iv: string, salt: string, encrypted: string }, password: string) {
    const { iv, salt, encrypted } = encryptedData;
    const ivBuffer = Buffer.from(iv, 'hex');
    const saltBuffer = Buffer.from(salt, 'hex');
    return deriveKey(password, saltBuffer).then((key) => {
        const decipher = createDecipheriv('aes-256-cbc', key, ivBuffer);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    });
}