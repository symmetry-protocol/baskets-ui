import { VaultTypeToString, formatNumber } from "@/utils/utils"
import { CalendarIcon, LightningBoltIcon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Skeleton } from "./ui/skeleton"
import { Separator } from "./ui/separator"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { EditVaultDescription } from "./vault-management/edit-description"


export const VaultInfoBox = ({vault}) => {

  const [editOpened, setEditOpened] = useState(false);
  const wallet = useWallet();
  
  return <div className="w-full flex flex-col gap-2 p-4 border rounded-xl">
    <div className="w-full flex items-center justify-between h-9">
      <p className="text-sm font-bold">
        About 
        { " " + 
          VaultTypeToString(vault?.actively_managed)
        }
      </p>
      {/* { vault &&
        wallet.connected && vault.manager === wallet.publicKey.toBase58() &&
        <div className="flex items-center gap-2">
          <Button variant={"secondary"} size="icon" onClick={() => setEditOpened(true)}>
            <Pencil1Icon/>
          </Button>
        </div>
      } */}
    </div>
    {/* <p className="text-sm text-muted-foreground h-[60px]">
      This is a description of the vault. It will contain information about the vault, the assets it contains, the strategy it follows, and the performance it has had.
    </p> */}
    {/* <Separator className="my-2" /> */}
    <div className="w-full flex gap-6 items-center h-12">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">
          Created on
        </p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon/>
          {
            vault ?
              vault.api ?
                <p className="text-sm">{format(vault.api.creation_time * 1000, "dd/MM/yyyy")}</p>
              :
                <p className="text-sm">Symmetry</p>
            :
            <Skeleton className="w-12 h-3"/>
          }
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">
          TVL
        </p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <LightningBoltIcon/>
          {
            vault ?
            <p className="text-sm">${formatNumber(vault.parsed.basketWorth, 2)}</p>
            :
            <Skeleton className="w-12 h-3"/>
          }
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold">
          Holders
        </p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <PersonIcon/>
          {
            (vault && vault.api) ?
              vault.api.holders ?
                <p className="text-sm">{formatNumber(vault.api.holders, 2)}</p>
                :
                <p className="text-sm">0</p>
            :
            <Skeleton className="w-6 h-3"/>
          }
        </div>
      </div>
    </div>
    <EditVaultDescription 
      open={editOpened} 
      onClose={() => setEditOpened(false)}
      vault={vault}
    />
  </div>
}