import Image from "next/image"
import { LevelDropdown } from "./level-dropdown"
import { Logo } from "./logo"
import {MobileNavigation} from "./mobile-navigation"
import { HeaderNavigation } from "./navigation"
import { Title } from "./title"
import { WalletComponent } from "./wallet-component"


export const Header = ({title, path="/", thumbnail=null}) => {

  return <div className="w-full p-4 flex items-center justify-between lg:grid lg:grid-cols-3 lg:justify-center">
    <Title title={title}/>

    <Logo/>
    <div className="hidden lg:flex items-center justify-center">
      <HeaderNavigation path={path}/>
    </div>
    <div className="hidden md:flex items-center justify-end gap-2">
      <LevelDropdown/>
      <WalletComponent/>
    </div>
    <div className="flex md:hidden items-center justify-end gap-2">
      <WalletComponent/>
      <MobileNavigation/>
    </div>
  </div>
}