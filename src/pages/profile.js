import GenerativeAvatar from "@/components/generative-avatar";
import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Username } from "@/components/username";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react";


const ProfilePage = ({}) => {
  const wallet = useWallet();
  
  if(!wallet.connected) {
    return <div className="w-full bg-background flex flex-col items-center gap-4">
      <Title title={"Settings"}/>
      <Header/>
      <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen border rounded-xl flex flex-col items-center justify-center gap-4 mt-4 p-10">
        <p className="text-sm text-muted-foreground">
          Please connect the wallet
        </p>
      </div>
    </div>
  }

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-4 gap-4 mt-4">
      <Header title={"Profile | Symmetry"}/>
      <div className="items-center border rounded-xl flex w-fit flex-col gap-4 mt-4 mx-4 md:mx-0 p-6 md:p-10 pb-16">
        <div className="flex flex-col gap-1">
          <h3 class="text-lg tracking-tight">Profile</h3>
          <p class="text-sm text-muted-foreground">
            Set information about your account and manager profile.
          </p>
        </div>
        <Separator className="w-full"/>
        
        <div className="w-full flex flex-col gap-6 mt-4">
          <div className="flex items-center gap-4">
            <GenerativeAvatar seed={wallet.publicKey.toBase58()} size={48}/>
            <div className="flex flex-col gap-1">
              <Username address={wallet.publicKey.toBase58()}/>
              <LevelBadge level={13}/>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="description">Referral Link</Label>
            <div disabled className="w-full flex items-center justify-between p-2 px-3 border rounded-lg">
              <p className="text-sm">https://app.symmetry.fi/r/kwexhJhw</p>
              <ClipboardIcon/>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="description">Profile Description</Label>
            <Textarea className="w-full" placeholder="Description about you." />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="description">Twitter Handle</Label>
            <Input placeholder="@symmetry_fi" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="description">Discord Server</Label>
            <Input placeholder="discord.gg/" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Label htmlFor="description">Website URL</Label>
            <Input placeholder="example.com" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 w-full justify-end">
          <Button variant={"default"}>Save Changes</Button>
          <Button variant={"outline"}>Cancel</Button>
        </div>
      </div>
    </div>
}

export default ProfilePage;