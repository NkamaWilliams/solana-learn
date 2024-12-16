import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

const getPublicKey = (key: string): PublicKey => {
  try {
    const publicKey = new PublicKey(key)
    return publicKey
  } catch {
    throw new Error(`Key: ${key} is an invalid public key`)
  }
}

const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
const publicKey = getPublicKey("aa")
const balance = await connection.getBalance(publicKey)
console.log("✅ Connected!")
console.log(`Balance: ${balance / LAMPORTS_PER_SOL}sol`)