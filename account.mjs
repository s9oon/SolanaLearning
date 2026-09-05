// new-account.mjs
import { createSolanaRpc, address, lamports } from "@solana/kit";
import { writeFileSync } from "fs";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

// Generate keypair
const keypair = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
const publicKeyBytes = new Uint8Array(await crypto.subtle.exportKey("raw", keypair.publicKey));
const jwk = await crypto.subtle.exportKey("jwk", keypair.privateKey);
const privateKeyBytes = new Uint8Array(Buffer.from(jwk.d, "base64"));
const keypairBytes = new Uint8Array([...privateKeyBytes, ...publicKeyBytes]);

// Derive address
const { getAddressFromPublicKey } = await import("@solana/kit");
const addr = await getAddressFromPublicKey(keypair.publicKey);

// Save keypair
writeFileSync("new-keypair.json", JSON.stringify(Array.from(keypairBytes)));
console.log("Saved to new-keypair.json");
console.log("Address:", addr);