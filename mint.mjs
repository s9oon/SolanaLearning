// mint.mjs
import { createClient, generateKeyPairSigner, lamports } from "@solana/kit";
import { solanaRpc } from "@solana/kit-plugin-rpc";
import { signerFromFile } from "@solana/kit-plugin-signer";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  fetchMint,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS
} from "@solana-program/token";

export default async function createMint() {
  const client = await createClient()
    .use(signerFromFile("./new-keypair.json"))   // ← your payer (has the 1 SOL)
    .use(solanaRpc({
      rpcUrl: "https://devnet.helius-rpc.com/?api-key=8a5c7638-6ea9-4c44-ab3c-b1e2c86de59c",
      rpcSubscriptionsUrl: "wss://devnet.helius-rpc.com/?api-key=8a5c7638-6ea9-4c44-ab3c-b1e2c86de59c"
    }));

  const mint = await generateKeyPairSigner();    // ← CA generated here (line 19)
  const space = BigInt(getMintSize());
  const rent = await client.rpc.getMinimumBalanceForRentExemption(space).send();

  const result = await client.sendTransaction([
    getCreateAccountInstruction({
      payer: client.payer,                        // ← payer funds it
      newAccount: mint,                           // ← CA used here (line 25)
      lamports: rent,
      space,
      programAddress: TOKEN_PROGRAM_ADDRESS
    }),
    getInitializeMintInstruction({
      mint: mint.address,                         // ← CA used here (line 31)
      decimals: 9,
      mintAuthority: client.payer.address,
      freezeAuthority: client.payer.address
    })
  ]);

  const mintAccount = await fetchMint(client.rpc, mint.address);  // ← CA used here (line 37)
  return { mintAddress: mint.address, mintAccount: mintAccount.data, signature: result.context.signature };
}

const result = await createMint();
console.log("Mint Address (CA):", result.mintAddress);
console.log("Signature:", result.signature);   