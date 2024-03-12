import { PublicKey, Connection } from "@solana/web3.js";

const stored_user_pubkey = "pubkey";

// Enter your RPC endpoint here
// If you don't have an RPC endpoint, you can use one of the free endpoints available here:
// https://solana.com/rpc
export const RPC_ENDPOINT = "YOUR_RPC_ENDPOINT_HERE";
export const TOKEN_LIST_API = "https://token.jup.ag/strict";
export const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

// Change this to your pubkey to receive host platform fees
export const HOST_PUBKEY = new PublicKey('4Vry5hGDmbwGwhjgegHmoitjMHniSotpjBFkRuDYHcDG')

// If you'd like to use comparison charts (benchmarks) on baskets, enter BIRDEYE_API_KEY here
export const BIRDEYE_API_KEY = 'BIRDEYE_API_KEY_HERE';


let connection = new Connection(RPC_ENDPOINT, "confirmed");

const globalState = {
  connected: false,
  dex: 'v2',
  tokenList: null,
  accounts: null,
};

export default globalState;