"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Logo from '/public/static/icons/logo.svg';

const components: { title: string; href: string; target:string; description: string }[] = [
  {
    title: "What is Symmetry?",
    href: "https://google.com",
    target: "_blank",
    description:
      "Dive into the Symmetry Ecosystem and learn its ins and outs.",
  },
  {
    title: "Ecosystem",
    href: "/docs/primitives/progress",
    target: "_blank",
    description:
      "Explore Symmetry Ecosystem, partner projects & integrations.",
  },
  {
    title: "Roadmap",
    href: "/docs/primitives/hover-card",
    target: "_blank",
    description:
      "Find out what's next for Symmetry and its products",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    target: "_blank",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Governance",
    href: "/docs/primitives/tabs",
    target: "_blank",
    description:
      "Shape the future of Symmetry through on-chain governance.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    target: "_blank",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function HeaderNavigation({path}: {path: string}) {
  return (
    <NavigationMenu className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === "/" ? "bg-secondary" : ""}`}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === "/dashboard" ? "bg-secondary" : ""}`}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/explore" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === "/explore" ? "bg-secondary" : ""}`}>
              Explore
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/create" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === "/create" ? "bg-secondary" : ""}`}>
              Create
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/leaderboard" legacyBehavior passHref>
            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === "/leaderboard" ? "bg-secondary" : ""}`}>
              Leaderboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={`${path === "/more" ? "bg-secondary" : ""}`}>More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <Logo className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      About
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Explore the Symmetry Ecosystem.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://docs.symmetry.fi" target="_blank" title="Developers">
                Integrate Symmetry in your app easily through APIs & SDKs.
              </ListItem>
              <ListItem href="https://symmetry-fi.medium.com/" title="Blog">
                Guides & in-depth announcements about Symmetry.
              </ListItem>
              {/* <ListItem href="/docs/primitives/typography" title="">
                Developers
              </ListItem> */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
