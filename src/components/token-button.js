import Image from "next/image"
import { Button } from "./ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { TokenIcon } from "./token-icon"
import GenerativeAvatar from "./generative-avatar"


export const TokenButton = ({token, onClick, className="", disabled=false}) => {
  return <Button variant={"secondary"} onClick={onClick} className={`${className} flex items-center gap-1 bg-secondary rounded-lg`}>
    {
      token.logoURI ?
      <Image src={token.logoURI} width={24} height={24} className="rounded-full"/>
      :
        token.basket ?
        <GenerativeAvatar seed={token.symbol} size={24}/>
        :
        <TokenIcon symbol={token.symbol} size={24}/>
    }
    <p className="font-bold">{token.symbol}</p>
    {
      !disabled && <ChevronDownIcon/>
    }
  </Button>
}