import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { VaultTypeToString, formatNumber } from "@/utils/utils"
import { Skeleton } from "./ui/skeleton"
import { ArrowBottomRightIcon, ArrowTopRightIcon, Pencil1Icon, ReloadIcon } from "@radix-ui/react-icons"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "./ui/button"
import { TokenIcon } from "./token-icon"
import { useSelector } from "react-redux"
import Pyth from "/public/static/icons/pythIcon.svg";
import Switchboard from "/public/static/icons/switchboardIcon.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const CompositionTable = ({setEditHoldingsPopup,  rebalanceHoldings, basket=null}) => {
  const state = useSelector(state => state.storage);

  const wallet = useWallet();

  console.log(state.supportedTokens);
  if(!basket) return <Skeleton className="w-full h-64"/>

  return <div className="w-full flex flex-col gap-2 p-4 border rounded-xl">
    <div className="w-full flex items-center justify-between">
      <p className="text-sm font-bold">
        {
          VaultTypeToString(basket.parsed.activelyManaged) + " "
        } Holdings
      </p>
      {
        wallet.connected && basket.parsed.manager === wallet.publicKey.toBase58() &&
        <div className="flex items-center gap-2">
          <Button variant={"secondary"} className="gap-2" onClick={() => rebalanceHoldings()}>
            <ReloadIcon/>
            Rebalance
          </Button>
          <Button variant={"secondary"} className="gap-2" onClick={() => setEditHoldingsPopup(true)}>
            <Pencil1Icon/>
            Manage
          </Button>
        </div>
      }
    </div>
    
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Token</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Target</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        { basket.parsed.basketWorth > 0 &&
          basket.parsed.currentComposition.map((token, index) => {
          if(token.targetWeight > 0 || token.lockedAmount > 0)
          return <TableRow key={index}>
            <TableCell className="flex items-center gap-4">
              <TokenIcon symbol={token.mintAddress} size={32} className="rounded-full" alt="Token"/>
              <div className="flex flex-col overflow-hidden">
                <p className="text-sm text-muted-foreground whitespace-nowrap text-ellipsis">{token.name}</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold">{token.symbol}</p>
                  {/* <Badge variant={"outline"} className="w-fit rounded flex items-center gap-1">
                    
                  </Badge> */}
                  {
                    token.change_24h &&
                    <div variant={"outline"} className={`${token.change_24h >= 0 ? 'text-green-700' : 'text-red-700'} w-fit rounded flex items-center gap-1`}>
                      {
                        token.change_24h >= 0 ?
                        <ArrowTopRightIcon width={14} height={14}/>
                        :
                        <ArrowBottomRightIcon width={14} height={14}/>
                      }
                      <p className="text-xs font-bold">{formatNumber(token.change_24h, 2)}%</p>
                    </div>
                  }
                </div>
              </div>
            </TableCell>
            <TableCell className="text-sm font-bold">
              {formatNumber(token.currentWeight, 2)}%
            </TableCell>
            <TableCell className="text-muted-foreground">
              <div className="flex items-center gap-2">
                <p className="w-14">
                  {
                    formatNumber(token.targetWeight, 2)
                  }%
                </p>
                { state.supportedTokens &&
                 state.supportedTokens.map((supportedToken, index) => {
                  if(supportedToken.tokenMint === token.mintAddress) {
                    if(supportedToken.oracleType === "Pyth") return <TooltipProvider key={index}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <Pyth height={24} key={index}/>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Powered by Pyth Oracle</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    else if(supportedToken.oracleType === "Switchboard") return <TooltipProvider key={index}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                        <Switchboard height={16} key={index}/>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Powered by Switchboard Oracle</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  }
                 })
                }
              </div>
              
            </TableCell>
            <TableCell className="text-right">
              <p className="text-sm font-bold">
                {
                  formatNumber(token.lockedAmount, 2) + " " + token.symbol
                }
              </p>
              <p className="text-xs text-muted-foreground">
                ${
                  formatNumber(token.usdValue, 2)
                }
              </p>
              
            </TableCell>
          </TableRow>

        })
      }
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
    {
      basket.parsed.basketWorth === 0 &&
      <p className="text-muted-foreground text-center w-full flex items-center justify-center h-64">
        Basket is currently empty. Deposit to view basket holdings.
      </p>
    }
  </div>
}