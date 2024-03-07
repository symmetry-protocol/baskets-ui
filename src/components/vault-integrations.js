import Image from "next/image"
import { Button } from "./ui/button"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import NedIcon from "/public/static/images/ned.svg"

export const VaultIntegrations = ({vault}) => {

  const [dropdown, setDropdown] = useState(false);

  if(!vault) return <></>

  return <div className="w-full flex flex-col border p-4 gap-3 rounded-xl select-none">
    <div onClick={() => setDropdown(!dropdown)} className="w-full flex items-center justify-between cursor-pointer">
      <p className="text-sm font-bold">
        Ecosystem Integrations
      </p>
      {
        dropdown ?
        <ChevronUpIcon/>
        :
        <ChevronDownIcon/>
      }
    </div>
    {
      dropdown &&
      <div className="w-full grid items-start grid-cols-2 gap-2">
        <Button variant={"outline"} className="w-full flex items-center gap-2">
          <Image src={"https://mango.markets/logos/logo-mark.svg"} width={24} height={24} alt="Mango" className="rounded-full"/>
          Trade on Mango
        </Button>
        <Button variant={"outline"} className="w-full flex items-center gap-2">
          <Image src={"https://solend.fi/assets/tokens/slnd.png"} width={24} height={24} alt="Solend" className="rounded-full"/>
          Lend on Solend
        </Button>
        <Button variant={"outline"} className="w-full flex items-center gap-2">
          <Image src={"https://www.marginfi.com/_next/image?url=%2Fmarginfi_logo.png&w=3840&q=75"} width={24} height={24} alt="Marginfi" className="rounded-full"/>
          Lend on Marginfi
        </Button>
        <Button variant={"outline"} className="w-full flex items-center gap-2">
          <NedIcon width={24} height={24}/>
          Trade on Ned
        </Button>
      </div>
    }
  </div>
}