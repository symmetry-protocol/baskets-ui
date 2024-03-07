import { formatNumber } from "@/utils/utils"
import GenerativeAvatar from "./generative-avatar"
import { LevelBadge } from "./level-badge"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Username } from "./username"
import Link from "next/link"

const creator = {
  address: "J9zjCmmGBfv6wDSwmRW43vVJ6vooCftXjQYtc7uhETdr",
  aum: 1000,
  numVaults: 13,
  points: 8,
  description: "Retired trad-fi analyst turned DeFi contributor, now managing portfolios.",
  aum: 1530,
  vaults: 30
}

export const CreatorCard = ({}) => {
  return <div className="w-full bg-background-over border rounded-xl p-4 flex flex-col gap-3">
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center w-full gap-2">
        <GenerativeAvatar size={48} seed={creator.address}/>
        <div className="flex flex-col gap-1">
          <Username address="J9zjCmmGBfv6wDSwmRW43vVJ6vooCftXjQYtc7uhETdr"/>
          <LevelBadge level={creator.points}/>
        </div>
      </div>
      <Link href={`/user/${creator.address}`}>
        <Button variant={'secondary'} className="text-xs">
          More
        </Button>
      </Link>
    </div>
    <p className="text-sm">
      {creator.description}
    </p>
    <div className="w-full flex items-center justify-between">
      <div>
        <Label htmlFor="aum" className="text-xs text-muted-foreground">Assets Managed</Label>
        <p id="aum" className="text-sm">${formatNumber(creator.aum,2)}</p>
      </div>
      <div>
        <Label htmlFor="numVaults" className="text-xs text-muted-foreground text-right">Portfolios Managed</Label>
        <p id="numVaults" className="text-sm text-right">
          {creator.vaults}
        </p>
      </div>
    </div>
  </div>
}