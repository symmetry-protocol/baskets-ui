import Image from "next/image"
import { Skeleton } from "./ui/skeleton"
import { VaultTypeToString, formatNumber } from "@/utils/utils"
import { useState } from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { TokenIcon } from "./token-icon"

export const VaultValue = ({vault=null}) => {
  const [dropdown, setDropdown] = useState(true);
  console.log(vault);
  if(!vault) return <div className="w-full border rounded-xl p-4 gap-2 flex flex-col">
    <p className="text-sm font-bold">
      Vault Token
    </p>
    <Skeleton className="w-full h-8"/>
  </div>

  return <div className="w-full border rounded-xl p-4 gap-2 flex flex-col">
    <div className="w-full select-none flex items-center justify-between cursor-pointer" onClick={() => setDropdown(!dropdown)}>
      <p className="text-sm font-bold">
        About 
        {" " + VaultTypeToString(vault.activelyManaged) + " "} 
         Token
      </p>
      <ChevronDownIcon className={`${dropdown ? "transform rotate-180" : ""}`}/>
    </div>
    {
      dropdown &&
      <div className="w-full flex flex-col gap-3">
        <p className="text-xl font-bold">
          1 {vault.symbol} = <span className="text-muted-foreground">${formatNumber(vault.rawPrice ? vault.rawPrice : 100, 2)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Each { VaultTypeToString(vault.activelyManaged) } token holds/represents multiple assets and is redeemable for them or to their USDC value at any time.
        </p>
        <Table className="w-full">
          <TableBody className="w-full">
            {
              vault.currentComposition.map((token, i) => {
                if(token.lockedAmount > 0)
                return <TableRow key={i} className="w-full">
                  <TableCell className="flex items-center gap-2">
                    <TokenIcon symbol={token.mintAddress} size={24} className="rounded-full" alt="Token"/>
                    <p className="text-sm">{formatNumber(token.lockedAmount / vault.currentSupply, 2)}</p>
                    <p className="text-sm font-bold">{token.symbol}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-sm text-muted-foreground">${formatNumber(token.usdValue / vault.currentSupply, 2)}</p>
                  </TableCell>
                </TableRow>
              })
            }
          </TableBody>
        </Table>
      </div>
    }
  </div>
}