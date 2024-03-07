import { Wallet, web3, BN } from "@coral-xyz/anchor";
import { Connection, clusterApiUrl, Keypair, PublicKey, VersionedTransaction, Transaction, TransactionSignature } from "@solana/web3.js";
import fs from 'fs';
import * as spl from "@solana/spl-token";
import * as borsh from "@coral-xyz/borsh";
import {UserInfo, ShdwDrive, ShadowFile} from "@shadow-drive/sdk";
import crypto from "crypto";
import nacl from "tweetnacl";
import {fetch as cross_fetch} from "cross-fetch";
import { Message } from "postcss";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export const PROGRAM_ID: web3.PublicKey = new web3.PublicKey(
    "2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ"
  );



export const jupSwapSolToShdwTx = async (wallet : any) => {
    const quoteResponse = await (
        await fetch('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y&amount=10000&slippageBps=50'
        )
      ).json();
    console.log("quoteResponse", quoteResponse);

    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: 'auto',
          })
        })
      ).json();
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    // console.log("jup transaction", transaction);
    return transaction;
    
}

export const humanSizeToBytes = async (input: string) => {
    const UNITS = ["kb", "mb", "gb"];
    let chunk_size = 0;
    let humanReadable = input.toLowerCase();
    let inputNumber = Number(humanReadable.slice(0, humanReadable.length - 2));
    let inputDescriptor = humanReadable.slice(humanReadable.length - 2, humanReadable.length);
    if (!UNITS.includes(inputDescriptor) || !inputNumber) {
        return false;
    }
    switch (inputDescriptor) {
        case "kb":
            chunk_size = 1024;
            break;
        case "mb":
            chunk_size = 1048576;
            break;
        case "gb":
            chunk_size = 1073741824;
            break;
        default:
            break;
    }
    return Math.ceil(inputNumber * chunk_size);
}

export const createShdwStorageTx = async (connection: Connection, wallet: any) => {
    // console.log("drive", drive);
    // const accts = await drive.getStorageAccounts("v2");
    // return anchor.web3.PublicKey.findProgramAddress([Buffer.from("user-info"), key.toBytes()], program.programId);
    let userInfo = (await web3.PublicKey.findProgramAddress([Buffer.from("user-info"), wallet.publicKey.toBuffer()], PROGRAM_ID))[0]
    let userInfoAccount = await UserInfo.fetch(connection, userInfo);
    let accountSeed = new BN(0);
    if (userInfoAccount !== null) {
        accountSeed = new BN(userInfoAccount.accountCounter);
    }
    let storageConfigPDA = (await web3.PublicKey.findProgramAddress([
        Buffer.from("storage-config"),
    ], PROGRAM_ID))[0];
    let storageAccount = (await web3.PublicKey.findProgramAddress([
        Buffer.from("storage-account"),
        wallet.publicKey.toBytes(),
        accountSeed.toTwos(2).toArrayLike(Buffer, "le", 4),
    ], PROGRAM_ID))[0];
    let stakeAccount = (await web3.PublicKey.findProgramAddress([
        Buffer.from("stake-account"),
        storageAccount.toBytes()
    ], PROGRAM_ID))[0];

    let shdwMint = new PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y");
    let shdwATA = spl.getAssociatedTokenAddressSync(shdwMint, wallet.publicKey);
    let txn = new web3.Transaction();
    let storage = new BN((await humanSizeToBytes("10MB")).toString());
    const initializeAccountIx2 = initializeAccount2({
            identifier: "new storage",
            storage: storage,
        }, {
            storageConfig: storageConfigPDA,
            userInfo: userInfo,
            storageAccount: storageAccount,
            stakeAccount: stakeAccount,
            tokenMint: shdwMint,
            owner1: wallet.publicKey,
            uploader: new web3.PublicKey("972oJTFyjmVNsWM4GHEGPWUomAiJf2qrVotLtwnKmWem"),
            owner1TokenAccount: shdwATA,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY,
    });
    txn.add(initializeAccountIx2);
    // const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    // txn.recentBlockhash = blockhash;
    // txn.feePayer = wallet.publicKey;
    return txn;
}

export const createStorage = async (txn: Transaction) => {
    let txnSerialized = txn.serialize({requireAllSignatures: false});
    const controller = new AbortController();
    console.log("ready");
    const createStorageResponse = await fetch(`https://shadow-storage.genesysgo.net/storage-account`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            transaction: Buffer.from(txnSerialized.toJSON().data).toString("base64"),
        }),
        signal: controller.signal,
    });

    const responseJson = await createStorageResponse.json();
    console.log("response", responseJson);
}


const layout = borsh.struct([
    borsh.str("identifier"),
    borsh.u64("storage"),
]);

