import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Skeleton } from "./ui/skeleton";
import { formatNumber } from "@/utils/utils";


export const UserVaultHolding = ({vaultToken=null}) => {

  const state = useSelector((state) => state.storage);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if(state.accounts && vaultToken) {
      let balance = state.accounts.find(a => a.address === vaultToken.address);
      if(!balance) balance = 0;
      else balance = balance.balance;
      setUserBalance(balance);
    }
  }, [state.accounts, vaultToken]);

  if(!vaultToken) return <div className="w-full border rounded-xl p-4 gap-2 flex flex-col">
    <p className="text-sm font-bold">
      Your Holdings
    </p>
    <Skeleton className="w-full h-8"/>
  </div>

  return <div className="w-full border rounded-xl p-4 gap-2 flex flex-col select-none">
    <p className="text-sm font-bold">
      Your Holdings
    </p>
    <p className="text-xl font-bold">
      {userBalance ? formatNumber(userBalance,6) : 0} {vaultToken.symbol}
      <span className="text-sm font-normal text-muted-foreground"> ≈ ${userBalance ? formatNumber(userBalance * vaultToken.price,2) : 0}</span>
    </p>
  </div>
}