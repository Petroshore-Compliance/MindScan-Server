const fs = require("fs");
const path = require("path");
const jose = require("jose");

// Load keys
const privateKey = fs.readFileSync(path.join(__dirname, "private.pem"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "public.pem"), "utf8");

// Encrypt a JWT using JWE
async function encryptJWT(payload) {
  const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
    .setProtectedHeader({ alg: "RSA-OAEP", enc: "A256GCM" }) // RSA-OAEP + AES-GCM
    .encrypt(await jose.importSPKI(publicKey, "RSA-OAEP"));

  return jwe; // Encrypted token
}

// Decrypt a JWE token
async function decryptJWT(token) {
  const { plaintext } = await jose.compactDecrypt(
    token,
    await jose.importPKCS8(privateKey, "RSA-OAEP")
  );

  return JSON.parse(new TextDecoder().decode(plaintext)); // Decrypted payload
}

module.exports = { encryptJWT, decryptJWT };
