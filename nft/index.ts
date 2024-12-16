import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata"
import { createGenericFile, generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers"
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { promises as fs } from "fs"
import * as path from "path"
import "dotenv/config"

const payer = getKeypairFromEnvironment("PRIVATE_KEY")
const connection = new Connection(clusterApiUrl("devnet"))
const umi = createUmi(connection)

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(payer.secretKey)

umi
  .use(keypairIdentity(umiKeypair))
  .use(mplTokenMetadata())
  .use(irysUploader())

const collectionImagePath = path.resolve(__dirname, "mysteries.png")

const buffer = await fs.readFile(collectionImagePath)
let file = createGenericFile(buffer, collectionImagePath, {
  contentType: "image/png"
})
const [image] = await umi.uploader.upload([file])
console.log(`Image URI: ${image}`)

const uri = await umi.uploader.uploadJson({
  name: "NTW Mysteries",
  symbol: "MYST",
  description: "In the height, and below the depth, the mist hides the workings of the real",
  image
})
console.log(`Collection metadata uri: ${uri}`)

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: "Mysteries Collection S2",
  symbol: "MYST",
  uri,
  updateAuthority: umi.identity.publicKey,
  sellerFeeBasisPoints: percentAmount(5),
  isCollection: true
}).sendAndConfirm(umi, { send: { commitment: "finalized" } })

let explorerLink = getExplorerLink("address", collectionMint.publicKey, "devnet")
console.log(`Collection NFT: ${explorerLink}`)
console.log(`Collection NFT address is: ${collectionMint.publicKey}`)
console.log("Finished Successfully!")

// Image URI: https://arweave.net/AXtQYwoizEnzjp1jpZskLhGmZjCW7bRkKH4ceC8pX5Ua
// Collection metadata uri: https://arweave.net/Dx9JTMiLi11k2gWh22AwgLPNrjCSa8fMXzZBRwnfsmWx
// Collection NFT: https://explorer.solana.com/address/AxD4g1KFofftPmXGvYp7KYQAbt5q14f7GNUy1KUT4zzk?cluster=devnet
// Collection NFT address is: AxD4g1KFofftPmXGvYp7KYQAbt5q14f7GNUy1KUT4zzk
// Finished Successfully!