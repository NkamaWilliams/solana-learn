"use client"
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Connection, SystemProgram, LAMPORTS_PER_SOL, Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";

export default function Home() {
  const [balance, setBalance] = useState("")
  const [amount, setAmount] = useState("")
  const [receiver, setReceiver] = useState("")
  const [data, setData] = useState<Buffer>()
  const { connection } = useConnection()
  const wallet = useWallet()
  const pingProgram = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
  const pingProgramData = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")
  const simplify = (publicKey: string) => {
    return publicKey.slice(0, 5) + "..." + publicKey.slice(publicKey.length - 2)
  }
  const updateBalance = async () => {
    if (!connection || !wallet.publicKey) {
      console.log("Wallet not connected or connection unavailable")
      return
    }
    try {
      connection.onAccountChange(wallet.publicKey,
        updatedInfo => {
          setBalance(`${(updatedInfo.lamports / LAMPORTS_PER_SOL).toFixed(3)} sol`)
        })

      const accInfo = await connection.getAccountInfo(wallet.publicKey)

      if (accInfo) {
        setBalance(`${(accInfo.lamports / LAMPORTS_PER_SOL).toFixed(3)} sol`)
      } else {
        throw new Error("Account info not found")
      }
    } catch (err) {
      console.error("Failed to retrieve account info")
    }
  }
  const parseAmount = (amount: string) => {
    const pattern = /^\d+((\.\d+)|(\.))?$/
    if (pattern.test(amount)) {
      return amount
    }
    return "0"
  }
  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    const transaction = new Transaction()

    if (!connection || !wallet.publicKey) {
      console.log("Wallet not connected or connection unavailable")
      return
    }

    try {
      const to = new PublicKey(receiver)
      const instruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: to,
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL
      })
      transaction.add(instruction)
      const tx = await wallet.sendTransaction(transaction, connection)
      console.log(tx)
    } catch (err) {
      console.error("Failed to send sol")
    } finally {
      setAmount("0")
      setReceiver("")
    }
  }
  const updatePing = async () => {
    if (!connection && !wallet.publicKey) {
      console.log("Wallet not connected or connection unavailable")
      return
    }
    try {
      connection.onAccountChange(
        pingProgramData,
        info => {
          console.log(info.data)
          setData(info.data)
        }
      )

      const pingInfo = await connection.getAccountInfo(pingProgramData)
      if (pingInfo) {
        console.log("Ping Info")
        console.log(pingInfo.data)
        setData(pingInfo.data)
      } else {
        console.log("Unable to get ping info")
      }
    } catch (err) {
      console.error("Error getting ping info")
    }
  }
  const handlePing = async () => {
    const transaction = new Transaction()
    if (!connection && !wallet.publicKey) {
      console.log("Wallet not connected or connection unavailable")
      return
    }

    try {
      const instruction = new TransactionInstruction({
        programId: pingProgram,
        keys: [
          {
            pubkey: pingProgramData,
            isSigner: false,
            isWritable: true
          }
        ]
      })
      transaction.add(instruction)
      const tx = await wallet.sendTransaction(transaction, connection)
      console.log(tx)
    } catch (err) {
      console.error("Failed to ping program")
      console.error(err)
    }
  }
  useEffect(() => {
    updateBalance()
  }, [wallet.publicKey, connection])
  useEffect(() => {
    updatePing()
  }, [connection])
  return (
    <div className="flex flex-col min-h-screen items-between justify-around">
      <main className="w-full flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
        <h1 className="w-full text-4xl text-center font-bold">Solana Controller</h1>

        <div className="m-auto w-full max-w-[500px] flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 text-center">
            <p className="font-bold text-base">Wallet Address</p>
            <p>{wallet.connected ? simplify(wallet.publicKey?.toString() ?? "") : "No wallet connected"}</p>
          </div>

          <div className="flex-1 text-center">
            <p className="font-bold text-base">Wallet Balance</p>
            <p>{balance == "" ? "Not currently available" : balance}</p>
          </div>
        </div>

        <h2 className="w-full text-2xl text-center font-semibold">Send Sol</h2>
        <div className="m-auto w-full max-w-[250px]">
          <form onSubmit={handleSend}>
            <label>Amount:</label>
            <input
              className="block w-full px-4 py-2 text-black mb-2"
              required
              type="string"
              value={amount}
              min={0}
              onChange={(e) => setAmount(parseAmount(e.target.value))}
            />

            <label>Receiver Address:</label>
            <input
              className="block w-full px-4 py-2 text-black mb-2"
              required
              type="string"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />

            <button
              className="block w-full px-4 py-2 bg-purple-700 hover:bg-purple-500 text-white font-semibold"
            >Send</button>
          </form>
        </div>

        <h2 className="w-full text-2xl text-center font-semibold">Ping Program</h2>
        <div className="m-auto w-full max-w-[250px]">
          <p>Counter: {data?.readUint32LE(0)}</p>
          <button
            className="block w-full px-4 py-2 bg-purple-700 hover:bg-purple-500 text-white font-semibold"
            onClick={handlePing}
          >Ping</button>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
