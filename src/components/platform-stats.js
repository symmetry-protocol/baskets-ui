import { useEffect, useState } from "react"
import { PriceChange } from "./price-change"
import { Skeleton } from "./ui/skeleton";
import { formatNumber } from "@/utils/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";


export const PlatformStats = ({ }) => {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('https://cache.symmetry.fi/general-overview.json').then(res => res.json()).then(data => {
      setStats(data);
    });
  }, []);

  return <div className="w-full flex flex-col gap-4 mt-4">
    <div className="text-xl font-bold flex items-center justify-between gap-2">
      <p>Platform <span className="text-muted-foreground font-normal"> · 24h</span></p>
      <ArrowRightIcon className="cursor-pointer"/>
    </div>
    
    {
      stats ?
      <div className="w-full grid gird-cols-2 md:grid-cols-4 items-center gap-4">
        <div className="w-full flex flex-col gap-2 border p-4 rounded-xl">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Value Locked</p>
            <PriceChange label={""} change={stats.tvl.change / stats.tvl.total * 100} />
          </div>
          <p className="text-2xl font-bold">
            ${formatNumber(stats.tvl.total,0)}
          </p>
        </div>
        <div className="w-full flex flex-col gap-2 border p-4 rounded-xl">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <PriceChange label={""} change={stats.volume.change / stats.volume.total * 100} />
          </div>
          <p className="text-2xl font-bold">
            ${formatNumber(stats.volume.total,0)}
          </p>
        </div>
        <div className="w-full flex flex-col gap-2 border p-4 rounded-xl">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Revenue</p>
            <PriceChange label={""} change={stats.fees.change / stats.fees.total * 100} />
          </div>
          <p className="text-2xl font-bold">
            ${formatNumber(stats.fees.total,0)}
          </p>
        </div>
        <div className="w-full flex flex-col gap-2 border p-4 rounded-xl">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Baskets</p>
            <PriceChange label={""} change={stats.funds.change} />
          </div>
          <p className="text-2xl font-bold">
            {formatNumber(stats.funds.total,0)}
          </p>
        </div>
      </div>
      :
      <div className="w-full grid gird-cols-2 md:grid-cols-4 items-center gap-2">
        {
          Array.from({ length: 4 }).map((_, i) => {
            return <div key={i} className="w-full flex flex-col gap-2 border p-4 rounded-xl">
                <div className="w-full flex items-center justify-between">
                  <Skeleton className="w-12 h-4"/>
                  <Skeleton className="w-12 h-4"/>
                </div>
                <Skeleton className="w-16 h-4"/>
              </div>
          })
        } 
      </div>
    }
  </div>
}