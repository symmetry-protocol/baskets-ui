import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { BIRDEYE_API_KEY, RPC_ENDPOINT, TOKEN_PROGRAM_ID } from "@/redux/globalState";
import {BN} from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAccounts } from "@/redux/state";

export const UNKNOWN_IMAGE_URL = "https://i.imgur.com/57E7Mna.png";


export const POINTS_TO_LEVEL = (points) => {
  return Math.floor(9.2 * Math.log(0.00011 * points + 1) / Math.log(10) + 1/2 * points**0.1);
}
export const VaultTypeToString = (actively_managed=null) => {
  if(actively_managed === 0) return "Bundle";
  if(actively_managed === 1) return "Portfolio";
  if(actively_managed === 2) return "Private Portfolio";
  return "Vault";
}

export const GET_TOKEN_INFO = async (address) => {
 let response = await fetch("https://public-api.birdeye.so/defi/token_overview?address="+address,
 {
  headers: {
    'X-API-KEY': BIRDEYE_API_KEY
  }
 }).then(res => res.json());
 if(response.data?.address) {
    return response;
 }
 return {
  success: false,
 }
}
export const findTokenByAddress = (address, decimals, tokenList) => {
  for(let i = 0; i < tokenList.length; i++) {
    if(tokenList[i].address === address) return tokenList[i];
  }
  return {
    address: address,
    decimals: decimals,
    symbol: address.slice(0,3)+"..."+address.slice(-1),
    name: "Unknown Token",
    logoURI: UNKNOWN_IMAGE_URL
  }
}

export const formatNumber = (amount, toFixed=6) => {
  let formatter = new Intl.NumberFormat("en-US", {  maximumFractionDigits: toFixed==="auto" ? (amount > 1000000 ? 0 : amount > 100000 ? 2 : amount < 0.0001 ? 8 : 6) : toFixed });
  if(toFixed === "auto" && amount < 0.0001 && amount > 0) {
    return ConvertToSubscript(amount);
  } else if(toFixed === "auto" && amount > 1000000 && amount < 1000000000) {
    return parseFloat(amount / 10**6).toFixed(2) + "M"
  } else if(toFixed === "auto" && amount > 1000000000) {
    return parseFloat(amount / 10**9).toFixed(2) + "B"
  }
  return formatter.format(amount);
}

const ConvertToSubscript = (num) => {
  let numStr = num.toString();

  // Find the first non-zero digit after the decimal
  let decimalIndex = numStr.indexOf('.');
  let firstNonZeroIndex = numStr.length;
  for (let i = decimalIndex + 1; i < numStr.length; i++) {
      if (numStr[i] !== '0') {
          firstNonZeroIndex = i;
          break;
      }
  }

  // Calculate the number of zeros after the decimal and before the first non-zero digit
  let zeroCount = firstNonZeroIndex - decimalIndex - 1;

  // Check if any zeros are present
  if (zeroCount <= 0) {
      // Return the original number as string if no zeros are found after the decimal
      return numStr;
  }

  // Insert the subscript for zero count
  let subscript = String.fromCharCode(8320 + zeroCount); // Convert to subscript unicode
  return numStr.substring(0, decimalIndex + 1) + "0" + subscript + numStr.substring(firstNonZeroIndex);
}



export const GetTokenBalance = (address, accounts) => {
  for(let i = 0; i < accounts.length; i++) {
    if(accounts[i].mint === address) return {
      balance: accounts[i].balance,
      address: accounts[i].address
    };
  }
  return {
    balance: 0,
    address: address
  }
}

