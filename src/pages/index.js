import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { LevelsBanner } from "@/components/levels-banner";
import { PlatformStats } from "@/components/platform-stats";
import { TopPortfolios } from "@/components/top-portfolios";
import RoundLogo from "/public/static/icons/roundLogo.svg";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const RootPage=() => {
  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header 
      title={"Home | Symmetry"}
      path="/"
    />
    <div className="w-full flex flex-col px-4 gap-4 mt-4">
      
      <Hero/>
      <PlatformStats/>
      <LevelsBanner/>
      {/* <TopPortfolios/> */}
      <div className="w-full flex flex-col border bg-background-over rounded-lg p-4 gap-2">
        <RoundLogo width={32} height={32}/>
        <div className="flex flex-col gap-1">
          <p className="text-md font-bold">Discover Symmetry</p>
          <p className="text-sm">
            What you need to know about the protocol, the community and the future of asset management on Solana.
          </p>
        </div>
        
        <Link href={"/about"} className="mt-2"><Button variant={"default"}>Discover</Button></Link>
      </div>
    </div>
  </div>
}

export default RootPage;