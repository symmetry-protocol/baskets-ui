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

export const CreatedBasketsTable = ({ baskets=[] }) => {
  const router = useRouter();

  const openBasket = (basket) => {
    router.push(`/view/${basket.basket.ownAddress.toBase58()}`);
  }

  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Basket</TableHead>
        <TableHead>All-time ROI</TableHead>
        <TableHead className="text-right">TVL</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {baskets.map((basket, i) => (
        <TableRow onClick={() => openBasket(basket)} key={i} className="h-16 cursor-pointer">
          <TableCell className="font-medium flex items-center gap-2">
            <GenerativeAvatar seed={basket.parsed.symbol} size={36}/>
            <div className="flex flex-col gap-1">
              <p className="text-md">
                {
                  basket.parsed.name
                }
              </p>
              <div className="flex items-center gap-1">
                <Badge variant={"outline"} className="w-fit">
                  {
                    basket.parsed.symbol
                  }
                </Badge>
                <Badge variant={"secondary"} className="w-fit">
                  {
                    VaultTypeToString(basket.parsed.activelyManaged)
                  }
                </Badge>
              </div>
            </div>
          </TableCell>
          <TableCell className="">
            <PriceChange className="w-fit" change={basket.parsed.rawPrice}/>
          </TableCell>
          <TableCell className="text-right">
            <p className="text-md font-bold">
              ${
                formatNumber(basket.parsed.basketWorth, 2)
              }
            </p>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}