export const initializeAccount2 = (
    args : InitializeAccount2Args,
    accounts: InitializeAccount2Accounts,
  ) => {
    const keys = [
      { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
      { pubkey: accounts.userInfo, isSigner: false, isWritable: true },
      { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
      { pubkey: accounts.owner1, isSigner: true, isWritable: true },
      { pubkey: accounts.uploader, isSigner: true, isWritable: false },
      { pubkey: accounts.owner1TokenAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
      { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
      { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const identifier = Buffer.from([8, 182, 149, 144, 185, 31, 209, 105]);
    const buffer = Buffer.alloc(1000);
    const len = layout.encode(
      {
        identifier: args.identifier,
        storage: args.storage,
      },
      buffer
    );
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
    const ix = new web3.TransactionInstruction({
      keys,
      programId: PROGRAM_ID,
      data,
    });
    return ix;
}

export const uploadImageMessage = async (storage_key: PublicKey, data: FileType) => {
    let fileErrors = [];
    let fileBuffer;
    let file;
    // if (!common_1.isBrowser) {
    // data = data;
    
    file = data.file;

    // fileBuffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
    fileBuffer = Buffer.from(new Uint8Array(file));
    // }
    // else {
    //     file = data;
    //     form = new FormData();
    //     form.append("file", file, file.name);
    //     fileBuffer = Buffer.from(new Uint8Array(yield file.arrayBuffer()));
    // }
    if (fileBuffer.byteLength > 1073741824 * 1) {
        fileErrors.push({
            file: data.name,
            erorr: "Exceeds the 1GB limit.",
        });
    }
        /**
         *
         * Users must remember to include the file extension when uploading from Node.
         *
         */
        //   if (!isBrowser && data.name.lastIndexOf(".") == -1) {
        //     fileErrors.push({
        //       file: data.name,
        //       error: "File extension must be included.",
        //     });
        //   }
    if (fileErrors.length) {
        return Promise.reject(fileErrors);
    }
    const fileHashSum = crypto.createHash("sha256");
    const fileNameHashSum = crypto.createHash("sha256");
    fileHashSum.update(Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer));
    fileNameHashSum.update(data.name);
    const fileNameHash = fileNameHashSum.digest("hex");
    const msg = new TextEncoder().encode(`Shadow Drive Signed Message:\nStorage Account: ${storage_key}\nUpload files with hash: ${fileNameHash}`);
    return msg;

}

export const uploadImage = async (signed_message: Uint8Array, storage_account: PublicKey, data: any, walletPubKey: PublicKey) => {
    let form = new FormData();
    const file = data.file;
    const encodedMsg = bs58.encode(signed_message);
    form.append("file", file, data.name);
    form.append("fileNames", data.name);
    form.append("message", encodedMsg);
    form.append("storage_account", storage_account.toString());
    form.append("signer", walletPubKey.toString());
        
        try {
            const controller = new AbortController();
            const uploadResponse = await cross_fetch("https://shadow-storage.genesysgo.net/upload", {
                method: "POST",
                //@ts-ignore
                body: form,
                signal: controller.signal,
            });
            if (!uploadResponse.ok) {
                //@ts-ignore
                return Promise.reject(new Error(`Server response status code: ${uploadResponse.status} \nServer response status message: ${(uploadResponse.json()).error}`));
            }
            const responseJson = uploadResponse.json();
            return Promise.resolve(responseJson);
        }
        catch (e) {
            //@ts-ignore
            return Promise.reject(new Error(e.message));
        }
}

export interface FileType {
    name : string;
    file : Buffer;
}

export interface InitializeAccount2Args {
    identifier: string;
    storage: BN;
}
export interface InitializeAccount2Accounts {
    /** This account is a PDA that holds the storage configuration, including current cost per byte, */
    storageConfig: web3.PublicKey;
    /** This account is a PDA that holds a user's info (not specific to one storage account). */
    userInfo: web3.PublicKey;
    /**
     * This account is a PDA that holds a user's storage account information.
     * Upgraded to `StorageAccountV2`.
     */
    storageAccount: web3.PublicKey;
    /** This token account serves as the account which holds user's stake for file storage. */
    stakeAccount: web3.PublicKey;
    /** This is the token in question for staking. */
    tokenMint: web3.PublicKey;
    /**
     * This is the user who is initializing the storage account
     * and is automatically added as an admin
     */
    owner1: web3.PublicKey;
    /**
     * Uploader needs to sign as this txn
     * needs to be fulfilled on the middleman server
     * to create the ceph bucket
     */
    uploader: web3.PublicKey;
    /** This is the user's token account with which they are staking */
    owner1TokenAccount: web3.PublicKey;
    /** System Program */
    systemProgram: web3.PublicKey;
    /** Token Program */
    tokenProgram: web3.PublicKey;
    /** Rent Program */
    rent: web3.PublicKey;
  }
  
