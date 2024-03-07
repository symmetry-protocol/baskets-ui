import { useWallet } from "@solana/wallet-adapter-react"
import { Level } from "./level"
import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"
import { Progress } from "./ui/progress"
import GenerativeAvatar from "./generative-avatar"
import { Username } from "./username"
import { Separator } from "./ui/separator"
import { Label } from "./ui/label"
import { ClipboardIcon } from "@radix-ui/react-icons"
import { LEVELS, POINTS_TO_LEVEL, formatNumber } from "@/utils/utils"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { API_ROOT, GET_REFERRAL_ID } from "@/utils/symmetry"
import Link from "next/link"


export const LevelsPopup = ({open=true, onClose, level=1, points=0, user=null}) => {
  const wallet = useWallet();

  const [rank, setRank] = useState(1);
  const [referralId, setReferralId] = useState(null);

  useEffect(() => {
    if(wallet.connected) {
      GET_REFERRAL_ID(wallet.publicKey.toBase58()).then(ref => setReferralId(ref));
    }
  }, [wallet.connected]);
  
  return <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="flex flex-col md:flex-row items-center h-auto md:h-72">
      <div className="h-full w-full md:w-1/2 flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GenerativeAvatar seed={wallet.publicKey?.toBase58()} size={32}/>
            <div className="flex flex-col gap-1">
              <Username address={wallet.publicKey?.toBase58()}/>
            </div>
          </div>
          <div onClick={() => {
            navigator.clipboard.writeText("https://app.symmetry.fi/r/"+referralId);
            toast.success(<p className="text-sm">Referral link copied to clipboard</p>);
          }} className="flex items-center gap-2 border rounded-lg w-fit p-2 text-muted-foreground cursor-pointer hover:text-primary">
            <p className="text-xs">My Referral</p>
            <ClipboardIcon/>
          </div>
        </div>
        <div className="w-full flex flex-col gap-1">
          <p className="text-muted-foreground text-sm">Your Points</p>
          <div className="flex items-center gap-1">
            <p className="text-3xl shinyGold">
              {
                formatNumber(user.total_points,0)
              }
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <p className="text-sm">Referral Boost</p>
          <p className="text-xs text-muted-foreground">You earn 10% of points earned by each user referred</p>
        </div>
        <Link target="_blank" href={"https://docs.symmetry.fi/introduction/symmetry-points"}>
          <Button variant={"secondary"}>Learn More</Button>
        </Link>
      </div>
      
      <Separator orientation="vertical" className="h-full"/>
      <div className="flex flex-col items-center gap-4">
        <Level level={level} size={64} className="rounded-full shadow-lg shadow-white"/>
        <div className="w-full flex flex-col items-center">
          {/* <p className="text-sm font-bold text-muted-foreground">Your Level</p> */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-bold">Level {level}</p>
            <p className="text-sm text-muted-foreground">{formatNumber(points,0)} / {formatNumber(LEVELS[level+1],0)} pts</p>
          </div>
          <Progress value={Math.floor(points / LEVELS[level+1] * 100)} className="w-48 mt-4" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
}