import { Header } from "@/components/header";
import Link from "next/link";
import TwitterIcon from "/public/static/icons/twitter.svg";
import DiscordIcon from "/public/static/icons/discord.svg";
import TelegramIcon from "/public/static/icons/telegram.svg";
import Pyth from "/public/static/partners/pyth.svg";
import Switchboard from "/public/static/partners/switchboard.svg";
import Jup from "/public/static/partners/jup.svg";
import Prism from "/public/static/partners/prism.svg";
import PrismLogo from "/public/static/partners/prismLogo.svg";
import Defiland from "/public/static/partners/defiland.svg";
import NedFinance from "/public/static/partners/nedfinance.svg";
import Osec from "/public/static/partners/osec.svg";
import Renaissance from "/public/static/images/renaissance.svg";
import Shadow from "/public/static/partners/shdw.svg";
import Solblaze from "/public/static/partners/blaze.png";
import Hawksight from "/public/static/partners/hawksight.png";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { TokenIcon } from "@/components/token-icon";
import GenerativeAvatar from "@/components/generative-avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { LevelsBanner } from "@/components/levels-banner";
import { useSymmetry } from "@/utils/SymmetryContext";
import { useSelector } from "react-redux";

const AboutPage = () => {
  const state = useSelector((state) => state.storage);
  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header
      title={"About | Symmetry"}
      path="/more"
    />
    
    <div className="w-full flex flex-col px-4 gap-4 mt-4">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="w-full grid-cols-subgrid col-span-1 lg:col-span-2 border bg-background-over rounded-xl px-8 py-6">
          <p className="text-2xl">✨</p>
          <h1 className="text-lg font-bold">What is Symmetry</h1>
          <p className="text-sm text-muted-foreground">
            Symmetry is an on-chain asset management protocol that enables users to create, manage, and trade tokenized baskets of multiple cryptocurrencies.
            Protocol supports the creation and automation of mutable and immutable baskets and supports up to 15 assets per basket composition with various weights.
            Example: <Link className="underline text-blue-500" href="/view/9tZMvuRGbpEzv6RdR7GdtYzNpN8SE2Fub1WymoXsdpg" target="_blank">Solana DeFi Index</Link>,
            which is a basket containing top Solana DeFi tokens by market cap. Rebalancing, restructuring, and management of baskets are automated and executed on-chain.
            <br/><br/>
            Symmetry Baskets are customizable and can be used for various purposes such as creating portfolios, indexes, ETFs, or copy-trading.
            The protocol is audited by <Link className="underline text-blue-500" href="https://ottersec.notion.site/Sampled-Public-Audit-Reports-a296e98838aa4fdb8f3b192663400772?p=a4cf43a5136e419f89a2e4e20c723807&pm=s" target="_blank">Ottersec</Link> and the UI is open-sourced for developers to build their own asset management platforms and integrate with the Symmetry protocol.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Link href="https://twitter.com/symmetry_fi" target="_blank">
              <TwitterIcon width={24} height={24}/>
            </Link>
            <Link href="https://discord.gg/ahdqBRgE7G" target="_blank">
              <DiscordIcon width={24} height={20}/>
            </Link>
            <Link href="https://t.me/symmetry_fi" target="_blank">
              <TelegramIcon width={24} height={20}/>
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center grid-cols-subgrid col-span-1 border bg-gradient-to-b from-slate-900 to-black rounded-xl p-8 gap-2">
          <p className="text-5xl">💵</p>
          <p className="text-7xl font-bold">$700M+</p>
          <p className="text-sm text-muted-foreground">Cumulative Volume</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center grid-cols-subgrid col-span-1 border bg-background-over rounded-xl p-8 gap-2">
          <p className="text-5xl">🪙</p>
          <p className="text-5xl font-bold">$6m+</p>
          <p className="text-sm text-muted-foreground text-center">Total Value Locked</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center grid-cols-subgrid col-span-1 border bg-background-over rounded-xl p-8 gap-2">
          <Link target="_blank" href={"/view/Dqyz9BvkjScd49twVe4bB1ihM1EuweB1K6AmNgMEGZJA"} className="flex items-center gap-2">
            <GenerativeAvatar size="48" seed="LOL"/>
            <div className="flex flex-col">
              <p class="text-md">Memeverse</p>
              <Badge className="w-fit" variant={"outline"}>LOL</Badge>
            </div>
          </Link>
          <p className="text-5xl font-bold text-green-500">+16,895.41%</p>
          <p className="text-sm text-muted-foreground text-center flex items-center">Highest Basket ROI: $10K <span><ArrowRightIcon/></span> $1.6m</p>
        </div>
        <Link target="_blank" href={"https://www.colosseum.org/renaissance"} className="w-full flex flex-col text-black items-center justify-center grid-cols-subgrid col-span-1 border bg-yellow-500 text-black rounded-xl p-8 gap-2">
          <Renaissance />
          <p className="text-sm text-black text-center">Hackathon Grand Prize Sponsor</p>
        </Link>
      </div>
      <LevelsBanner/>
      <p className="text-xl font-bold mt-8">
        Ecosystem Partners & Integrations
      </p>
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="w-full h-[80px] flex flex-col justify-center items-center border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Pyth height={36}/>
        </div>
        <div className="w-full h-[80px] flex flex-col justify-center items-center border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Switchboard height={32}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-1 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Jup height={24}/>
          <p className="text-md font-bold">Jupiter</p>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <PrismLogo height={24}/>
          <Prism height={16}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Defiland height={24}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <NedFinance height={24}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Image src={Solblaze} alt="Solblaze" height={24}/>
          <p className="text-md font-bold">Solblaze</p>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Image src={Hawksight} alt="Solblaze" height={24}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Osec height={24}/>
        </div>
        <div className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <Shadow height={24}/>
        </div>
        <Link href={"https://discord.gg/ahdqBRgE7G"} target="_blank" className="w-full h-[80px] flex justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <p className="shinySilver">Become a Partner</p>
          <ArrowRightIcon/>
        </Link>
      </div>

      <p className="text-xl font-bold mt-8">
        Developers
      </p>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link href={"https://docs.symmetry.fi"} target="_blank" className="w-full flex flex-col justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <div className="flex items-center gap-2">
            <p className="shinySilver font-bold">Symmetry SDK</p>
            <ArrowRightIcon/>
          </div>
          <p className="text-sm text-muted-foreground">
            Build your defi platform on top of Symmetry on-chain infrastructure.
          </p>
        </Link>
        <Link href={"https://docs.symmetry.fi"} target="_blank" className="w-full flex flex-col justify-center items-center gap-2 border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
          <div className="flex items-center gap-2">
            <p className="shinySilver font-bold">Symmetry API</p>
            <ArrowRightIcon/>
          </div>
          <p className="text-sm text-muted-foreground">
            Integrate with Symmetry seamlessly through an easy-to-use web API.
          </p>
        </Link>
      </div>

      <p className="text-xl font-bold mt-8">
        Supported Cryptocurrencies
      </p>
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        {state.supportedTokens && 
          state.supportedTokens.map((token, i) => {
            return <div key={i} className="w-full h-[80px] flex gap-2 justify-center items-center border rounded-lg bg-background-over p-4 grayscale hover:grayscale-0 cursor-pointer">
              <TokenIcon symbol={token.tokenMint} size={24}/>
              <p className="text-sm font-bold font-muted-foreground">{token.symbol}</p>
            </div>
          })
        }
        <Link href={"https://discord.gg/ahdqBRgE7G"} target="_blank" className="w-full h-[80px] flex gap-2 justify-center items-center border rounded-lg bg-background-over p-4 cursor-pointer">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <p className="text-sm font-bold">
              +
            </p>
          </div>
          <p className="text-sm font-bold font-muted-foreground">Request Token</p>
        </Link>
      </div>
    </div>
  </div>
}

export default AboutPage;