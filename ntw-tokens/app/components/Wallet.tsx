"use client"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react"
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [], [])
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={wallets}>
        <main className="m-2 flex justify-between gap-3 relative">
          <h1 className="text-3xl font-bold uppercase">Token Program</h1>
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </main>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}