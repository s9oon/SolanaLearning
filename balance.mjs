import { address, createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const account = address("GeBW6LUYpfPQeDaHqAFLfJCLpBGMquecfi5d7gNu1oM4");

const balance = await rpc.getBalance(account).send();

const lamports = balance.value;
const sol = Number(lamports) / 1_000_000_000;

console.log("Lamports:", lamports.toString());
console.log("SOL:", sol);