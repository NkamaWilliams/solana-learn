import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import { clusterApiUrl, Connection } from "@solana/web3.js"
import { keypairIdentity, createGenericFile } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import * as path from "path"
import { promises as fs } from "fs"
import "dotenv/config"

const payer = getKeypairFromEnvironment("PRIVATE_KEY")
const connection = new Connection(clusterApiUrl("devnet"))
const umi = createUmi(connection)

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(payer.secretKey)

umi
  .use(irysUploader())
  .use(keypairIdentity(umiKeypair))

const collectionImagePath = path.resolve(__dirname, "./assets/nature.png")
console.log("Image path: ", collectionImagePath)

const buffer = await fs.readFile(collectionImagePath)
let file = createGenericFile(buffer, "Mysteries", {
  contentType: "image/png",
})
const [image] = await umi.uploader.upload([file])
console.log(`Image URI: ${image}`)