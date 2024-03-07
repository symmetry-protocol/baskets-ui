import { ArrowTopRightIcon, MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import Link from "next/link"
import { TokenIcon } from "./token-icon"
import { SelectTokenPopup } from "./select-token-popup"
import { useSymmetry } from "@/utils/SymmetryContext"
import toast from "react-hot-toast"
import { PublicKey } from "@solana/web3.js"
import { useSelector } from "react-redux"

export const EditHoldingsPopup = ({open, onClose, setReload, reload, basket=null}) => {
  const sdk = useSymmetry();
  const wallet = useWallet();
  const state = useSelector(state => state.storage);
  const [basketComposition, setBasketComposition] = useState([]);
  const [tokensPopup, setTokensPopup] = useState(false);

  useEffect(() => {
    if(basket && basket.parsed) {
      let comp = [];
      basket.parsed.currentComposition.map(token => {
        if (token.targetWeight > 0)
          comp.push({
            ...token.tokenData,
            weight: parseFloat(token.targetWeight.toFixed(2))
          })
      })
      setBasketComposition(comp);
    }
  }, [basket]);

  const addToken = (token) => {
    // check if token already in composition
    let exists = basketComposition.find(t => t.tokenMint === token.tokenMint);
    if(exists) {
      toast.error("Token already in composition");
      setTokensPopup(false);
      return;
    }
    setBasketComposition([...basketComposition, {
      ...token,
      weight: 0
    }]);
    setTokensPopup(false);
  }
  const removeToken = (token) => {
    let newTokens = basketComposition.filter(t => t.tokenMint !== token.tokenMint);
    setBasketComposition(newTokens);
  }

  const adjustTokenWeight = (token, weight) => {
    let newTokens = basketComposition.map(t => {
      if(t.tokenMint === token.tokenMint) {
        return {
          ...t,
          weight: Number(weight)
        }
      }
      return t;
    });
    setBasketComposition(newTokens);
  }

  const editHoldings = async () => {
    sdk.setWallet(wallet);
    sdk.setPriorityFee(500000);
    toast.loading("Waiting for transaction...",{id: 2});
    sdk.simpleEditBasket(basket.basket, {
      managerFee: basket.basket.data.managerFee.toNumber(),
      rebalanceInterval: basket.basket.data.rebalanceInterval.toNumber(),
      rebalanceThreshold: basket.basket.data.rebalanceThreshold.toNumber(),
      rebalanceSlippage: basket.basket.data.rebalanceSlippage.toNumber(),
      lpOffsetThreshold: basket.basket.data.lpOffsetThreshold.toNumber(),
      disableRebalance: basket.basket.data.disableRebalance.toNumber(),
      disableLp: basket.basket.data.disableLp.toNumber(),
      composition: basketComposition.map(x => { return {token: new PublicKey(x.tokenMint), weight: x.weight}})
    }).catch((e) => {
      toast.error(e.message, {id: 2});
      return null
    }).then(tx => {
      if (tx) {
        toast.success(<a href={"https://solscan.io/tx/"+tx}>View on Solscan</a>, {id: 2});
      }
      setReload(reload+1);
    })
  }


  return <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Holdings</DialogTitle>
        <DialogDescription>
          Adjust the composition of the basket by adding or removing tokens and adjusting their weights.
        </DialogDescription>
      </DialogHeader>
      <div onClick={() => setTokensPopup(true)} className="w-full h-12 flex items-center gap-2 border rounded-md px-4 hover:bg-background-over hover:border-gray-500 text-muted-foreground hover:text-primary cursor-pointer transition-all">
        <MagnifyingGlassIcon width={24} height={24}/>
        <p className="text-sm">Search Tokens</p>
      </div>
      <div className="w-full flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Token</p>
          <div className="flex items-center gap-2 h-full">
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-xs text-muted-foreground">X</p>
          </div>
        </div>
      <div className="w-full rounded-lg border bg-background-over p-2 flex flex-col gap-2 max-h-[500px] h-full overflow-y-scroll">
        
        { 
          basketComposition.length > 0 ? basketComposition.map((token, i) => {
            return <div key={i} className="w-full flex items-center justify-between h-14 shrink-0">
              <div className="flex items-center gap-2 ">
                <TokenIcon symbol={token.tokenMint} size={32}/>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold">{token.symbol}</p>
                    <Link href={"https://solscan.io/token/"+token.tokenMint} className="flex items-center gap-1" target="_blank">
                      <Badge variant={"outline"} className="text-xs w-fit flex items-center gap-1">
                        {token.tokenMint.slice(0,3)+"..."+token.tokenMint.slice(-3)}
                        <ArrowTopRightIcon width={12} height={12}/>
                        </Badge>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 h-full">
                <input lang="en" type="number" placeholder="0.00" inputMode='decimal' pattern="[0-9,]*" className="w-16 text-xl h-full text-center rounded-md border bg-background-over font-bold" value={token.weight > 0 ? token.weight : ""} onChange={(e) => adjustTokenWeight(token, e.target.value)}/>
                <div onClick={() => removeToken(token)} className="w-6 h-full rounded-md bg-red-900 bg-opacity-50 hover:bg-red-700 transition-all cursor-pointer flex items-center justify-center">
                  <TrashIcon width={16} height={16} className="text-white"/>
                </div>
              </div>
            </div>
          }) : 
          <div className="w-full h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Start by adding tokens to composition</p>
          </div>
        }
      </div>
      <DialogFooter>
        <Button onClick={() => editHoldings()}>Save changes</Button>
      </DialogFooter>
    </DialogContent>
    {
      tokensPopup &&
      <SelectTokenPopup open={tokensPopup} onClose={() => setTokensPopup(false)} onSelect={
        (token) => addToken(token)} tokenList={state.supportedTokens}/>
    }
  </Dialog>
}