import { createSolanaRpc } from "@solana/kit";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const slot = await rpc.getSlot().send();

console.log(slot);