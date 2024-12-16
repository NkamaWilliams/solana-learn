"use client"
import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const endpoint = clusterApiUrl("devnet")
  const wallets = useMemo(() => [], [])
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="m-2 flex justify-end">
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </div>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Provider