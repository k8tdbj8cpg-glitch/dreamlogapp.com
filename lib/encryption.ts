/**
 * End-to-end encryption utilities using the Web Crypto API (AES-GCM).
 *
 * Premium-only feature restricted to U.S. users. Keys are never sent to the
 * server; all encryption and decryption happens exclusively in the browser.
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM
const PBKDF2_ITERATIONS = 600_000;
const PBKDF2_HASH = "SHA-256";
const SALT_LENGTH = 16;

function getCrypto(): Crypto {
  if (typeof globalThis.crypto === "undefined") {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  return globalThis.crypto;
}

/** Generate a new AES-GCM encryption key. */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await getCrypto().subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Derive a deterministic AES-GCM key from a password and salt using PBKDF2.
 * Use `generateSalt()` to create a fresh salt when setting up a new key.
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const subtle = getCrypto().subtle;
  const enc = new TextEncoder();

  const baseKey = await subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

/** Generate a cryptographically random salt for PBKDF2. */
export function generateSalt(): Uint8Array {
  return getCrypto().getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Export a CryptoKey to a base-64 string for storage.
 * Store the result in a secure location (e.g. encrypted localStorage).
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await getCrypto().subtle.exportKey("raw", key);
  return bufferToBase64(raw);
}

/**
 * Import a base-64 encoded AES-GCM key previously produced by `exportKey`.
 */
export async function importKey(base64Key: string): Promise<CryptoKey> {
  const raw = base64ToBuffer(base64Key);
  return await getCrypto().subtle.importKey(
    "raw",
    raw,
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a UTF-8 string with the supplied AES-GCM key.
 *
 * Returns a base-64 encoded string that prefixes the random IV so that the
 * same value can later be passed to `decrypt`.
 */
export async function encrypt(
  plaintext: string,
  key: CryptoKey
): Promise<string> {
  const subtle = getCrypto().subtle;
  const enc = new TextEncoder();
  const iv = getCrypto().getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(plaintext)
  );

  // Prepend IV to ciphertext so it travels together.
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  return bufferToBase64(combined.buffer as ArrayBuffer);
}

/**
 * Decrypt a base-64 encoded ciphertext produced by `encrypt`.
 *
 * Returns the original UTF-8 plaintext string.
 */
export async function decrypt(
  ciphertext: string,
  key: CryptoKey
): Promise<string> {
  const subtle = getCrypto().subtle;
  const combined = new Uint8Array(base64ToBuffer(ciphertext));

  const iv = combined.slice(0, IV_LENGTH);
  const data = combined.slice(IV_LENGTH);

  const plaintext = await subtle.decrypt({ name: ALGORITHM, iv }, key, data);

  return new TextDecoder().decode(plaintext);
}

// ---------------------------------------------------------------------------
// Internal helpers (also exported for reuse in other encryption-adjacent code)
// ---------------------------------------------------------------------------

export function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(
    Array.from(new Uint8Array(buffer))
      .map((byte) => String.fromCharCode(byte))
      .join("")
  );
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0)).buffer;
}
