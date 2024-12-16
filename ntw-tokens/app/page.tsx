"use client"
import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const [balance, setBalance] = useState(1)
  const [mint1, setMint1] = useState("")
  const [mint2, setMint2] = useState("")
  const [owner, setOwner] = useState("")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const connection = useConnection()
  const wallet = useWallet()

  return (
    <div className="min-h-screen my-4 flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl my-2">Sol Balance: {balance} SOL</h1>

      <h1 className="text-3xl my-2">Token Mint:</h1>
      <Input value={mint1} setValue={setMint1} placeholder="Enter Token Mint" />

      <h1 className="text-3xl my-2">Token Account Owner:</h1>
      <Input value={owner} setValue={setOwner} placeholder="Enter Token Account Owner Pubkey" />

      <h1 className="text-3xl my-2">Token Mint:</h1>
      <Input value={mint2} setValue={setMint2} placeholder="Enter Token Mint" />

      <h1 className="text-3xl my-2">Recipient:</h1>
      <Input value={recipient} setValue={setRecipient} placeholder="Enter Recipient Pubkey" />

      <h1 className="text-3xl my-2">Amount Tokens to Mint:</h1>
      <Input value={amount} setValue={setAmount} placeholder="e.g. 100" pattern="\d+" />
    </div>
  );
}

const Input = ({ value, setValue, placeholder, pattern = "" }: { value: string, setValue: React.Dispatch<React.SetStateAction<string>>, placeholder: string, pattern?: string }) => {
  return (
    <div className="mx-auto max-w-[400px] w-full">
      <input
        className="block w-full h-[40px] py-2 px-3 text-black"
        type="text"
        value={value}
        placeholder={placeholder}
        pattern={pattern}
        required
        onChange={(e) => setValue(e.target.value)} />
    </div>
  )
}