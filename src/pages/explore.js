import GenerativeAvatar from "@/components/generative-avatar";
import { Header } from "@/components/header";
import { HOST_PUBKEY } from "@/redux/globalState";
import { useSymmetry } from "@/utils/SymmetryContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/utils";
import { LOAD_BASKETS_HISTORICAL_DATA } from "@/utils/symmetry";
import { TokenIcon } from "@/components/token-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/router";
import { PriceChange } from "@/components/price-change";

const NumberOfItemsPerPage = 25;

const ExplorePage = ({}) => {
  const router = useRouter();
  const sdk = useSymmetry();
  const wallet = useWallet();
  const [basketsLoaded, setBasketsLoaded] = useState(false);
  const [baskets, setBaskets] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  const [page, setPage] = useState(1);
  /* Load baskets created using Symmetry Host UI */
  useEffect(() => {
    if (sdk) {
      sdk.findBaskets([{
        filterType: "host",
        filterPubkey: HOST_PUBKEY
      }]).then((_baskets) => {
        /* findBaskets doesn't include basket compositions & current values like
        name, symbol, TVL, price, so we need to fetch them separately through getCurrentCompositions */
        sdk.getCurrentCompositions(_baskets).then((compositions) => {
          _baskets.forEach((basket, i) => {
            basket.parsed = compositions[i];
          });
          _baskets.sort((a, b) => b.parsed.basketWorth - a.parsed.basketWorth);
          console.log('baskets loaded', _baskets);
          setBaskets(_baskets);
          setBasketsLoaded(true);
        })
      });
    }
  }, [sdk]);

  useEffect(() => {
    if(basketsLoaded) {
      let _baskets = Object.assign([],baskets);
      /* 
        Load historical data for current page of baskets through Symmetry API
      */
      LOAD_BASKETS_HISTORICAL_DATA(page).then((historicalData) => {
        // add historicalData to baskets
        historicalData.map((data) => {
          let index = _baskets.findIndex((basket) => basket.ownAddress.toBase58() === data.sortkey);
          if(index > -1) {
            console.log('basket', _baskets, index, _baskets[index])
            _baskets[index].historicalData = data;
          }
        })
        setBaskets(_baskets);
        console.log('historicalData Loaded', _baskets)
      });
    }
  }, [page, basketsLoaded]);

  const viewBasket = (address) => {
    router.push(`/view/${address}`);
  }


  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header
      title={"Explore | Symmetry"}
      path="/explore"
    />
    <div className="w-full flex flex-col px-4 gap-4 mt-4">
      <div className="w-full flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Explore Baskets</h2>
        <p className="text-muted-foreground text-center">Discover portfolios and bundles created by the community</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[350px] shrink-0">Name</TableHead>
            <TableHead>TVL</TableHead>
            <TableHead>Composition</TableHead>
            <TableHead className="text-center w-[100px]">24H</TableHead>
            <TableHead className="text-center w-[100px]">7D</TableHead>
            <TableHead className="text-center w-[100px]">1M</TableHead>
            <TableHead className="text-center w-[100px]">ALL</TableHead>
            {/* <TableHead className="text-right">1W Chart</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          { baskets ?
          baskets.map((basket, i) => {
            if(i < page * NumberOfItemsPerPage && i >= (page - 1) * NumberOfItemsPerPage)
            return <TableRow onClick={() => viewBasket(basket.ownAddress.toBase58())} key={i} className="h-16 cursor-pointer">
              <TableCell className="font-medium">{i+1}.</TableCell>
              <TableCell className="flex items-center gap-2 w-[200px] shrink-0">
                <GenerativeAvatar seed={basket.parsed?.symbol} size={32} />
                <div className="flex flex-col">
                  <p className="text-md">{basket.parsed.name.length > 16 ? basket.parsed.name.slice(0,16)+"..." : basket.parsed.name}</p>
                  <Badge variant={"outline"} className="w-fit">
                    {basket.parsed.symbol}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="font-bold">$
                {formatNumber(basket.parsed.basketWorth,2)}
              </TableCell>
              <TableCell className="flex items-center gap-1 w-[200px] shrink-0">
                {
                  basket.parsed ?
                  basket.parsed.currentComposition.map((comp, i) => {
                    if(i < 5 && comp.targetWeight > 0)
                    return <TokenIcon symbol={comp.mintAddress} size={24} key={i} />
                  })
                  :
                  [0,0,0].map((_, i) => {
                    return <Skeleton className="w-6 h-6 rounded-full" key={i} />
                  })
                }
                {
                  basket.parsed.currentComposition.length > 5 &&
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">+{basket.parsed.currentComposition.length - 5}</p>
                  </div>
                }
              </TableCell>
              <TableCell className="text-center">
                {
                  basket.historicalData ?
                    (basket.historicalData.precise_historical.data['24h'] && basket.historicalData.precise_historical?.data['24h'].price > 0) ?
                    <PriceChange className="items-center" change={basket.parsed.rawPrice / basket.historicalData.precise_historical?.data['24h'].price * 100 - 100} />
                    :
                    <PriceChange className="items-center" change={basket.parsed.rawPrice - 100} />

                  :
                  <Skeleton className="w-10 h-4" />
                }
              </TableCell>
              <TableCell className="text-center">
                {
                  basket.historicalData ?
                  (basket.historicalData.precise_historical.data['7d'] && basket.historicalData.precise_historical?.data['7d'].price > 0) ?
                    <PriceChange className="items-center" change={basket.parsed.rawPrice / basket.historicalData.precise_historical?.data['7d'].price * 100 - 100} />
                    :
                    <PriceChange className="items-center" change={basket.parsed.rawPrice - 100} />
                    :
                  <Skeleton className="w-10 h-4" />
                }
              </TableCell>
              <TableCell className="text-center">
                {
                  basket.historicalData ?
                  (basket.historicalData.precise_historical.data['30d'] && basket.historicalData.precise_historical?.data['30d'].price > 0) ?
                    <PriceChange className="items-center" change={basket.parsed.rawPrice / basket.historicalData.precise_historical?.data['30d'].price * 100 - 100} />
                    :
                    <PriceChange className="items-center" change={basket.parsed.rawPrice - 100} />
                    :
                  <Skeleton className="w-10 h-4" />
                }
              </TableCell>
              <TableCell className="text-center">
                {
                  basket?.parsed?.rawPrice ?
                  <PriceChange className="items-center" change={basket.parsed.rawPrice - 100} />
                  :
                  <Skeleton className="w-10 h-4" />
                }
              </TableCell>
              {/* <TableCell className="text-right"></TableCell> */}
            </TableRow>
          })
          :
          
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map((_, i) => {
              return <TableRow key={i} className="h-16">
                <TableCell className="font-medium">{i+1}.</TableCell>
                <TableCell className="flex items-center gap-2 w-[200px] shrink-0">
                  <GenerativeAvatar seed={"loading"} size={32} />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-12 h-4"/>
                    <Skeleton className="w-6 h-4"/>
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  <Skeleton className="w-16 h-6" />
                </TableCell>
                <TableCell className="flex items-center gap-1 w-[200px] shrink-0">
                  {
                    [0,0,0,0,0].map((_, i) => {
                      return <Skeleton className="w-6 h-6 rounded-full" key={i} />
                    })
                  }
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-10 h-4" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-10 h-4" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-10 h-4" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="w-10 h-4" />
                </TableCell>
                {/* <TableCell className="text-right"></TableCell> */}
              </TableRow>
            })
        }
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious className="cursor-pointer select-none" onClick={() => {
              if(page > 1) setPage((page) => page-1)
            }} />
          </PaginationItem>
          { baskets &&
            baskets.length > NumberOfItemsPerPage && Array.from({length: Math.ceil(baskets.length / NumberOfItemsPerPage)}, (_, i) => {
              if((i + 1) - page < 3 && (i + 1) - page > -3)
              return <PaginationItem key={i}>
                <PaginationLink className="cursor-pointer select-none" onClick={() => setPage(i+1)} isActive={page === i +1}>
                  {
                    i + 1
                  }
                </PaginationLink>
              </PaginationItem>
            })
          }
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext className="cursor-pointer select-none" onClick={() => {
              if(page < Math.ceil(baskets.length / NumberOfItemsPerPage))
              setPage((page) => page+1)
            }}/>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
}

export default ExplorePage;