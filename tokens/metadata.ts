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
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata"

const connection = new Connection(clusterApiUrl("devnet"))
const owner = getKeypairFromEnvironment("PRIVATE_KEY")
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

const tokenMint = new PublicKey("9djQYHX62Fz5ZBuD1FzxH3VA7WsPVqLJ8b6hgH2HSLCq")

const metadataData = {
  name: "The One Token",
  symbol: "ToT",
  uri: "",
  sellerFeeBasisPoints: 100,
  creators: null,
  collection: null,
  uses: null,
}

const metadataPDAandBump = PublicKey.findProgramAddressSync([Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()], TOKEN_METADATA_PROGRAM_ID)

const transaction = new Transaction()
const instruction = createCreateMetadataAccountV3Instruction({
  metadata: metadataPDAandBump[0],
  mint: tokenMint,
  mintAuthority: owner.publicKey,
  payer: owner.publicKey,
  updateAuthority: owner.publicKey
},
  {
    createMetadataAccountArgsV3: {
      collectionDetails: null,
      data: metadataData,
      isMutable: true
    }
  }
)

transaction.add(instruction)

const tx = await sendAndConfirmTransaction(connection, transaction, [owner])
const link = getExplorerLink("address", tx.toString(), "devnet")
console.log("Metadata created successfully: " + link)