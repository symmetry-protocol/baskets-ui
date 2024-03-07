import { ChevronDownIcon, ChevronUpIcon, ClockIcon, LetterCaseCapitalizeIcon, ReloadIcon, TokensIcon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";


export const ManagerDashboard = ({setEditHoldingsPopup, rebalanceHoldings}) => {

  const wallet = useWallet();
  const [managerDropdown, setManagerDropdown] = useState(true);

  return <div className="w-full flex flex-col justify-between p-4 gap-4 border rounded-xl select-none">
    <div 
      className="w-full flex items-center justify-between cursor-pointer"
      onClick={() => setManagerDropdown(!managerDropdown)}
    >
      <p className="text-sm font-bold">
        Manager Dashboard
      </p>
      {
        managerDropdown ?
        <ChevronUpIcon/>
        :
        <ChevronDownIcon/>
      }
    </div>
    {
      managerDropdown &&
      <div className="flex flex-col gap-2">
        <div className="w-full grid grid-cols-2 md:flex items-center gap-2">
          <Button variant={"secondary"} className="gap-2" onClick={() => setEditHoldingsPopup(true)}>
            <TokensIcon/>
            <p className="text-sm font-bold">Edit Holdings</p>
          </Button>
          <Button onClick={() => {
            toast.success(<div className="flex flex-col">
            <p className="text-lg font-bold">Coming Soon</p>
            <p className="text-sm text-muted-foreground">Editing Basket Descriptions is under development.</p>
          </div>, {id: 2})
          }} variant={"secondary"} className="gap-2">
            <LetterCaseCapitalizeIcon/>
            <p className="text-sm font-bold">Edit Description</p>
          </Button>
          <Button onClick={() => {
            toast.success(<div className="flex flex-col">
            <p className="text-lg font-bold">Coming Soon</p>
            <p className="text-sm text-muted-foreground">
              TWAP Feature is coming soon. Stay tuned!
            </p>
          </div>, {id: 2})
          }} variant={"secondary"} className="gap-2">
            <ClockIcon/>
            <p className="text-sm font-bold">TWAP</p>
          </Button>
          <Button variant={"secondary"} className="gap-2" onClick={() => rebalanceHoldings()}>
            <ReloadIcon/>
            <p className="text-sm font-bold">Rebalance Holdings</p>
          </Button>
        </div>
      </div>
    }
  </div>
}