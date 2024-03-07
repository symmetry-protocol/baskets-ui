import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "./ui/skeleton"
import Checkmark from "/public/static/icons/checkmark.svg";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import Image from "next/image";
import { LevelBadge } from "./level-badge";

export const TopPortfolios = () => {

  const state = useSelector((state) => state.storage);

  return <div className="w-full flex flex-col gap-4 mt-4">
    <h2 className="text-xl font-bold">Top Portfolios</h2>
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="">
              <Card className="overflow-hidden cursor-pointer h-[266px] hover:bg-background-over transition-all">
                <CardContent className="flex flex-col items-center p-6 gap-4 flex-shrink-0">
                  <div className="flex items-start justify-between w-full">
                    <div className="w-full flex items-center">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex flex-col ml-2 gap-1">
                        <div className="flex items-center gap-1">
                          <p className="text-sm">@prism.ag</p>
                          <Checkmark width={16} height={16} />
                        </div>
                        <LevelBadge level={18} />
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={"outline"}>30D</Badge>
                        <p className="text-xl font-bold text-green-500">+12.5%</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={"outline"}>TVL</Badge>
                        <p className="text-xl font-bold">1.5m</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full flex items-center gap-1">
                    { state.tokenList &&
                      state.tokenList.map((token, i) => {
                        if(i < 6)
                        return <Image alt="coin" key={i} src={token.logoURI} width={36} height={36} className="rounded-full" />
                      })
                    }
                    <p className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center">
                      +5
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full overflow-hidden">
                    <p className="text-lg font-bold">Prism Portfolio</p>
                    <p className="text-sm text-muted-foreground h-[60px] text-justify text-ellipsis">Diversify into Portfolios managed by the best in crypto, from memecoin portfolios to DeFi, NFT, Gaming & DePin Projects.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  </div>
}