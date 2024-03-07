import Link from "next/link";
import LogoIcon from "/public/static/icons/logo.svg";


export const Logo = () => {
  return <Link href="/" className="flex items-center gap-2 w-fit">
    <LogoIcon width={32} height={32}/>
    <span>Symmetry</span>
  </Link>
}