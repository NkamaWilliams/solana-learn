import "dotenv/config";
import { Keypair } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers"

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(`The public key is ${keypair.publicKey.toBase58()}`)
console.log(`The secret key is ${keypair.secretKey} length of ${keypair.secretKey.length}`)