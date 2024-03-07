import GenerativeAvatar from "@/components/generative-avatar";
import { Header } from "@/components/header";
import { LevelBadge } from "@/components/level-badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Username } from "@/components/username";
import { useSymmetry } from "@/utils/SymmetryContext";
import { GET_USER_POINTS } from "@/utils/symmetry";
import { POINTS_TO_LEVEL, formatNumber } from "@/utils/utils";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


// Creator Profile Page
const CreatorPage = () => {
  const router = useRouter();
  const params = router.query.params;
  const sdk = useSymmetry();
  const [creatorAddress, setCreatorAddress] = useState(null); 
  const [baskets, setBaskets] = useState(null);
  const [basketCompositions, setBasketCompositions] = useState(null);
  const [creatorLevel, setCreatorLevel] = useState(1);
  const [creatorPoints, setCreatorPoints] = useState(0);

  useEffect(() => {
    if (params) {
      setCreatorAddress(params[0]);
      GET_USER_POINTS(params[0]).then(points => {
        setCreatorLevel(POINTS_TO_LEVEL(points));
        setCreatorPoints(points);
      });
    }
  }
  , [params]);

  /* Load baskets by this creator */
  useEffect(() => {
    if (sdk && creatorAddress) {
      sdk.findBaskets([{
        filterType: "manager",
        filterPubkey: new PublicKey(creatorAddress)
      }]).then(baskets => {
        console.log('Baskets by this creator:', baskets);
        setBaskets(baskets);
        sdk.getCurrentCompositions(baskets).then(basketCompositions => {
          setBasketCompositions(basketCompositions);
        })
      });
    }
  }, [sdk, creatorAddress]);

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col items-center px-4 gap-4 mt-4">
    <Header 
      title={"Creator Profile | Symmetry"}
      path="/creator"
    />
    <div className="flex border rounded-xl w-full md:max-w-96 flex-col gap-4 mt-4 mb-36 px-4 py-4 md:p-4 pb-16">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold tracking-tight">Creator Profile</h3>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {
            creatorAddress ?
            <GenerativeAvatar seed={creatorAddress} size={48}/> :
            <Skeleton width={48} height={48} circle={true}/>
          }
          
          {
            creatorAddress ?
            <div className="flex flex-col gap-1">
              <Username address={creatorAddress}/>
              <LevelBadge level={creatorLevel}/>
            </div>
             :
            <Skeleton width={100} height={24}/>
          }
        </div>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Symmetry Points</p>
            <p className="text-md font-bold">{creatorPoints ? formatNumber(creatorPoints,0) : 0}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <p className="text-sm text-muted-foreground">Baskets Created</p>
            <p className="text-md font-bold">{baskets ? baskets.length : 0}</p>
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-2">
          {
            (baskets && basketCompositions) ?
            baskets.map((basket, i) => {
              return <Link href={"/view/"+basket.ownAddress.toBase58()} key={i} className="w-full flex items-center justify-between p-2 px-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {
                    basketCompositions[i].symbol ?
                    <GenerativeAvatar seed={basketCompositions[i].symbol} size={36}/>
                    :
                    <Skeleton className="w-6 h-6"/>
                  }
                  
                  <div>
                    <p className="text-sm">{basketCompositions[i].name}</p>
                    <p className="text-xs font-bold">{basketCompositions[i].symbol}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-muted-foreground">TVL</p>
                  <p className="text-sm">${formatNumber(Number(basketCompositions[i].basketWorth), 0)}</p>
                </div>
              </Link>
            }) :
            <Skeleton width={100} height={24}/>
          }
        </div>
      </div>
    </div>
  </div>
}

export default CreatorPage;