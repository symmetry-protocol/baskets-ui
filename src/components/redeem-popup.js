import { useConnection, useWallet } from "@solana/wallet-adapter-react"
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
import { TokenIcon } from "./token-icon";
import toast, { CheckmarkIcon, LoaderIcon } from "react-hot-toast";
import { useSymmetry } from "@/utils/SymmetryContext";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_TOKENS, formatNumber } from "@/utils/utils";

export const RedeemPopup = ({open, onClose, tempState}) => {
  const dispatch = useDispatch();
  const { connection } = useConnection();
  const state = useSelector(state => state.storage);
  const wallet = useWallet();
  const sdk = useSymmetry();
  const [tempAccount, setTempAccount] = useState(tempState);
  const [completed, setCompleted] = useState(false);
  
  const fetchTempAccount = async () => {
    sdk.loadFromPubkey(tempAccount.ownAddress)
    .then(_data => {
      console.log(_data);
      setTempAccount(_data);
    }).catch(e => {
      setCompleted(true);
      onClose();
    })
  }

  useEffect(() => {
    let timeout = setTimeout(() => {
      fetchTempAccount(); 
      GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
    }, 30000);
    return () => clearTimeout(timeout);
  }, [tempAccount]);

  const rebalance = async () => {
    toast.loading("Waiting for transactions...", {id: 10})
    sdk.setPriorityFee(500000);
    sdk.setWallet(wallet);
    sdk.rebalanceBasket(tempAccount)
      .catch((e) => { toast.error(e.message, {id: 10}); return null; })
      .then(txs => {
        if (txs) {
          toast.success(
            <div>
              <p>Rebalanced</p>
              {txs.filter(x => x).map(tx => 
                <div><a href={"https://solscan.io/tx/"+tx}>View on Solscan</a></div>
               )}
            </div>,
            {id: 10}
          );
        }
        fetchTempAccount();
      })
  }

  const claim = async () => {
    toast.loading("Waiting for transactions...", {id: 11})
    sdk.setPriorityFee(500000);
    sdk.setWallet(wallet);
    sdk.claimTokens(tempAccount)
      .catch((e) => { toast.error(e.message, {id: 11}); return null; })
      .then(txs => {
        if (txs) {
          toast.success(
            <div>
              <p>Claimed</p>
              {txs.filter(x => x).map(tx => 
                 <div><a href={"https://solscan.io/tx/"+tx}>View on Solscan</a></div>
                )}
            </div>,
            {id: 11}
          );
        }
        fetchTempAccount();
        GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
      })
  }

  return <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Redeeming from Basket</DialogTitle>
        <DialogDescription>
          You can redeem composition tokens directly into your wallet, or rebalance them to USDC.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Tokens
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {tempAccount && 
            tempAccount.data.currentCompToken.slice(0, tempAccount.data.numOfTokens.toNumber()).map((token, i) => {
              let tokenData = state.supportedTokens.find(t => t.id === token.toNumber());
              let currentAmount = tempAccount.data.currentCompAmount[i].toNumber();
              if (!tokenData ||currentAmount == 0) return <></>;
              return <div key={i} className="p-1 pr-2 rounded-full border bg-background-over flex items-center gap-1">
                <TokenIcon symbol={tokenData.tokenMint} size={24} />
                <p className="text-sm font-bold">{tokenData.symbol}</p>
                <p className="text-sm font-bold ml-2">
                  {
                    formatNumber(currentAmount / 10 ** tokenData.decimals, 4)
                  }
                </p>
              </div>
            })  
          }
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        If you rebalance to USDC, after rebalancing click Claim to transfer USDC into your wallet.
      </p>
      <DialogFooter>
        <Button onClick={() => rebalance()}>Rebalance to USDC</Button>
        <Button onClick={() => claim()}>Claim</Button>
      </DialogFooter>
    </DialogContent>
    
  </Dialog>
}