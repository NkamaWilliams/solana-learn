import "dotenv/config"
import * as token from "@solana/spl-token"
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers"
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js"

const connection = new Connection(clusterApiUrl("devnet"))
const owner = getKeypairFromEnvironment("PRIVATE_KEY")

const tokenMint = await token.createMint(connection, owner, owner.publicKey, owner.publicKey, 1)

const link = getExplorerLink("address", tokenMint.toString(), "devnet")

console.log("Successfully created token mint: " + link)