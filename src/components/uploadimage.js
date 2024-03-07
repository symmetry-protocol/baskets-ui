import React, { useState } from "react";
import {VersionedTransaction, PublicKey} from "@solana/web3.js";
import { ShdwDrive } from "@shadow-drive/sdk";
import {getOrCreateAssociatedTokenAccount,getAssociatedTokenAddressSync,createAssociatedTokenAccountInstruction, getAccount} from "@solana/spl-token";
import { jupSwapSolToShdwTx, createShdwStorageTx, uploadImageMessage } from "@/utils/shdw";

export const Upload = ({connection, wallet, drive, file, setFile, setTxnSig, setUploadUrl}) => {
    return (
        <div>
            <form
                onSubmit={async (event) => {
                    event.preventDefault();
                    
                    const shdwMint = new PublicKey("SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y");
                    console.log("shdwmint", shdwMint);
                    let accounts = [];
                    try {
                        accounts = await drive.getStorageAccounts("v2");
                    } catch(e) {
                        console.log("u dont have storage");
                        let ixs = [];
                        let ata = getAssociatedTokenAddressSync(shdwMint, wallet.publicKey);
                        let infoAta = await getAccount(connection, ata).catch(() => null);
                        if (!infoAta){
                            ixs.push(createAssociatedTokenAccountInstruction(wallet.PublicKey, ata, wallet.publicKey, shdwMint));
                            console.log(ixs);
                        }
                        else{
                            let shdwBalance = infoAta.amount;
                            console.log("shdwBalance", shdwBalance);
                        }
                        // const shdwBalance = await getOrCreateAssociatedTokenAccount(connection, wallet.payer, shdwMint, wallet.publicKey);
                        // console.log("shdwbalance", shdwBalance.amount);
                    }
                    // let accounts = await drive.getStorageAccounts("v2");
                    // if (accounts.length > 0){
                    //     let account = accounts[0].publicKey;
                    //     const upload = await drive.uploadFile(account, file);
                    //     console.log(upload);
                    //     setUploadUrl(upload.finalized_location);
                    //     setTxnSig(upload.transaction_signature);
                    // }
                    // else {
                        // let ixs = [];
                        // let ata = getAssociatedTokenAddressSync(tokenMint, wallet.publicKey);
                        // let infoAta = await connection.getAccountInfo(ata);
                        // if (!infoAta[0])
                        //     ixs.push(createAssociatedTokenAccountInstruction(user, ata, wallet.publicKey, shdwMint));
                        // else{
                        //     let shdwBalance = (await getAccount(connection, ata)).amount;
                        //     console.log("shdwBalance", shdwBalance);
                        // }
                        // const shdwBalance = await getOrCreateAssociatedTokenAccount(connection, wallet.payer, shdwMint, wallet.publicKey);
                        // console.log("shdwbalance", shdwBalance.amount);
                        // if (shdwBalance.amount <= 6000000)
                        //     jupSwapSolToShdwTx(wallet);

                        // const anchor = require("@coral-xyz/anchor");
                        // const account = (await drive.createStorageAccount("test storage", "10MB", "v2")).shdw_bucket;
                        // const pubkey = new anchor.web3.PublicKey(account);
                        // const upload = await drive.uploadFile(pubkey, file);
                        // console.log(upload);
                        // setUploadUrl(upload.finalized_location);
                        // setTxnSig(upload.transaction_signature);
                    // }
                    // else {  
                        // const anchor = require("@coral-xyz/anchor");
                        // try {
                        //     const account = (await drive.createStorageAccount("test storage", "10MB", "v2")).shdw_bucket;
                        // } catch(e) {
                        //     if(e.message != "User rejected the request.") {
                        //         jupSwapSolToSHDW(wallet, connection);
                        //     }
                        // }
                        // const account = (await drive.createStorageAccount("test storage", "10MB", "v2")).shdw_bucket;
                        // const pubkey = new anchor.web3.PublicKey(account);
                        // const upload = await drive.uploadFile(pubkey, file);
                        // console.log(upload);
                        // setUploadUrl(upload.finalized_location);
                        // setTxnSig(upload.transaction_signature);
                    // }
                }}
            >
                
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

// export async function jupSwapSolToSHDW(wallet, connection) {
//     const quoteResponse = await (
//         await fetch('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y&amount=10000&slippageBps=50'
//         )
//       ).json();
//     console.log("quoteResponse", quoteResponse);

//     const { swapTransaction } = await (
//         await fetch('https://quote-api.jup.ag/v6/swap', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             // quoteResponse from /quote api
//             quoteResponse,
//             // user public key to be used for the swap
//             userPublicKey: wallet.publicKey.toString(),
//             // auto wrap and unwrap SOL. default is true
//             wrapAndUnwrapSol: true,
//             dynamicComputeUnitLimit: true,
//             prioritizationFeeLamports: 'auto'
//             // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
//             // feeAccount: "fee_account_public_key"
//           })
//         })
//       ).json();
//     const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
//     var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
//     console.log(transaction);

//     // sign the transaction
//     transaction = await wallet.signTransaction(transaction);
//     console.log("transaction", transaction);
//     // transaction.sign([wallet.payer]);
//     // console.log("wallet", transaction);
//     const rawTransaction = transaction.serialize();
//     const txid = await connection.sendRawTransaction(rawTransaction, {
//         skipPreflight: true,
//         maxRetries: 2
//     });
//     await connection.confirmTransaction(txid);
//     console.log(`https://solscan.io/tx/${txid}`);
// }