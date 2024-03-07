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
import { PublicKey } from "@solana/web3.js";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_TOKENS, formatNumber } from "@/utils/utils";
export const DepositPopup = ({open, onClose, tempState}) => {
  const dispatch = useDispatch();
  const { connection } = useConnection();
  const state = useSelector(state => state.storage);
  const wallet = useWallet();
  const sdk = useSymmetry();
  const [tempAccount, setTempAccount] = useState(tempState);
  const [completed, setCompleted] = useState(false);

  const fetchTempAccount = async () => {
    sdk.fetchBuyStateFromPubkey(tempAccount.ownAddress)
    .then(_data => {
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
    toast.loading("Waiting for transactions...", {id: 9})
    sdk.setPriorityFee(500000);
    sdk.setWallet(wallet);
    sdk.rebalanceBuyState(tempAccount)
      .catch((e) => { toast.error(e.message, {id: 9}); return null; })
      .then(txs => {
        if (txs) {
          toast.success(
            <div>
              <p>Rebalanced</p>
              {txs.filter(x => x).map(tx => 
                 <div><a href={"https://solscan.io/tx/"+tx}>View on Solscan</a></div>
              )}
            </div>,
            {id: 9}
          );
        }
        fetchTempAccount();
      })
  }

  const mint = async () => {
    toast.loading("Waiting for transactions...", {id: 12})
    sdk.setPriorityFee(500000);
    sdk.setWallet(wallet);
    sdk.mintBasket(tempAccount)
      .catch((e) => { toast.error(e.message, {id: 12}); return null; })
      .then(tx => {
        if (tx) {
          toast.success(
            <div>
              <p>Basket Tokens Minted</p>
              <a href={"https://solscan.io/tx/"+tx}>View on Solscan</a>
            </div>,
            {id: 12}
          );
        }
        fetchTempAccount();
        GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
      })
  }

  return <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Depositing into Basket</DialogTitle>
        <DialogDescription>
          Your USDC is being rebalanced to composition tokens, after which you will receive basket tokens in your wallet.
          You can close this popup.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Tokens
        </p>
        <div className="flex items-center gap-2 flex-wrap">
        { // bought
        state.supportedTokens && tempAccount &&
            tempAccount.data.token.map((token, i) => {
              let tokenData = state.supportedTokens.find(t => t.id === token.toNumber());
              let amountBought = tempAccount.data.amountBought[i].toNumber();
              if (!tokenData || (token == 0 && i > 0)) return <></>;
              if (token == 0) amountBought = tempAccount.data.usdcLeft.toNumber();
              if (amountBought == 0) return <></>;
              return <div key={i} className="p-1 pr-2 rounded-full border bg-background-over flex items-center gap-1">
                <TokenIcon symbol={tokenData.tokenMint} size={24} />
                <p className="text-sm font-bold">{tokenData.symbol}</p>
                <CheckmarkIcon/>
              </div>
            })  
          }
          { // buying in progress
          state.supportedTokens && tempAccount &&
            tempAccount.data.token.map((token, i) => {
              let tokenData = state.supportedTokens.find(t => t.id === token.toNumber());
              let amountToSpend = tempAccount.data.amountToSpend[i].toNumber();
              if (!tokenData || token == 0 || amountToSpend == 0) return <></>;
              return <div key={i} className="p-1 pr-2 rounded-full border bg-background-over flex items-center gap-1">
                <TokenIcon symbol={tokenData.tokenMint} size={24} />
                <p className="text-sm font-bold">{tokenData.symbol}</p>
                <LoaderIcon/>
              </div>
            })  
          }
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        You can also click rebalance and then mint to speed up the process.
        Minting without rebalancing tokens might result in a high slippage.
      </p>
      <DialogFooter>
        <Button onClick={() => rebalance()}>Rebalance</Button>
        <Button onClick={() => mint()}>Mint</Button>
      </DialogFooter>
    </DialogContent>
    
  </Dialog>
}