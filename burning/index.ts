import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import "dotenv/config"
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers"

const payer = getKeypairFromEnvironment("PRIVATE_KEY")
const tokenMintAddress = new web3.PublicKey("9djQYHX62Fz5ZBuD1FzxH3VA7WsPVqLJ8b6hgH2HSLCq")
const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
const payerAta = await token.getOrCreateAssociatedTokenAccount(connection, payer, tokenMintAddress, payer.publicKey, true)

const tx = await token.burn(connection, payer, payerAta.address, tokenMintAddress, payer.publicKey, 500);
console.log(getExplorerLink("address", tx, "devnet"))