import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { LevelsBanner } from "@/components/levels-banner";
import { PlatformStats } from "@/components/platform-stats";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RoundLogo from "/public/static/icons/roundLogo.svg";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  useWalletModal
} from '@solana/wallet-adapter-react-ui';
import { useWalletDisconnectButton } from '@solana/wallet-adapter-base-ui';
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import toast from "react-hot-toast";

// Referral page
const ReferralPage = () => {
  const wallet = useWallet();
  const [referrer, setReferrer] = useState(null);
  const router = useRouter();
  const params = router.query.params;
  const {visible, setVisible} = useWalletModal();

  const [messageSigned, setMessageSigned] = useState(null);

  useEffect(() => { // referrer id
    if(params) {
      setReferrer(params[0])
    }
  }, [params]);

  useEffect(() => {
    if(messageSigned) {

    }
  }, [messageSigned]);

  const signMessage = async () => {
    let message = `Symmetry. Referred: ${wallet.publicKey.toBase58()}. By: ${referrer}.`;
    const messageBytes = decodeUTF8(message);
    toast.loading(<div className="flex flex-col">
      <p className="text-lg font-bold">Waiting for Signature</p>
      <p className="text-sm text-muted-foreground">Please sign the message in your wallet</p>
    </div>, {id:1});

    try {
      let signed = await wallet.signMessage(messageBytes);
      toast.success(<div className="flex flex-col">
        <p className="text-lg font-bold">Verifying Signature</p>
        <p className="text-sm text-muted-foreground">This should be quick</p>
      </div>, {id:1});
      // fetch post
      let referResponse = await fetch('https://api.symmetry.fi/v1/refer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: "refer",
          referred: wallet.publicKey.toBase58(),
          referrer_id: referrer,
          message: message,
          signature: Array.from(signed)
        })
      }).then(res => res.json());
      console.log('referResponse', referResponse);
      if(referResponse.success) {
        toast.success(<div className="flex flex-col">
          <p className="text-lg font-bold">Success</p>
          <p className="text-sm text-muted-foreground">Welcome to Symmetry</p>
        </div>, {id:1});
        setMessageSigned(true);
        router.push('/');
      } else {
        toast.error(<div className="flex flex-col">
          <p className="text-lg font-bold">Oops</p>
          <p className="text-sm text-muted-foreground">
            {
              referResponse.message
            }
          </p>
        </div>, {id:1});
        router.push('/');
      }
    } catch (e) {
      toast.error(<div className="flex flex-col">
        <p className="text-lg font-bold">Couldn't Sign</p>
        <p className="text-sm text-muted-foreground">You closed the popup</p>
      </div>, {id:1})
      console.log('error signing', e)
    }
  }

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header 
      title={"Home | Symmetry"}
      path="/"
    />
    <div className="w-full flex flex-col px-4 gap-4 mt-4">
      <Hero/>
      <PlatformStats/>
      <LevelsBanner/>
      {/* <TopPortfolios/> */}
      <div className="w-full flex flex-col border bg-background-over rounded-lg p-4 gap-2">
        <RoundLogo width={32} height={32}/>
        <div className="flex flex-col gap-1">
          <p className="text-md font-bold">Discover Symmetry</p>
          <p className="text-sm">
            What you need to know about the protocol, the community and the future of asset management on Solana.
          </p>
        </div>
        
        <Link href={"/about"} className="mt-2"><Button variant={"default"}>Discover</Button></Link>
      </div>
    </div>
    {
      referrer &&
      <div className="absolute z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px] z-50">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">✨</h1>
            <h1 className="text-lg font-semibold leading-none tracking-tight">You're invited!</h1>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
            You've been referred to Symmetry. 
              You'll get <b className="shinyGold">1,000</b> points as a welcome gift.
              Using the protocol gets you more points. 
              <br/><br/>
              Collect as much as you can until May 31st in time for the snapshot.
            </p>
          </div>
          {
            !wallet.connected &&
            <Button onClick={() => setVisible(true)} className="w-full h-10 text-white bg-blue-500 hover:bg-blue-700">Great! Let's go!</Button>
          }

          {
            wallet.connected && !messageSigned &&
            <>
              <p className="text-xs text-green-500">Almost there! Please sign a message with your wallet to confirm referral.</p>
              <Button onClick={() => signMessage()} className="w-full h-10">Sign into Symmetry</Button>
            </>
          }
        </div>
      </div>
      
    }
  </div>
}

export default ReferralPage;

{/* <Dialog className="z-0" open={true} onOpenChange={() => null}>
        <DialogContent className="sm:max-w-[425px] z-50">
          <DialogHeader>
            <DialogTitle className="text-2xl">✨</DialogTitle>
            <DialogTitle>You're invited!</DialogTitle>
            <DialogDescription>
              You've been referred to Symmetry. 
              You'll get <b className="shinyGold">1,000</b> points as a welcome gift.
              Using the protocol gets you more points. 
              <br/><br/>
              Collect as much as you can until May 31st in time for the snapshot.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
        <Button onClick={() => setVisible(true)}>Great! Let's go</Button>
      </DialogFooter>
    </DialogContent>
    
  </Dialog> */}