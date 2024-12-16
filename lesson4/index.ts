import "dotenv/config"
import {
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction
} from "@solana/web3.js"
import { getKeypairFromEnvironment } from "@solana-developers/helpers"

const keypair = getKeypairFromEnvironment("PRIVATE_KEY")
const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
const program = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
const programData = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")
const transaction = new Transaction()

const instruction = new TransactionInstruction({
  programId: program,
  keys: [
    {
      pubkey: programData,
      isSigner: false,
      isWritable: true
    }
  ]
})

transaction.add(instruction)
const signature = await sendAndConfirmTransaction(connection, transaction, [keypair])
console.log(`TX: ${signature}`)