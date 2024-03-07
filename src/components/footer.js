import Link from "next/link";

import TwitterIcon from "/public/static/icons/twitter.svg";
import DiscordIcon from "/public/static/icons/discord.svg";
import TelegramIcon from "/public/static/icons/telegram.svg";


export const Footer = () => {
  return <div className="w-full flex flex-col items-center p-4 pt-8 justify-between bg-background-over border-t h-64 mt-32">
    <div className="w-full flex items-center flex-col justify-between gap-2">
      <div className="flex items-center gap-4">
        <Link href={"https://twitter.com/symmetry_fi"} target="_blank">
          <TwitterIcon width={32} height={32}/>
        </Link>
        <Link href={"https://discord.gg/ahdqBRgE7G"} target="_blank">
          <DiscordIcon width={32} height={32}/>
        </Link>
        <Link href={"https://t.me/symmetry_fi"} target="_blank">
          <TelegramIcon width={32} height={32}/>
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-md font-bold">Stay in the loop</p>
        <p className="text-sm text-muted-foreground text-center">Join us on Twitter, Discord & Telegram to stay updated on Symmetry</p>
      </div>
    </div>
    <div className="flex items-center justify-center flex-col">
      <Link href={"https://docs.symmetry.fi"} className="text-blue-500 text-xs" target="_blank">Documentation</Link>

      <p className="text-muted-foreground text-xs text-center">
        © 2024 Symmetry Protocol. Source code available on
        <Link href={"https://github.com/symmetry-protocol"} className="text-blue-500" target="_blank"> Github</Link>
      </p>
    </div>
  </div>
}