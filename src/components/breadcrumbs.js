import { ChevronRightIcon, Link2Icon } from "@radix-ui/react-icons";
import TwitterIcon from "/public/static/icons/twitter.svg";
import Link from "next/link"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import toast from "react-hot-toast"


export const Breadcrumbs = ({root={path:'/', label:'Home'},vaultAddress=null, items=null, badge=null}) => {

  const handleShareOnTwitter = () => {
    const tweetText = `Check out this ${items[items.length-1]} ${badge} on Symmetry\nhttps://app.symmetry.fi/view/${vaultAddress}`;

    // encodeURIComponent ensures the tweet text is properly encoded to be used in a URL
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    // Open a new window/tab with the Twitter intent URL
    window.open(tweetUrl, '_blank');
  };

  return <div className="flex items-center gap-2">
  <Link href={root.path}><p className="text-sm text-muted-foreground">{root.label}</p></Link>
  <ChevronRightIcon/>
  {
    items ?
    items.map((item, index) => {
    return <div key={index} className="flex items-center gap-2">
      <p className="text-sm">{item}</p>
      {
        badge &&
        <Badge variant={"secondary"} className="rounded">
          {badge}
        </Badge>
      }
      {
        index < items.length - 1 &&
        <ChevronRightIcon/>
      }
    </div>
    })
    :
    <Skeleton className="w-24 h-6"/>
  }
  {
    vaultAddress &&
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger><Link2Icon onClick={() => {
            navigator.clipboard.writeText("https://app.symmetry.fi/view/"+vaultAddress)
            toast.success(<p className="text-sm">Link Copied</p>);
          }}/></TooltipTrigger>
          <TooltipContent>
            <p>Copy Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger><TwitterIcon width={20} height={20} onClick={() => handleShareOnTwitter()}/></TooltipTrigger>
          <TooltipContent>
            <p>Share on X</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  }
</div>
}