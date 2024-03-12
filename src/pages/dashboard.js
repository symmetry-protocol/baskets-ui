import { CreatedBasketsTable } from "@/components/created-baskets-table";
import { CreatorCard } from "@/components/creator-card";
import { Header } from "@/components/header";
import HoldingsListTable from "@/components/holdings-list-table";
import { Level } from "@/components/level";
import PortfolioChart from "@/components/portfolio-chart";
import { PriceChange } from "@/components/price-change";
import { useSymmetry } from "@/utils/SymmetryContext";
import { ChevronDownIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LevelBadge } from "@/components/level-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { POINTS_TO_LEVEL, formatNumber } from "@/utils/utils";
import { GET_USER_POINTS } from "@/utils/symmetry";

const DashboardPage = () => {
  const wallet = useWallet();
  const state = useSelector((state) => state.storage);
  const sdk = useSymmetry();

  const [userTokens, setUserTokens] = useState();
  const [userCreatedBaskets, setUserCreatedBaskets] = useState();

  const [baskets, setBaskets] = useState(null);

  const [holdingsDropdown, setHoldingsDropdown] = useState(true);
  const [managedBasketsDropdown, setManagedBasketsDropdown] = useState(true);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    if(wallet.connected) {
      GET_USER_POINTS(wallet.publicKey.toBase58()).then(data => {
        setPoints(data);
      })
    }
  },[wallet.connected]);
  /* Load baskets by this creator */
  useEffect(() => {
    if (wallet.connected && sdk) {
      sdk.findBaskets([{
        filterType: "manager",
        filterPubkey: wallet.publicKey
      }]).then(foundBaskets => {
        sdk.getCurrentCompositions(foundBaskets).then(parsedData => {
          let createdBaskets = foundBaskets.map((b, i) => {
            return {
              basket: b,
              parsed: parsedData[i]
            }
          })
          setUserCreatedBaskets(createdBaskets);
          console.log('BASKT', createdBaskets)
        })
      });
    }
  }, [sdk, wallet.connected]);

  useEffect(() => {
    if(wallet.connected && state.accounts) {
      fetch('https://api.symmetry.fi/v1/funds-getter', 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"request":"get_funds","params":{"filters":{"by":"tvl","order":"desc"},"attributes":["creation_time","manager","name","symbol","short_historical","tvl","price","current_comp_token","actively_managed","sortkey","fund_token","image_uri", "precise_historical"],"count":500,"page":1,"actively_managed":null,"min_tvl":0}})
      }).then(res => res.json()).then(data => {
        let allBaskets = data.result;
        setBaskets(allBaskets);
        let basketHoldings = [];
        state.accounts.map(account => {
          allBaskets.map(basket => {
            if(basket.fund_token === account.address) {
              basketHoldings.push({...basket, account});
            }
          })
        })
        setUserTokens(basketHoldings);
        console.log('userTokens', basketHoldings)
      })
    }
  },[wallet.connected, state.accounts]);

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header
      title={"My Dashboard | Symmetry"}
      path="/dashboard"
    />
    <div className="w-full flex flex-col px-4 gap-8 mt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
          <div className="w-full flex flex-col gap-2 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Holdings</p>
              {/* <PriceChange label={""} change={12} /> */}
            </div>
            {
              userTokens ?
              <p class="text-2xl font-bold">
                ${
                  formatNumber(userTokens.reduce((acc, b) => acc + b.account.balance * b.price, 0),0)
                }
              </p>
              :
              <Skeleton className="w-16 h-8"/>
            }
          </div>
          <div className="w-full flex flex-col gap-2 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Baskets Held</p>
            </div>
            {
              userTokens ?
              <p class="text-2xl font-bold">
                {
                  userTokens.length
                }
              </p>
              :
              <Skeleton className="w-12 h-8"/>
            }
          </div>
          <div className="w-full flex flex-col gap-2 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">
                  Total AUM
                </p>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                      <InfoCircledIcon/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>TVL sum of all portfolios & bundles created by you</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* <PriceChange label={""} change={12} /> */}
            </div>
            {
              userCreatedBaskets ?
              <p class="text-2xl font-bold">
                ${
                  formatNumber(userCreatedBaskets.reduce((acc, b) => acc + b.parsed.basketWorth, 0),0)
                }
              </p>
              :
              <Skeleton className="w-16 h-8"/>
            }
          </div>
          <div className="w-full flex flex-col gap-2 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Points
              </p>
            </div>
            {
              points ?
              <div className="flex items-center justify-between">
                <p class="text-2xl font-bold">{formatNumber(points,0)}</p>
                <div className="hidden md:block">
                  <LevelBadge level={POINTS_TO_LEVEL(points)} />
                </div>
              </div>
              :
              <Skeleton className="w-16 h-8"/>
            }
          </div>
        </div>
        <PortfolioChart holdings={userTokens} />
      </div>
      
      <div className="flex flex-col gap-4">
        <div onClick={() => setHoldingsDropdown(!holdingsDropdown)}  className="w-full flex items-center cursor-pointer justify-between">
          <h2 className="text-xl font-bold">Holdings</h2>
          <ChevronDownIcon className={holdingsDropdown ? "" : "rotate-180"} width={24} height={24}/>
        </div>
        { holdingsDropdown &&
          (userTokens ?
            userTokens.length > 0 ?
              <HoldingsListTable holdings={userTokens}/>
            :
              <p className="w-full h-full text-center text-sm">
                You currently don't have any holdings.
              </p>
          :
          <p className="w-full h-full text-center text-sm">Your holdings will show up here</p>
          )
        }
        
      </div>
        
      <div className="flex flex-col gap-4">
        <div onClick={() => setManagedBasketsDropdown(!managedBasketsDropdown)}  className="w-full flex cursor-pointer items-center justify-between">
          <h2 className="text-xl font-bold">My Baskets</h2>
          <ChevronDownIcon className={managedBasketsDropdown ? "" : "rotate-180"} width={24} height={24}/>
        </div>
        { managedBasketsDropdown &&
          (userCreatedBaskets ?
            userCreatedBaskets.length > 0 ?
              <CreatedBasketsTable baskets={userCreatedBaskets}/>
            :
              <p className="w-full h-full text-center text-sm">
                You currently don't have any Baskets.
              </p>
          :
          <p className="w-full h-full text-center text-sm">Your Baskets will show up here</p>
          )
        }
      </div>

    </div>
  </div>
}

export default DashboardPage;