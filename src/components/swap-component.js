import { useEffect, useState } from "react"
import { TokenButton } from "./token-button";
import { GET_USER_TOKENS, SOL_TOKEN, formatNumber } from "@/utils/utils";
import SwapIcon from "/public/static/icons/swapIcon.svg";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useDispatch, useSelector } from "react-redux";
import { useSymmetry } from "@/utils/SymmetryContext";
import { DepositPopup } from "./deposit-popup";
import { RedeemPopup } from "./redeem-popup";
import { SelectTokenPopup } from "./select-token-popup";
import toast from "react-hot-toast";


export const SwapComponent = ({from, to=SOL_TOKEN, basket, setReload, reload}) => {

  const state = useSelector((state) => state.storage);
  const dispatch = useDispatch();
  const wallet = useWallet();
  const sdk = useSymmetry();
  const {connection} = useConnection();

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState(0);
  const [fees, setFees] = useState(0);
  const [fromToken, setFromToken] = useState(from);
  const [toToken, setToToken] = useState(to);
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);

  const [tempState, setTempState] = useState(null);

  const [side, setSide] = useState(0);
  const [swapType, setSwapType] = useState("deposit");

  // Popups
  const [depositPopup, setDepositPopup] = useState(false);
  const [redeemPopup, setRedeemPopup] = useState(false);
  const [selectTokenPopup, setSelectTokenPopup] = useState(-1); // -1 closed, 0 select from token, 1 select to token

  /*
    Set the from and to token balances
  */
  useEffect(() => {
    if(state.accounts && fromToken && toToken) {
      let from = state.accounts.find(a => a.address === fromToken.address || a.address === fromToken.tokenMint);
      let to = state.accounts.find(a => a.address === toToken.address || a.address === toToken.tokenMint);
      if(!from) from = {balance: 0};
      if(!to) to = {balance: 0};

      setFromBalance(from.balance);
      setToBalance(to.balance);
    }
  }, [state.accounts, fromToken, toToken]);

  /*
    Calculate Output amount based on input amount
  */
  useEffect(() => {
    if (!fromAmount || fromAmount == "" || Number(fromAmount) == 0)
      { setToAmount("");  setPriceImpact(0); setFees(0); return; }
    if (fromToken == toToken)
      { setToAmount(""); setPriceImpact(0); setFees(0); return; }
  
    if (swapType == "deposit") {
      let rawAmount = fromAmount * fromToken.price / toToken.price;
      let fees = fromAmount *
        (10 + basket.basket.data.managerFee.toNumber() + basket.basket.data.hostFee.toNumber()) / 10000;
      let amount = fromAmount - fees;
      amount = amount * fromToken.price / toToken.price;
      amount = amount * (1 - basket.basket.data.rebalanceSlippage.toNumber() / 10000);
      setPriceImpact(100 * (rawAmount - amount) / rawAmount);
      setFees(fees * fromToken.price);
      amount = amount.toFixed(6);
      setToAmount(amount);
    }
    if (swapType == "redeem") {
      let rawAmount = fromAmount * fromToken.price / toToken.price;
      let fees = 0;
      let amount = fromAmount - fees;
      amount = amount * fromToken.price / toToken.price;
      amount = amount * (1 - basket.basket.data.rebalanceSlippage.toNumber() / 10000);
      setPriceImpact(100 * (rawAmount - amount) / rawAmount);
      setFees(fees * fromToken.price);
      setToAmount(amount.toFixed(6));
    }
    if (swapType == "swap") {
      if (fromToken.address == basket.parsed.basketTokenMint) {
        let rawAmount = fromAmount * fromToken.price / toToken.price;
        sdk.computeOutputAmountWithInstantBurn(
          basket.basket,
          new PublicKey(toToken.tokenMint),
          fromAmount
        ).catch((e) => { toast.error(e.message); return 0; }).then(amount => {
          setPriceImpact(100 * (rawAmount - amount) / rawAmount);
          setFees(0);
          setToAmount(amount.toFixed(toToken.decimals))
        });
      } else {
        let rawAmount = fromAmount * fromToken.price / toToken.price;
        let fees = fromAmount *
          (10 + basket.basket.data.managerFee.toNumber() + basket.basket.data.hostFee.toNumber()) / 10000;
        sdk.computeMintAmountWithSingleToken(
          basket.basket,
          new PublicKey(fromToken.tokenMint),
          fromAmount
        ).catch((e) => { toast.error(e.message); return 0; }).then(amount => {
          setToAmount(amount.toFixed(6))
          setPriceImpact(100 * (rawAmount - amount) / rawAmount);
          setFees(fees * fromToken.price);
        });
      }
    }
  }, [fromAmount, fromToken, toToken]);

  const changeSwapType = (type) => {
    if(type === 'deposit') {
      setSwapType('deposit');
      setFromToken(from);
      setToToken(to);
      setFromAmount("");
      setToAmount("");
      setPriceImpact(0);
      setFees(0);
    } else if(type === 'redeem') {
      setSwapType('redeem');
      setFromToken(to);
      setToToken(from);
      setFromAmount("");
      setToAmount("");
      setPriceImpact(0);
      setFees(0);
    } else if(type === 'swap') {
      setSwapType('swap');
      setFromToken(from);
      setToToken(to);
      setFromAmount("");
      setToAmount("");
      setPriceImpact(0);
      setFees(0);
    }
  }

  const switchSide = () => {
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
    setFromToken(toToken);
  }

  const placeOrder = async () => {
    if (!sdk) throw new Error("Sdk Not initialized");
    if (swapType == "deposit") {
      toast.loading("Waiting for transactions...",{id: 7});
      sdk.setPriorityFee(500000);
      sdk.setWallet(wallet);
      sdk.buyBasket(basket.basket, fromAmount)
        .catch((e) => { toast.error(e.message, {id: 7}); return null;})
        .then(tempState => {
          if (tempState) {
            toast.success(<a href={"https://solscan.io/account/"+tempState.ownAddress.toBase58()}>View on Solscan</a>, {id: 7});
            setTempState(tempState);
            setDepositPopup(true);
          }
          setReload(reload+1);
          GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
        })
    }
    if (swapType == "redeem") {
      toast.loading("Waiting for transactions...",{id: 8});
      sdk.setPriorityFee(500000);
      sdk.setWallet(wallet);
      sdk.sellBasket(basket.basket, fromAmount, true)
        .catch((e) => { toast.error(e.message, {id: 8}); return null;})
        .then(tempState => {
          if (tempState) {
            toast.success(<a href={"https://solscan.io/account/"+tempState.ownAddress.toBase58()}>View on Solscan</a>, {id: 8});
            setTempState(tempState);
            setRedeemPopup(true);
          }
          setReload(reload+1);
          GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
        })
    }
    if (swapType == "swap") {
      if (fromToken.address == basket.parsed.basketTokenMint) {
        toast.loading("Waiting for transactions...",{id: 5});
        sdk.setPriorityFee(500000);
        sdk.setWallet(wallet);
        sdk.instantBurn(
          basket.basket,
          new PublicKey(toToken.tokenMint),
          fromAmount
        ).catch((e) => { toast.error(e.message, {id: 5}); return null; })
          .then(tx => {
            if (tx) {
              toast.success(<a href={"https://solscan.io/tx/"+tx}>View on Solscan</a>, {id: 5});
            }
            setReload(reload+1);
            GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
        });
      } else {
        toast.loading("Waiting for transactions...",{id: 6});
        sdk.setPriorityFee(500000);
        sdk.setWallet(wallet);
        sdk.buyWithSingleToken(
          basket.basket,
          new PublicKey(fromToken.tokenMint),
          fromAmount
        ).catch((e) => { toast.error(e.message, {id: 6}); return null; })
          .then(tx => {
            if (tx) {
              toast.success(<a href={"https://solscan.io/tx/"+tx}>View on Solscan</a>, {id: 6});
            }
            setReload(reload+1);
            GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
        });
      }
    }
  }

  return <div className="w-full border rounded-xl flex flex-col gap-4 p-4">
    <div className="w-full grid grid-cols-3 items-center justify-between border p-2 rounded-lg select-none">
      <p onClick={() => changeSwapType('deposit')} className={`text-sm cursor-pointer p-2 font-bold w-full text-center rounded ${swapType === 'deposit' && 'bg-secondary'}`}>
        Deposit
      </p>
      <p onClick={() => changeSwapType('redeem')} className={`text-sm cursor-pointer p-2 font-bold w-full text-center rounded ${swapType === 'redeem' && 'bg-secondary'}`}>
        Redeem
      </p>
      <p onClick={() => changeSwapType('swap')} className={`text-sm cursor-pointer p-2 font-bold w-full text-center rounded ${swapType === 'swap' && 'bg-secondary'}`}>
        Swap
      </p>
    </div>
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center w-full justify-between">
        <p className="text-sm text-muted-foreground">From</p>
        <p onClick={() => setFromAmount(fromBalance)} className="text-sm text-muted-foreground cursor-pointer">Max: {fromBalance} {fromToken.symbol}</p>
      </div>
      <div className="w-full flex items-center relative p-4 border rounded-lg">
        <TokenButton 
          disabled={(swapType === 'swap' && fromToken.address != basket.parsed.basketTokenMint) ? false : true}
          className="z-10"
          onClick={() => {
            if(swapType === 'swap' && fromToken.address != basket.parsed.basketTokenMint)
              setSelectTokenPopup(0)
          }} 
          token={fromToken}
        />
        <input className={"text-lg text-right absolute w-full h-full bg-transparent border-none z-1 top-0 left-0 px-4 font-bold focus:outline-none"} value={fromAmount} lang="en" onChange={(e) => setFromAmount(e.target.value)} type="number" placeholder="0.00" inputMode='decimal' pattern="[0-9,]*"/>
        {
          fromAmount > 0 && fromToken.price &&
          <p className="text-muted-foreground absolute right-4 bottom-2 text-xs">
            {
              `≈ $${ formatNumber(fromAmount * fromToken.price,"auto")}`
            }
          </p>
        }
      </div>
    </div>
    {
      swapType === 'swap' &&
      <div className={'flex items-center justify-center relative w-full'}>
        <hr className={'w-full absolute border-t z-0'}/>
        <div className={'w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center bg-background-over z-10 cursor-pointer hover:border-blue-500 hover:text-blue-500'} onClick={() => switchSide(side === 0 ? 1 : 0)}>
          <SwapIcon width={20} height={20}/>
        </div>
      </div>
    }
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center w-full justify-between">
        <p className="text-sm text-muted-foreground">To</p>
        <p className="text-sm text-muted-foreground">Max: {toBalance} {toToken.symbol}</p>
      </div>
      
      <div className="w-full flex items-center relative p-4 border rounded-lg">
        <TokenButton 
          disabled={(swapType === 'swap' && fromToken.address == basket.parsed.basketTokenMint) ? false : true}
          className="z-10"
          onClick={() => {
            if(swapType === 'swap' && fromToken.address == basket.parsed.basketTokenMint)
              setSelectTokenPopup(1)
          }} 
          token={toToken}
        />
        <input className={"text-lg text-right absolute w-full h-full bg-transparent border-none z-1 top-0 left-0 px-4 font-bold focus:outline-none"} value={toAmount} lang="en" onChange={(e) => null} type="number" placeholder="0.00" inputMode='decimal' pattern="[0-9,]*"/>
        {
          toAmount > 0 && toToken.price &&
          <p className="text-muted-foreground absolute right-4 bottom-2 text-xs">
            {
              `≈ $${ formatNumber(toAmount * toToken.price,"auto")}`
            }
          </p>
        }
      </div>
    </div>
    <div className="flex flex-col w-full gap-1">
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Max Price Impact</p>
        <p className="text-sm text-muted-foreground">{priceImpact.toFixed(2)}%</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Estimated Fees</p>
        <p className="text-sm text-muted-foreground">{`≈ $${ formatNumber(fees,"auto")}`}</p>
      </div>
    </div>
    {
      !wallet.connected ?
      <div className="w-full flex items-center justify-center h-[48px] bg-black rounded-lg cursor-not-allowed">
        <p className="text-muted-foreground font-bold">Connect Wallet</p>
      </div>
      :
        toAmount > 0 ?
        <div onClick={() => placeOrder()} className="w-full flex items-center justify-center h-[48px] bg-blue-500 rounded-lg cursor-pointer">
          <p className="text-white font-bold">Swap</p>
        </div>
        :
        <div className="w-full flex items-center justify-center h-[48px] bg-black rounded-lg cursor-not-allowed">
          <p className="text-muted-foreground font-bold">Enter an amount</p>
        </div>
    }

    {
      selectTokenPopup > -1 &&
      <SelectTokenPopup open={selectTokenPopup > -1 ? true : false} onClose={() => setSelectTokenPopup(-1)} onSelect={(token) => {
        if(selectTokenPopup === 0) {
          setFromToken(token);
        } else {
          setToToken(token);
        }
        setSelectTokenPopup(-1);
      }} tokenList={basket.parsed.currentComposition.map(x => x.tokenData)}/>
    }
    { depositPopup &&
      <DepositPopup tempState={tempState} open={depositPopup} onClose={() => setDepositPopup(false)}/>
    }
    { redeemPopup &&
      <RedeemPopup tempState={tempState} open={redeemPopup} onClose={() => setRedeemPopup(false)}/>
    }
  </div>
}