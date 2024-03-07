import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns'; // Make sure you have date-fns installed for date formatting
import { LoadSymmetryBasketHistory } from '@/utils/symmetry';
import { Badge } from './ui/badge';
import { formatNumber } from '@/utils/utils';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { CalendarIcon } from '@radix-ui/react-icons';

const colors = [
  "#22c55e", "#fa664f", "#f7b52b", "#4d7cf2", "#f2f2f2",
  "#1abc9c", "#9b59b6", "#34495e", "#D3F6DB", "#e74c3c",
  "#95a5a6", "#5A0B4D", "#A1EF8B", "#21295C", "#1C7293",
  "#17BEBB", "#EDB88B", "#EFEA5A", "#D00000"
];

// Assuming LoadSymmetryBasketHistory is an async function that fetches chart data
// async function LoadSymmetryBasketHistory(address, timeframe) {
//   // Implementation here
// }

const fetchMultipleCharts = async (addresses, timeframe) => {
  const promises = addresses.map(address => LoadSymmetryBasketHistory(address, timeframe));
  return Promise.all(promises);
};

const formatChart = (arrays) => {
  let formattedArray = [];
  if(arrays.length === 0) return formattedArray;
  arrays[0].forEach((item, index) => {
    let newObj = { time: item.time };
    arrays.forEach((arr, arrIndex) => {
      newObj[`price${arrIndex}`] = arr[index] ? arr[index].price / arr[0].price * 100 - 100 : null;
      newObj[`tvl${arrIndex}`] = arr[index] ? arr[index].tvl / arr[0].tvl * 100 - 100 : null;
    });
    formattedArray.push(newObj);
  });
  return formattedArray;
};

const PortfolioChart = React.memo(({ holdings = null }) => {

  const wallet = useWallet();
  const [timeframe, setTimeframe] = useState('1d');
  const [chartsData, setChartsData] = useState([]);
  const [chartStatus, setChartStatus] = useState(0); // 0 = loading, 1 = loaded, -1 = empty

  useEffect(() => {
    if (holdings) {
      setChartStatus(0);
      let addresses = holdings.map(holding => holding.sortkey);
      fetchMultipleCharts(addresses, timeframe).then(charts => {
        const formatted = formatChart(charts.map(chart => chart.data.fund));
        setChartsData(formatted);
        if(formatted.length > 0) setChartStatus(1);
        else setChartStatus(-1);
      });
    }
  }, [holdings, timeframe]);

  if (!wallet.connected) {
    return (
      <div className="w-full flex items-center justify-center h-[350px] relative">
        {/* Assuming Skeleton is a placeholder component for loading state */}
        <p className="absolute text-lg font-bold text-muted-foreground">Connect your wallet to view your portfolio</p>
      </div>
    );
  }
  if (chartStatus === 0) {
    return <Skeleton className='w-full h-[350px]'/>
  }
  if(chartStatus === -1) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 h-[350px]">
          <p className="text-lg font-bold text-muted-foreground">You don't hold any baskets</p>
          <div className='flex items-center gap-2'>
            <Link href={"/portfolios"}><Button variant={"outline"}>Explore Portfolios</Button></Link>
            <Link href={"/bundles"}><Button variant={"outline"}>Explore Bundles</Button></Link>
            <Link href={"/create"}><Button variant={"default"}>Create Basket</Button></Link>

          </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className='w-full flex flex-col items-center gap-2 md:gap-0 md:flex-row md:justify-between'>
        <div className='flex items-center flex-col md:flex-row gap-2'>
          <div className='grid grid-cols-4 md:flex md:items-center gap-2'>
            {
              holdings.map((holding, i) => {
                return <Badge key={i} variant={'outline'} className='flex items-center gap-1'>
                  <div className='w-2 h-2 rounded-full' style={{ backgroundColor: colors[i % colors.length] }}/>
                  <p className='text-xs'>{holding.symbol}</p>
                </Badge>
              })
            }
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Badge onClick={() => setTimeframe('1d')} variant={timeframe === '1d' ? "secondary" : "outline"} className="w-fit cursor-pointer">24h</Badge>
          <Badge onClick={() => setTimeframe('7d')} variant={timeframe === '7d' ? "secondary" : "outline"} className="w-fit cursor-pointer">7d</Badge>
          <Badge onClick={() => setTimeframe('30d')} variant={timeframe === '30d' ? "secondary" : "outline"} className="w-fit cursor-pointer">1m</Badge>
          <Badge onClick={() => setTimeframe('90d')} variant={timeframe === '90d' ? "secondary" : "outline"} className="w-fit cursor-pointer">3m</Badge>
          <Badge onClick={() => setTimeframe('180d')} variant={timeframe === '180d' ? "secondary" : "outline"} className="w-fit cursor-pointer">6m</Badge>
          <Badge onClick={() => setTimeframe('365d')} variant={timeframe === '365d' ? "secondary" : "outline"} className="w-fit cursor-pointer">All</Badge>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          width="100%"
          height={"100%"}
          data={chartsData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
          <Tooltip cursor={{ stroke: 'hsl(var(--secondary))', strokeWidth: 2, type:"dashed" }} content={<CustomToolTip baskets={holdings} title={"Performance"} />} offset={0} position={{y:100}} isAnimationActive={false}/>
          <XAxis
            dataKey="time"
            interval={7}
            axisLine={false}
            tickLine={false}
            tickFormatter={(date) => format(new Date(date), "MMM dd, yyyy")}
            hide
          />
          <YAxis
            orientation="right"
            mirror={true}
            type="number"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            dy={-10}
            opacity={0.5}
            tickCount={5}
            tickFormatter={(value) => `${formatNumber(value, 2)}%`}
          />
          {chartsData[0] && Object.keys(chartsData[0])
            .filter(key => key.startsWith('price'))
            .map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fillOpacity={0.1}
                fill={colors[index % colors.length]}
              />
            ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PortfolioChart;

function CustomToolTip({ active, payload, title, baskets }) {
  if(!active || !payload || payload.length == 0) return "";

  let performances = [];
  baskets.map((b, i) => {
    performances.push({
      symbol: b.symbol,
      performance: payload[0].payload['price'+i]
    })
  })

  return <div className="flex flex-col gap-2 border bg-background rounded-xl p-3">
    {
      performances.map((perf, i) => {
        return <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{perf.symbol}</p>
          <p className={`text-sm font-bold text-[${colors[i]}]`}>{formatNumber(perf.performance,2)}%</p>
        </div>
      })
    }
    <div className="flex items-center gap-1 text-muted-foreground">
      <CalendarIcon/>
      <p className="text-xs">{format(new Date(payload[0].payload.time * 1000), "MMM d yyyy, HH:mm")}</p>
    </div>
  </div>
}