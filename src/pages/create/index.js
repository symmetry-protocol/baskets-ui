import { Header } from "@/components/header";
import Link from "next/link";
import { useState } from "react"



const CreateRoot = ({}) => {
  const [createType, setCreateType] = useState(null);

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-1 md:px-4 gap-4 mt-4">
    <Header title={"Create Basket | Symmetry"} path={'/create'} />
    <div className="w-full flex flex-col px-4 gap-8 mt-4">
      <div className="w-full flex flex-col items-center gap-2"> 
        <h2 className="text-xl font-bold">Create a Basket</h2>
        <p className="text-muted-foreground text-center">Get started by selecting a type of basket you'd like to create.</p>
      </div>  

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={"create/portfolio"} className="createOption w-full h-full p-4 grid grid-rows-5 items-center gap-2 border rounded-xl hover:bg-secondary hover:border-gray-500">
          <div className="w-full h-full flex items-center justify-center row-span-3">
            <p className="text-8xl createOptionIcon">⚔️</p>
          </div>
          <div className="w-full h-full row-span-2 flex flex-col items-center justify-end gap-2">
            <p className="text-4xl font-bold">Portfolio</p>
            <p className="text-center text-muted-foreground">Create a public portfolio and let others deposit into it. You can change composition and settings at any time. Earn fees on deposits.</p>
          </div>
        </Link>

        <Link href={"create/bundle"} className="createOption w-full h-full p-4 grid grid-rows-5 items-center gap-2 border rounded-xl bg-background-over hover:bg-secondary hover:border-gray-500">
          <div className="w-full h-full flex items-center justify-center row-span-3">
            <p className="text-8xl createOptionIcon">🧺</p>
          </div>
          <div className="w-full h-full row-span-2 flex flex-col items-center gap-2">
            <p className="text-4xl font-bold">Bundle</p>
            <p className="text-center text-muted-foreground">Bundle settings can't be changed after creation. Create a bundle that follows a theme or a sector. Earn fees on Deposits</p>
          </div>
        </Link>

        <Link href={"create/private"} className="createOption w-full h-full p-4 grid grid-rows-5 items-center gap-2 border rounded-xl hover:bg-secondary hover:border-gray-500">
          <div className="w-full h-full flex items-center justify-center row-span-3">
            <p className="text-8xl createOptionIcon">🔒</p>
          </div>
          <div className="w-full h-full row-span-2 flex flex-col items-center gap-2">
            <p className="text-4xl font-bold">Private Portfolio</p>
            <p className="text-center text-muted-foreground">Good for a controlled portfolios & treasury management. Only you can deposit, but anyone holding it can redeem.</p>
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-center gap-1">
        <p className="text-muted-foreground">Don't know what to create?</p>
        <Link target="_blank" href={"https://docs.symmetry.fi"} className="underline text-blue-500">Check out this guide.</Link>
      </div>
    </div>
  </div>
}

export default CreateRoot;