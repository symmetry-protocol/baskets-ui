import { LoadSymmetryBasketHistory } from "@/utils/symmetry";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { SOL_TOKEN, formatNumber } from "@/utils/utils";
import {format} from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Skeleton } from "./ui/skeleton";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Image from "next/image";
import { getNiceTickValues } from "recharts-scale";
import { BIRDEYE_API_KEY } from "@/redux/globalState";


function customDomain([dataMin, dataMax], _allowDataOverflow, TICK_COUNT=5) {
  const dataAbsMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
  const tickValues = getNiceTickValues([-dataAbsMax, dataAbsMax], TICK_COUNT, true);
  return [tickValues[0], tickValues[TICK_COUNT - 1]];
};


export const VaultChart = ({vault, address, benchmark=false}) => {

  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState("1d");
  const [chartLoading, setChartLoading] = useState(true);

  const [benchmarkChart, setBenchmarkChart] = useState(null);
  const [compareDropdown, setCompareDropdown] = useState(false);
  
  const [searchableTokens, setSearchableTokens] = useState(null);
  const [benchmarkToken, setBenchmarkToken] = useState({address: SOL_TOKEN.tokenMint, symbol: "SOL"});
  const [highestValue, setHighestValue] = useState('value');

  useEffect(() => {
    if(vault) {
      let tokens = [];
      vault.current_comp_token.map(token => {
        tokens.push(token)
      })
      setSearchableTokens(tokens);
    }
  }, [vault]);

  const updateBenchmarkToken = (value) => {
    setBenchmarkToken(value);
    setCompareDropdown(false);
  }

  const LoadBenchmark = async () => {
    let formatted = [];
    let time = parseInt(new Date().getTime() / 1000);
    let from = time - parseInt(parseInt(timeframe.split('d')[0]) * 24 * 60 * 60);
    let interval = '5m';
    if(timeframe === '7d') interval = '1H';
    if(timeframe === '30d') interval = '1H';
    if(timeframe === '90d') interval = '1H';
    if(timeframe === '180d') interval = '1D';
    if(timeframe === '365d') interval = '1D';
    let request = await fetch(`https://public-api.birdeye.so/defi/history_price?address=${benchmarkToken.address}&address_type=token&type=${interval}&time_from=${from}&time_to=${time}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY
      }
    });
    let response = await request.json();
    if(response.success !== "false") {
      let benchmarkChart = response.data.items;
      // console.log("[benchmark]", data);
      let highestValue = 'value';
      for(let i = 0; i < benchmarkChart.length; i++) {
        formatted.push({
          time: benchmarkChart[i].unixTime,
          value: benchmarkChart[i].value / benchmarkChart[0].value * 100 - 100
        })
      }
    }
    
    return formatted;
  }

  useEffect(() => {
    if(address && timeframe) {
      setChartLoading(true);
      LoadSymmetryBasketHistory(address, timeframe).then(history => {
        if(history && history.status != 'fail') {
          let data = history.data.fund;
          let formatted = [];
          for(let i = 0; i < data.length; i++) {
            formatted.push({
              time: data[i].time * 1000,
              value: (data[i].price / data[0].price) * 100 - 100
            })
          }
          if(benchmark) {
            LoadBenchmark().then(benchmarkChart => {
              let highestValueLabel = 'value';
              let highestValue = 0;
              for (let i = 0; i < formatted.length; i++) {
                if(benchmarkChart[i]) {
                  formatted[i].benchmark = benchmarkChart[i].value || 0
                  if(formatted[i].value > highestValue || formatted[i].benchmark > highestValue) {
                    if(formatted[formatted.length-1].value > formatted[formatted.length-1].benchmark) {
                      highestValue = formatted[formatted.length-1].value;
                      highestValueLabel = 'value';
                    } else { 
                      highestValue = formatted[formatted.length-1].benchmark;
                      highestValueLabel = 'benchmark';
                    }
                  }
                }
              }
              setHighestValue(highestValueLabel);
              // console.log('formatted', formatted)
              setChart(formatted);
              setChartLoading(false);
            })
          } else {
            setChart(formatted);
            setChartLoading(false);
          }
        }
      })
    }
  }, [timeframe, address, benchmarkToken]);

  return <div className="w-full h-full flex flex-col gap-2">
    <div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold">Chart</h1>
        {
          benchmark &&
          <div className="flex items-center gap-2">
            <Badge variant={"outline"} className="text-xs cursor-pointer" onClick={() => setCompareDropdown(true)}>
              Compare
            </Badge>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                <p className="text-xs">Performance</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#fa664f]"></div>
                <p className="text-xs">Benchmark ({benchmarkToken.symbol})</p>
              </div>
            </div>
          </div>
        }
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={timeframe === '1d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("1d")}>24H</Badge>
        <Badge variant={timeframe === '7d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("7d")}>7D</Badge>
        <Badge variant={timeframe === '30d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("30d")}>30D</Badge>
        <Badge variant={timeframe === '90d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("90d")}>3M</Badge>
        <Badge variant={timeframe === '180d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("180d")}>6M</Badge>
        <Badge variant={timeframe === '365d' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("365d")}>1Y</Badge>
        <Badge variant={timeframe === 'all' ? "secondary" : "outline"} className="cursor-pointer" onClick={() => setTimeframe("all")}>All</Badge>
      </div>
    </div>
    {
      !chartLoading ?
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={300}
          data={chart}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="time"
            interval={Math.floor(chart.length / 3)}
            axisLine={false}
            tickLine={false}
            tickFormatter={(date) => format(new Date(date), "d MMM, HH:mm")}
            dx={50}
            // tick={<CustomizedAxisTick />}
            hide
          />
          <YAxis
            orientation={"right"}
            mirror={true}
            type="number"
            // domain={customDomain} 
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            dy={-10}
            opacity={0.5}
            tickCount={5}
            tick={true}
            tickFormatter={(number) => {
              return formatNumber(number, 2) + "%";
            }}
          />
          
          <Tooltip cursor={{ stroke: 'hsl(var(--secondary))', strokeWidth: 2, type:"dashed" }} content={<CustomToolTip title={"Performance"} />} offset={0} position={{y:100}} isAnimationActive={false}/>
          <Area fill={"#22c55e"+"49"} dot={false} type="linear" dataKey={"value"} strokeWidth={2} stroke={"#22c55e"} />
          {
            benchmark &&
            <Area fill={"#fa664f"+"29"} dot={false} type="linear" dataKey={"benchmark"} strokeWidth={2} stroke={"#fa664f"} />
          }
        </AreaChart>
      </ResponsiveContainer>
      :
      <Skeleton className="w-full h-full"/>
    }
    {
      <CommandDialog open={compareDropdown} onOpenChange={() => setCompareDropdown(false)}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search Token or Portfolio..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Benchmark">
              <CommandItem className="flex items-center justify-between gap-2" onSelect={() => updateBenchmarkToken(SOL_TOKEN)}>
                <div className="flex items-center gap-2">
                  <Image src={SOL_TOKEN.logoURI} width={24} height={24} className="rounded-full" alt="Token"/>
                  <span>SOL</span>
                </div>
                <Badge variant={"outline"} className="text-xs">
                  {
                    SOL_TOKEN.tokenMint.slice(0,3) + "..." + SOL_TOKEN.tokenMint.slice(-3)
                  }
                </Badge>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Tokens">
              
              {
                searchableTokens &&
                searchableTokens.map((token, i) => {
                  if(token.address !== SOL_TOKEN.tokenMint)
                  return <CommandItem 
                    className="flex items-center justify-between gap-2" 
                    key={i}
                    onSelect={() => updateBenchmarkToken(token)}
                    >
                      <div className="flex items-center gap-2">
                        <Image src={token.logoURI} width={24} height={24} className="rounded-full" alt="Token"/>
                        <span>{token.symbol}</span>
                      </div>
                      <Badge variant={"outline"} className="text-xs">
                        {
                          token.address.slice(0,3) + "..." + token.address.slice(-3)
                        }
                      </Badge>
                    </CommandItem>
                })
              }
            
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Portfolios & Bundles">
              <CommandItem>
                <span>Solana LSD</span>
                <CommandShortcut>ySOL</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    }
    
  </div>
}


function CustomToolTip({ active, payload, title }) {
  if(!active || !payload || payload.length == 0) return "";
  const assetPrice = payload && active
  ? formatNumber(payload[0].payload["value"])
  : "";
  const benchPrice = payload && active && payload[0].payload["benchmark"]
  ? formatNumber(payload[0].payload["benchmark"])
  : "";

  return <div className="flex flex-col gap-2 border bg-background rounded-xl p-3">
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-sm font-bold text-[#22c55e]">{formatNumber(assetPrice,2)}%</p>
    </div>
    {
      benchPrice !== "" &&
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">Benchmark</p>
        <p className="text-sm font-bold text-[#fa664f]">{formatNumber(benchPrice,2)}%</p>
      </div>
    }
    <div className="flex items-center gap-1 text-muted-foreground">
      <CalendarIcon/>
      <p className="text-xs">{format(new Date(payload[0].payload.time), "MMM d yyyy, HH:mm")}</p>
    </div>
  </div>
}