import Link from "next/link"
import GenerativeAvatar from "./generative-avatar"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { DiscordLogoIcon, PersonIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Username } from "./username"
import { LevelBadge } from "./level-badge"
import { GET_USER_POINTS } from "@/utils/symmetry"
import { POINTS_TO_LEVEL } from "@/utils/utils"


export const VaultManager = ({vault}) => {
  const wallet = useWallet();
  const [managerDomain, setManagerDomain] = useState(null);
  const [creatorLevel, setCreatorLevels] = useState(null);

  useEffect(() => {
    if(vault)
      GET_USER_POINTS(vault.parsed.manager).then(result => {
        setCreatorLevels(POINTS_TO_LEVEL(result));
      })
  }, [vault]);

  return <div className="w-full flex flex-col gap-2 p-4 border rounded-xl">
    <div className="flex w-full items-center h-9">
      <p className="text-sm font-bold">
        About Creator
      </p> 
    </div>
    {/* <p className="text-sm text-muted-foreground h-[60px]">
      This is a description of the creator. It will contain information about the creator, the assets it contains, the strategy it follows, and the performance it has had.
    </p>
    <Separator className="my-2" /> */}
    <div className="flex items-center gap-2">
      {
        vault ?
        <GenerativeAvatar seed={vault.parsed.manager} size={48}/>
        :
        <Skeleton className="w-12 h-12 rounded-full"/>
      }
      <div className="flex items-end justify-between w-full h-12">
        <div className="flex flex-col gap-1">
          <Username address={vault ? vault.parsed.manager : null}/>
          {
            creatorLevel ?
            <LevelBadge level={creatorLevel}/>
            :
            <Skeleton className="w-16 h-3"/>
          }
        </div>
        
        {/* Socials */}
        {
        vault ?
        <div className="flex items-center gap-2">
          {/* <Link href={`/creator/${vault.parsed.manager}`}>
            <Button variant={"secondary"} className="bg-[#1DA1F2] hover:bg-[#2f8ac3]" size={"icon"}>
              <TwitterLogoIcon/>
            </Button>
          </Link>
          <Link href={`/creator/${vault.parsed.manager}`}>
            <Button variant={"secondary"} className="bg-[#5865f2] hover:bg-[#4650c6]" size={"icon"}>
              <DiscordLogoIcon/>
            </Button>
          </Link> */}
          {
            // wallet.connected && vault.parsed.manager === wallet.publicKey.toBase58() ?
            // <Link href={`/profile`}>
            //   <Button variant={"secondary"} className="text-sm gap-2 font-bold">
            //     <PersonIcon/>
            //     Edit
            //   </Button>
            // </Link>
            // :
            <Link href={`/creator/${vault.parsed.manager}`}>
              <Button variant={"secondary"} className="text-sm gap-2 font-bold">
                <PersonIcon/>
                  Profile
              </Button>
            </Link>
          }
          
        </div>
        :
        <Skeleton className="w-16 h-3"/>
        }
      </div>
    </div>
  </div>
}