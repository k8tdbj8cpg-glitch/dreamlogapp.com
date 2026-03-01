"use client";

import { useCallback, useEffect, useState } from "react";
import {
  base64ToBuffer,
  bufferToBase64,
  decrypt,
  deriveKeyFromPassword,
  encrypt,
  exportKey,
  generateEncryptionKey,
  generateSalt,
  importKey,
} from "@/lib/encryption";

const KEY_STORAGE_PREFIX = "enc_key:";
const SALT_STORAGE_PREFIX = "enc_salt:";

/**
 * A hook that provides an encrypted localStorage interface.
 *
 * This is a **premium-only** feature. Data is encrypted client-side using
 * AES-GCM before being written to localStorage, ensuring that raw values are
 * never persisted in plaintext.
 *
 * @param namespace - A string used to scope the encryption key stored in
 *   localStorage (e.g. the user's ID).  Each namespace gets its own key so
 *   that different users on the same browser remain isolated.
 * @param password - An optional password used to derive the encryption key via
 *   PBKDF2.  When omitted a random key is generated and stored alongside the
 *   encrypted data.  Providing a password allows the encrypted data to survive
 *   key loss (e.g. clearing localStorage) as long as the same password is
 *   supplied again.
 */
export function useEncryptedStorage(namespace: string, password?: string) {
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initialPassword] = useState<string | undefined>(password);

  // Warn if the password changes after initialization.
  // Changing the password would derive a different key from the same salt,
  // making previously encrypted data inaccessible.
  useEffect(() => {
    if (password !== initialPassword) {
      console.warn(
        "[useEncryptedStorage] The password should not change after initialization. " +
          "Changing the password will make previously encrypted data inaccessible. " +
          "If you need to change the password, you must re-encrypt all data with the new key."
      );
    }
  }, [password, initialPassword]);

  // Initialise (or restore) the encryption key once on mount.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        let key: CryptoKey;

        if (password) {
          // Retrieve or create a salt for this namespace.
          const saltKey = `${SALT_STORAGE_PREFIX}${namespace}`;
          const storedSalt = localStorage.getItem(saltKey);
          let salt: Uint8Array;

          if (storedSalt) {
            salt = new Uint8Array(base64ToBuffer(storedSalt));
          } else {
            salt = generateSalt();
            // Double-check before storing to avoid race condition:
            // another instance may have stored a salt while we were generating ours.
            if (localStorage.getItem(saltKey)) {
              // Another instance stored a salt, use that instead.
              const storedAlternativeSalt = localStorage.getItem(saltKey);
              if (storedAlternativeSalt) {
                salt = new Uint8Array(base64ToBuffer(storedAlternativeSalt));
              }
            } else {
              localStorage.setItem(
                saltKey,
                bufferToBase64(salt.buffer as ArrayBuffer)
              );
            }
          }

          key = await deriveKeyFromPassword(password, salt);
        } else {
          // Retrieve or create a random key for this namespace.
          const keyStorageKey = `${KEY_STORAGE_PREFIX}${namespace}`;
          const storedKey = localStorage.getItem(keyStorageKey);

          if (storedKey) {
            key = await importKey(storedKey);
          } else {
            key = await generateEncryptionKey();
            const exported = await exportKey(key);
            // Double-check before storing to avoid race condition:
            // another instance may have stored a key while we were generating ours.
            if (localStorage.getItem(keyStorageKey)) {
              // Another instance stored a key, use that instead.
              const storedAlternativeKey = localStorage.getItem(keyStorageKey);
              if (storedAlternativeKey) {
                key = await importKey(storedAlternativeKey);
              }
            } else {
              localStorage.setItem(keyStorageKey, exported);
            }
          }
        }

        if (!cancelled) {
          setCryptoKey(key);
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          const initError =
            err instanceof Error
              ? err
              : new Error("[useEncryptedStorage] Unknown initialisation error");
          console.error(
            "[useEncryptedStorage] Failed to initialise key:",
            initError
          );
          setError(initError);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [namespace]);

  /** Encrypt `value` and write it to localStorage under `key`. */
  const setItem = useCallback(
    async (key: string, value: string): Promise<void> => {
      if (!cryptoKey) {
        throw new Error(
          "[useEncryptedStorage] Encryption key not ready. Wait for `ready === true`."
        );
      }
      const ciphertext = await encrypt(value, cryptoKey);
      localStorage.setItem(`${namespace}:${key}`, ciphertext);
    },
    [cryptoKey, namespace]
  );

  /**
   * Read and decrypt the value stored under `key`.
   * Returns `null` if the key does not exist.
   */
  const getItem = useCallback(
    async (key: string): Promise<string | null> => {
      if (!cryptoKey) {
        throw new Error(
          "[useEncryptedStorage] Encryption key not ready. Wait for `ready === true`."
        );
      }
      const ciphertext = localStorage.getItem(`${namespace}:${key}`);
      if (ciphertext === null) {
        return null;
      }
      return decrypt(ciphertext, cryptoKey);
    },
    [cryptoKey, namespace]
  );

  /** Remove an item from encrypted localStorage. */
  const removeItem = useCallback(
    (key: string): void => {
      localStorage.removeItem(`${namespace}:${key}`);
    },
    [namespace]
  );

  return { getItem, setItem, removeItem, ready, error };
}