export const SOL_TOKEN = {
  "id": 1,
  "symbol": "SOL",
  "name": "Wrapped SOL",
  "tokenMint": "So11111111111111111111111111111111111111112",
  "address": "So11111111111111111111111111111111111111112",
  "decimals": 9,
  "coingeckoId": "solana",
  "pdaTokenAccount": "5aZ2xEiJSkG6iSvdan7nCrT2wfJTDsh5rjxbVvVyvbgv",
  "oracleType": "Pyth",
  "oracleAccount": "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG",
  "oracleIndex": 0,
  "oracleConfidencePct": 50,
  "fixedConfidenceBps": 0,
  "tokenSwapFeeBeforeTwBps": 15,
  "tokenSwapFeeAfterTwBps": 35,
  "isLive": true,
  "lpOn": true,
  "useCurveData": false,
  "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};

export const GET_USER_TOKENS = async (pubkey, connection, dispatch) => {
  let params = {
    "jsonrpc": "2.0",
    "id": "helius-test",
    "method": "searchAssets",
    "params": {
        "ownerAddress": pubkey,
        "tokenType": "fungible"
    }
  }
  try {
    let request = await fetch(RPC_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(params)
    });
    let response = await request.json();
    let tokens = response.result.items;
    let accounts = [];
    for(let i = 0; i < tokens.length; i++) {
      let obj = {
        address: tokens[i].id,
        ...tokens[i].token_info,
        balance: tokens[i].token_info.balance / 10**tokens[i].token_info.decimals,
      }
      accounts.push(obj);
    }

    let nativeSolBalance = await connection.getBalance(new PublicKey(pubkey), "processed").catch(() => 0);
    let hasWsolAccount = -1;
    for(let i = 0; i < accounts.length; i++) {
      if(accounts[i].address === SOL_TOKEN.tokenMint) {
        hasWsolAccount = i;
      }
    }
    console.log("[helius]",accounts[hasWsolAccount], nativeSolBalance / 10**9)

    if(hasWsolAccount === -1) {
      accounts.push({
        address: SOL_TOKEN.tokenMint,
        ...SOL_TOKEN,
        balance: nativeSolBalance / 10**9
      })
    } else {
      accounts[hasWsolAccount].balance += nativeSolBalance / 10**9;
    }
    
    console.log("[balances]", accounts);
    dispatch(setAccounts(accounts));
    return accounts;
  } catch (e) {
    console.log("[balances]", e);
    return [];
  }
}

export const ToastMaker = (title, description=null, link=null) => {
  return <div className="toast">
    <div className="Text-sm-sb">{title}</div>
    {
      description &&
      <div className="Text-xs-m">{description}</div>
    }
    {
      link &&
      <a href={link.href} target="_blank" className="link">{link.title}</a>
    }
  </div>
}


function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  return null;
}
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(null);

  useEffect(() => {
    // Set dimensions only after component mounts
    setWindowDimensions(getWindowDimensions());

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}



export const LEVELS = {
  1: 281,
  2: 2337,
  3: 5254,
  4: 9034,
  5: 13873,
  6: 20046,
  7: 27910,
  8: 37920,
  9: 50655,
  10: 66852,
  11: 87445,
  12: 113621,
  13: 146883,
  14: 189142,
  15: 242814,
  16: 310967,
  17: 397483,
  18: 507283,
  19: 646592,
  20: 823294,
  21: 1047362,
  22: 1331409,
  23: 1691383,
  24: 2147442,
  25: 2725054,
  26: 3456386,
  27: 4382047,
  28: 5553289,
  29: 7034769,
  30: 8908018,
  31: 11275812,
  32: 14267646,
  33: 18046615,
  34: 22818045,
  35: 28840311,
  36: 36438400,
  37: 46020900,
  38: 58101265,
  39: 73324427,
  40: 92500077,
  41: 116644252,
  42: 147031297,
  43: 185258720,
  44: 233328119,
  45: 293746081,
  46: 369649923,
  47: 464964274,
  48: 584595956,
  49: 734676366,
  50: 922862733,
  51: 1158712322,
  52: 1454146903,
  53: 1824028892,
  54: 2286875497,
  55: 2865743303,
  56: 3589323179,
  57: 4493294549,
  58: 5621999191,
  59: 7030508435,
  60: 8787174263,
  61: 10976775164,
  62: 13704392372,
  63: 17100182297,
  64: 21325247612,
  65: 26578854091,
  66: 33107294344,
  67: 41214765237,
  68: 51276705225,
  69: 63756133980,
  70: 79223652879,
  71: 98381905231,
  72: 122095464324,
  73: 151427321198,
  74: 187683389353,
  75: 232466738462,
  76: 287743623150,
  77: 355923797479,
  78: 439958114379,
  79: 543457017789,
  80: 670834262561,
  81: 827481065330,
  82: 1019976924661,
  83: 1256344581422,
  84: 1546358056505,
  85: 1901914444766,
  86: 2337482210709,
  87: 2870641180587,
  88: 3522732324389,
  89: 4319638847955,
  90: 5292724161324
 }