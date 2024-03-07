import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import Link from "next/link"

export const MobileNavigation = () => {
  return <Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size={"icon"}>
      <HamburgerMenuIcon width={24} height={24}/>
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    <div className="flex flex-col gap-4 mt-4">
      <Link href="/" className="flex flex-col">
        <h1 className="text-xl">Home</h1>
        <p className="text-muted-foreground text-sm">Home page</p>
      </Link>
      <Link href="/dashboard" className="flex flex-col">
        <h1 className="text-xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Track your holdings</p>
      </Link>
      <Link href="/explore" className="flex flex-col">
        <h1 className="text-xl">Explore</h1>
        <p className="text-muted-foreground text-sm">Discover Portfolios & Bundles</p>
      </Link>
      <Link href="/create" className="flex flex-col">
        <h1 className="text-xl">Create</h1>
        <p className="text-muted-foreground text-sm">Create a portfolio / bundle</p>
      </Link>
      <Link href="/leaderboard" className="flex flex-col">
        <h1 className="text-xl">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">Secure your spot in the leaderboards</p>
      </Link>
      <Link href="/about" className="flex flex-col">
        <h1 className="text-xl">About</h1>
        <p className="text-muted-foreground text-sm">Learn about Symmetry</p>
      </Link>
      <Link href="https://twitter.com/symmetry_fi" target="_blank" className="flex flex-col">
        <h1 className="text-xl">Twitter</h1>
        <p className="text-muted-foreground text-sm">Follow Symmetry on Twitter</p>
      </Link>
    </div>
  </SheetContent>
</Sheet>
}