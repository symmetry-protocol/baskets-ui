import { RPC_ENDPOINT } from "@/redux/globalState";
import { Connection, PublicKey } from "@solana/web3.js";

export const API_ROOT = 'https://api.symmetry.fi/v1/'
export const TOKEN_PROGRAM = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');


export const GET_REFERRAL_ID = async (address:string) => {

  let request = await fetch(API_ROOT+'refer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      request: 'get_referral_id',
      wallet: address
    })
  })
  let response = await request.json()
  if(response && response.success)
    return response.referral_id;

  return null;

}

/*
  Loads the historical data of n baskets
*/
export const LOAD_BASKETS_HISTORICAL_DATA = async (page=1, type=null) => {
  let request = await fetch(API_ROOT+'funds-getter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "request":"get_funds",
      "params":{
        "filters":{
          "by":"tvl",
          "order":"desc"
        },
        "attributes":[
          "name",
          "short_historical",
          "precise_historical",
          "sortkey",
          "fund_token",
          "image_uri"
        ],
        "count":25,
        "page":page,
        "actively_managed":type,
        "min_tvl":0
      }}
    )
  })
  let response = await request.json();
  if(response && response.result)
    return response.result;

  return [];
};

export const GET_USER_POINTS = async (address:string) => {
  const userData = await fetch('https://api.symmetry.fi/v1/funds-getter', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request: "get_user",
      params: {
        pubkey: address
      }
    })
  }).then(res => res.json()).then(data => {
    return data;
  });
  return userData.total_points;
}

export const LoadSymmetryVault = async (address:string) => {
  let request = await fetch(API_ROOT+'funds-getter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      request: 'get_fund',
      params: {
        pubkey: address
      }
    })
  })
  let response = await request.json()
  return response;
}

export const LoadTokenPrices = async (tokens:string[]) => {
  let request = await fetch('https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/prism-prices/?mints='+JSON.stringify(tokens))
  let response = await request.json()
  return response;
}

export const LoadVaultHolders = async (address:string) => {
  let request = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getProgramAccounts",
      "params": [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          "encoding": "jsonParsed",
          "filters": [
            {
              "dataSize": 165
            },
            {
              "memcmp": {
                "offset": 0,
                "bytes": address
              }
            }
          ]
        }
      ]
    })
  })
  let response = await request.json()
  if(response.result && response.result.length > 0)
  return response.result.length;

  return 0;
}

export const LoadSymmetryBasketHistory = async (address:string, timeframe:string) => {
  let request = await fetch(API_ROOT+'funds-getter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      request: 'get_history',
      params:{
        target:"fund_stats",
        pubkey:address,
        start:timeframe,
        benchmark:"current_target_weights",
        attributes:[
          "price",
          "tvl",
          "time",
        ]
      }
    })
  })
  let response = await request.json()
  return response;
}