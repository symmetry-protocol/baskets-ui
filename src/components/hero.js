import { ArrowRightIcon, GlobeIcon, PlusIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import Link from "next/link"
import GenerativeAvatar from "./generative-avatar"
import SymmetryGradient from "/public/static/images/symmetryGradient.png";

export const Hero = () => {
  return <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4 mt-4">
    <Link href="/explore" className="createOption w-full h-[300px] bg-[#193EFF] hover:bg-[#1333DC] rounded-lg px-4 py-5 flex flex-col justify-between overflow-hidden relative swooshLeft">
      <Image src={SymmetryGradient} className="absolute z-[1] -right-16 top-16 opacity-50"/>
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl font-bold">For DeFi users</h1>
        <p className="text-md text-white">
          More than 350 baskets to explore created by the community with diverse tokens & volatility categories. From high sharpe-ratio bundles to yield bearing tokens to meme degen portfolios.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <GenerativeAvatar seed={"ySOL"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"LOL"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"SOLP"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"BTCP"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"LMAO"} size={32}/>
        </div>
        <div className="flex items-center gap-1 relative">
          <p className="text-sm text-white">
            Explore Baskets
          </p>
          <ArrowRightIcon className="absolute w-8 h-8 right-0 translate-x-[48px] swooshLeftItem text-white animateRight"/>
        </div>
      </div>
      
    </Link>
    <Link href={"/create"} className="createOption w-full bg-[#4316CA] hover:bg-[#4316AA] h-[300px] rounded-lg px-4 py-5 flex flex-col justify-between overflow-hidden relative swooshLeft">
      <Image src={SymmetryGradient} className="absolute z-[1] right-4 top-16 opacity-50"/>

      <div className="w-full flex flex-col gap-2">
        <h1 className="text-xl font-bold">For Portfolio Managers</h1>
        <p className="text-md text-white">
          Deploy your own on-chain portfolio or a bundle in under 1 minute.
          Whether it's a simple 50/50 allocation or a complex 15 token portfolio with automated rebalancing, Symmetry has you covered.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <GenerativeAvatar seed={"ySOL"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"LOL"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"SOLP"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"BTCP"} size={32}/>
          <GenerativeAvatar className="-ml-2" seed={"LMAO"} size={32}/>
        </div>
        <div className="flex items-center gap-1 relative">
          <p className="text-sm text-white">
            Create Basket
          </p>
          <ArrowRightIcon className="absolute w-8 h-8 right-0 translate-x-[48px] swooshLeftItem text-white animateRight"/>
        </div>
      </div>
    </Link>
  </div>
}