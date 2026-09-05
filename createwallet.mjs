// createwallet.mjs
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { createInterface } from "readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));
const expand = (p) => p.startsWith("~/") ? p.replace("~", process.env.HOME) : p;

const kp = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"]);
const pub = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
const jwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
const priv = new Uint8Array(Buffer.from(jwk.d, "base64"));
const full = new Uint8Array([...priv, ...pub]);

const { getAddressFromPublicKey } = await import("@solana/kit");
const address = await getAddressFromPublicKey(kp.publicKey);

const now = new Date();
const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;

// Ask where to save the keypair
const keypairDir = await ask("Save keypair to: ");
const keypairPath = resolve(process.cwd(), expand(keypairDir));
mkdirSync(keypairPath, { recursive: true });
const keypairFile = join(keypairPath, `keypair-${ts}.json`);
writeFileSync(keypairFile, JSON.stringify(Array.from(full)));

// Ask where to save the wallet object (optional)
const walletDir = await ask("Save wallet object to (or press Enter to skip): ");
let walletFile = null;
if (walletDir.trim()) {
  const walletPath = resolve(process.cwd(), expand(walletDir));
  mkdirSync(walletPath, { recursive: true });
  walletFile = join(walletPath, `wallet-${ts}.json`);
  writeFileSync(walletFile, JSON.stringify({
    address,
    keypair: Array.from(full),
    keypairFile,
    createdAt: now.toISOString(),
  }, null, 2));
}

rl.close();

console.log(JSON.stringify({
  address,
  keypairFile,
  walletFile,
}, null, 2));   