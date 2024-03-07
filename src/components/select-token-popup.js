import Image from "next/image"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Badge } from "./ui/badge"
import { TokenIcon } from "./token-icon"


export const SelectTokenPopup = ({open, onClose, onSelect, tokenList}) => {
  return <CommandDialog open={open} onOpenChange={() => onClose()}>
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search Token..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Tokens">
          {tokenList && 
            tokenList.map((token, i) => {
              return <CommandItem key={i} className="flex items-center justify-between gap-2" onSelect={() => onSelect(token)}>
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={token.tokenMint || token.address} size={24}/>
                  <span>{token.symbol}</span>
                </div>
                <Badge variant={"outline"} className="text-xs">
                  {
                    token.tokenMint ?
                    token.tokenMint.slice(0,3) + "..." + token.tokenMint.slice(-3)
                    :
                    token.address.slice(0,3) + "..." + token.address.slice(-3)
                  }
                </Badge>
              </CommandItem>
            })
          }
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>

}