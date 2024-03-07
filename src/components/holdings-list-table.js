import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GenerativeAvatar from "./generative-avatar";
import { Badge } from "./ui/badge";
import { PriceChange } from "./price-change";
import { VaultTypeToString, formatNumber } from "@/utils/utils";
import { useRouter } from "next/router";

const HoldingsListTable = ({ holdings=[] }) => {
  const router = useRouter();

  const openBasket = (holding) => {
    router.push(`/view/${holding.sortkey}`);
  }

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Basket</TableHead>
        <TableHead>1H</TableHead>
        <TableHead>24H</TableHead>
        <TableHead>7D</TableHead>
        <TableHead>30D</TableHead>
        <TableHead>All</TableHead>
        <TableHead className="text-right">Balance</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {holdings.map((holding, i) => (
        <TableRow onClick={() => openBasket(holding)} key={i} className="h-16 cursor-pointer">
          <TableCell className="font-medium flex items-center gap-2">
            <GenerativeAvatar seed={holding.symbol} size={36}/>
            <div className="flex flex-col gap-1">
              <p className="text-md">
                {
                  holding.name
                }
              </p>
              <div className="flex items-center gap-1">
                <Badge variant={"outline"} className="w-fit">
                  {
                    holding.symbol
                  }
                </Badge>
                <Badge variant={"secondary"} className="w-fit">
                  {
                    VaultTypeToString(holding.actively_managed)
                  }
                </Badge>
              </div>
            </div>
          </TableCell>
          <TableCell className="">
            {
              holding.precise_historical ?
              <PriceChange className="w-fit" change={
                holding.price / holding.precise_historical.data['1h'].price * 100 - 100
              }/>
              :
              <p className="text-md font-bold text-muted-foreground">N/A</p>
            }
          </TableCell>
          <TableCell className="">
            {
              holding.precise_historical ?
              <PriceChange className="w-fit" change={
                holding.price / holding.precise_historical.data['24h'].price * 100 - 100
              }/>
              :
              <p className="text-md font-bold text-muted-foreground">N/A</p>
            }
          </TableCell>
          <TableCell className="">
            {
              holding.precise_historical ?
              <PriceChange className="w-fit" change={
                holding.price / holding.precise_historical.data['7d'].price * 100 - 100
              }/>
              :
              <p className="text-md font-bold text-muted-foreground">N/A</p>
            }
          </TableCell>
          <TableCell className="">
            {
              holding.precise_historical ?
              <PriceChange className="w-fit" change={
                holding.price / holding.precise_historical.data['30d'].price * 100 - 100
              }/>
              :
              <p className="text-md font-bold text-muted-foreground">N/A</p>
            }
          </TableCell>
          <TableCell className="">
            <PriceChange className="w-fit" change={holding.price}/>
          </TableCell>
          <TableCell className="text-right">
            <p className="text-md font-bold">
              ${
                formatNumber(holding.account.balance * holding.price,2)
              }
            </p>
            <p className="text-muted-foreground text-sm">
              {
                formatNumber(holding.account.balance, 2) + " " + holding.symbol
              }
            </p>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}

export default HoldingsListTable;