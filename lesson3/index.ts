import "dotenv/config"
import { getKeypairFromEnvironment } from "./node_modules/@solana-developers/helpers/dist/types/index"
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram
} from "./node_modules/@solana/web3.js/lib/index"

const receiver = process.argv[2] || null

const connection = new Connection(clusterApiUrl("devnet"))
const from = new PublicKey("CKujbKMcyCcm3ktLKP3MWt4GcyofNJMHZaHFQEsziKQx")
const fromKeypair = getKeypairFromEnvironment("PRIVATE_KEY")
const to = new PublicKey("3n6pfQFyuSUzqrNUtaXA2Z1tYEN3VYXGLE3b8SzqkyXX")
const transaction = new Transaction()

const solTransfer = SystemProgram.transfer({
  fromPubkey: from,
  toPubkey: to,
  lamports: 0.005 * LAMPORTS_PER_SOL
})

transaction.add(solTransfer)

const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair])
console.log(`TX: ${signature}`)