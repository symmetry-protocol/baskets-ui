import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UnknownImage from "/public/static/images/unknown.png";


export const TokenIcon = ({symbol="SOL", size=24}) => {
  const state = useSelector((state) => state.storage);
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    if(state.tokenList) {
      let tokens = state.tokenList;
      let symmetryTokens = [];
      if(symbol === "wSOL") symbol = "SOL";

      if (symmetryTokens) {
        for(let i = symmetryTokens.length-1; i >= 0; i--) {
          if (symmetryTokens[i].symbol && symmetryTokens[i].symbol.toLowerCase() === symbol.toLowerCase()) {
            symbol = symmetryTokens[i].tokenMint;
            break;
          }
        }
      }
      
      for(let i = tokens.length-1; i >= 0; i--) {
        if(!tokens[i].symbol) continue;
        if(tokens[i].symbol.toLowerCase() === symbol.toLowerCase() || tokens[i].address.toLowerCase() === symbol.toLowerCase()) {
          setTokenInfo(tokens[i]);
          break;
        }
      }
    }
  },[state.tokenList, state.supportedTokens, symbol])

  return <div className={`w-[${size}px] h-[${size}px] flex items-center justify-center border rounded-full`}>
    {
      tokenInfo ?
      <Image
        width={size} 
        height={size} 
        className="rounded-full z-10 aspect-square"
        src={tokenInfo.logoURI} 
        alt={tokenInfo.address}
        onError={(e) => {
            e.target.style.display = "none";

          }
        }
      />
      :
      <p className="text-sm">?</p>
    }
    
  </div>;
}
