/**
 * Client-Side End-to-End Encryption (E2EE) Utility
 * 
 * Uses the native Web Crypto API (window.crypto.subtle) to ensure
 * zero-knowledge encryption before PHI leaves the browser.
 */

// Convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derives a cryptographic key from a given password and salt using PBKDF2.
 * @param password The vault password or passphrase.
 * @param salt A unique salt for the user (e.g., their user ID or a random string).
 * @returns CryptoKey for AES-GCM.
 */
export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string using AES-GCM.
 * @param key The CryptoKey derived via deriveKey().
 * @param plaintext The unencrypted PHI data.
 * @returns Object containing Base64 encoded ciphertext and initialization vector (IV).
 */
export async function encryptData(key: CryptoKey, plaintext: string): Promise<{ ciphertextBase64: string, ivBase64: string }> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    enc.encode(plaintext)
  );

  return {
    ciphertextBase64: arrayBufferToBase64(encryptedBuffer),
    ivBase64: arrayBufferToBase64(iv.buffer)
  };
}

/**
 * Decrypts ciphertext back to a plaintext string using AES-GCM.
 * @param key The CryptoKey derived via deriveKey().
 * @param ciphertextBase64 The Base64 encoded ciphertext from the backend.
 * @param ivBase64 The Base64 encoded initialization vector from the backend.
 * @returns The decrypted plaintext string.
 */
export async function decryptData(key: CryptoKey, ciphertextBase64: string, ivBase64: string): Promise<string> {
  const encryptedBuffer = base64ToArrayBuffer(ciphertextBase64);
  const ivBuffer = base64ToArrayBuffer(ivBase64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(ivBuffer)
    },
    key,
    encryptedBuffer
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}
