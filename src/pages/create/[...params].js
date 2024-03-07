import { Header } from "@/components/header";
import { SelectTokenPopup } from "@/components/select-token-popup";
import { TokenIcon } from "@/components/token-icon";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSymmetry } from "@/utils/SymmetryContext";
import { ArrowTopRightIcon, MagnifyingGlassIcon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Slider } from "@/components/ui/slider"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WalletIcon from "/public/static/icons/wallet.svg";
import { Textarea } from "@/components/ui/textarea";
import { PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { HOST_PUBKEY } from "@/redux/globalState";
import { useSelector } from "react-redux";
import {Upload} from "@/components/uploadimage.js";

const { ShdwDrive, ShadowFile } = require("@shadow-drive/sdk");



const BasketType = (type) => {
  if(type === 0) return "Bundle";
  else if(type === 1) return "Portfolio";
  else if(type === 2) return "Private Portfolio";
  else return "Unknown";
}

const CreatePage = ({}) => {
  const state = useSelector(state => state.storage);
  const router = useRouter();
  const params = router.query.params;
  const sdk = useSymmetry();
  const wallet = useWallet();
  const [tokensPopup, setTokensPopup] = useState(false);
  const [step, setStep] = useState(1);

  const [drive, setDrive] = useState();
  const { connection } = useConnection();
    useEffect(() => {
        (async () => {
            if (wallet?.publicKey) {
                const drive = await new ShdwDrive(connection, wallet).init();
                console.log("drive was initialized", drive);
                setDrive(drive);
            }
        })();
    }, [wallet?.publicKey])

  // Basket Parameters
  const [type, setType] = useState(null);
  const [basketIcon, setBasketIcon] = useState(null);
  const [basketName, setBasketName] = useState("");
  const [basketSymbol, setBasketSymbol] = useState("");
  const [basketDescription, setBasketDescription] = useState("");
  const [depositFee, setDepositFee] = useState(0.1); // in %, need to convert to bps before sending
  const [slippageTolerance, setSlippageTolerance] = useState(1);// in %, need to convert to bps before sending
  const [basketComposition, setBasketComposition] = useState([]);
  const [basketSettings, setBasketSettings] = useState({
    rebalanceInterval: 3600, // seconds. Check if basket needs rebalancing every 1 hour
    rebalanceThreshold: 300, // bps.  Rebalance on next rebalanceInterval if any token weight is off by 10%
    refilterInterval: 7 * 24 * 60 * 60,
    reweightInterval: 24 * 60 * 60,
    rebalanceInterval: 60 * 60,
    lpOffsetThreshold: 0,
    disableAutomation: false,
    disableLP: false,
  });

  const [image, setImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [txnSig, setTxnSig] = useState("");

  const inputFile = useRef(null);
  const uploadClick = () => {
    console.log("clicked");
    inputFile.current.click();
    
  }

  
  const onChangeFile = (event) =>  {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  }

  useEffect(() => {
    if(params) {
      const basketType = params[0];
      console.log("[basketType]", basketType)
      if(basketType === 'bundle') setType(0);
      else if(basketType === 'portfolio') setType(1);
      else if(basketType === 'private') setType(2);
      else setType(-1);
    }
  }, [params]);

  const createBasket = async () => {
    sdk.setWallet(wallet);
    sdk.setPriorityFee(500000);
    toast.loading("Waiting for transactions...", {id: 4});
    sdk.createBasket({
      name: basketName,
      symbol: basketSymbol,
      uri: basketDescription,
      hostPlatform: HOST_PUBKEY,
      hostPlatformFee: 0,
      manager: wallet.publicKey,
      managerFee: depositFee * 100,
      activelyManaged: type,
      assetPool: Array.from(new Set([0, ...basketComposition.map(x => x.id)])),
      refilterInterval: basketSettings.refilterInterval,
      reweightInterval: basketSettings.reweightInterval,
      rebalanceInterval: basketSettings.rebalanceInterval,
      rebalanceThreshold: basketSettings.rebalanceThreshold,
      rebalanceSlippage: slippageTolerance * 100,
      lpOffsetThreshold: basketSettings.lpOffsetThreshold,
      disableRebalance: basketSettings.disableRebalance,
      disableLp: basketSettings.disableLP,
      rules: basketComposition.map(x => {
        return {
          totalWeight: x.weight,
          fixedAsset: x.id,
          filterBy: 0, numAssets: 1,
          filterDays: 0, sortBy: 0, weightBy: 0,
          weightDays: 0, weightExpo: 0,excludeAssets: [],
      }
      })
    }).catch((e) => {
      toast.error(e.message, {id: 4});
      return null
    }).then(basket => {
      if (basket) {
        toast.success(<a href={"https://solscan.io/account/"+basket.ownAddress.toBase58()}>View on Solscan</a>, {id: 4});
        // TODO: go to basket page
      }
    })
  }

  const addToken = (token) => {
    // check if token already in composition
    let exists = basketComposition.find(t => t.tokenMint === token.tokenMint);
    if(exists) {
      toast.error("Token already in composition");
      setTokensPopup(false);
      return;
    }
    setBasketComposition([...basketComposition, {
      ...token,
      weight: 0
    }]);
    setTokensPopup(false);
  }
  const removeToken = (token) => {
    let newTokens = basketComposition.filter(t => t.tokenMint !== token.tokenMint);
    setBasketComposition(newTokens);
  }

  const adjustTokenWeight = (token, weight) => {
    let newTokens = basketComposition.map(t => {
      if(t.tokenMint === token.tokenMint) {
        return {
          ...t,
          weight: weight
        }
      }
      return t;
    });
    setBasketComposition(newTokens);
  }

  if(type === -1) return <div className="w-full flex items-center justify-center h-[350px] relative">
    <p className="absolute text-lg font-bold text-muted-foreground">Oops, you're on a wrong page mister.</p>
  </div>
  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-1 md:px-4 gap-4 mt-4">
    <Header title={"Create Basket | Symmetry"} path={'/create'} />
    <div className="w-full flex flex-col px-4 gap-8 mt-4 mb-8">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold">Create {BasketType(type)}</h2>
          <p className="text-muted-foreground text-center">
            {
              step === 1 ? "Get started by selecting tokens for your composition."
              :
              step === 2 ? "Set name, symbol and describe."
              :
              step === 3 && "Set deposit fee and slippage tolerance."
            }
          </p>
        </div>
        <div className={`w-[250px] h-2 rounded-full border bg-background-over overflow-hidden`}>
          <div style={{width: step/3*100 +"%"}} className={`h-full bg-primary rounded-full transition-all`}/>
        </div>
        <div className="max-w-[420px] w-full flex flex-col gap-4 items-start">
          <div className="w-full flex items-center gap-2">
            
            <div onClick={() => setTokensPopup(true)} className="w-full h-12 flex items-center gap-2 border rounded-md px-4 hover:bg-background-over hover:border-gray-500 text-muted-foreground hover:text-primary cursor-pointer transition-all">
              <MagnifyingGlassIcon width={24} height={24}/>
              <p className="text-sm">Search Tokens</p>
            </div>
            <div onClick={() => null/* SITLA ADD IMPORT FUNCTION */} className="w-fit col-span-2 h-12 flex items-center gap-2 border rounded-md px-4 hover:bg-background-over hover:border-gray-500 text-muted-foreground hover:text-primary cursor-pointer transition-all">
              <WalletIcon width={20} height={20}/>
              <p className="text-sm">Import</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-lg">{BasketType(type)} Composition</p>
            <div className="w-full flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Token</p>
              <div className="flex items-center gap-2 h-full">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-xs text-muted-foreground">X</p>
              </div>
            </div>
            <div className="w-full rounded-lg border bg-background-over p-2 flex flex-col gap-2 max-h-[500px] h-full overflow-y-scroll">
              {
                basketComposition.length > 0 ? basketComposition.map((token, i) => {
                  return <div key={i} className="w-full flex items-center justify-between h-14 shrink-0">
                    <div className="flex items-center gap-2 ">
                      <TokenIcon symbol={token.tokenMint} size={32}/>
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold">{token.symbol}</p>
                          <Link href={"https://solscan.io/token/"+token.tokenMint} className="flex items-center gap-1" target="_blank">
                            <Badge variant={"outline"} className="text-xs w-fit flex items-center gap-1">
                              {token.tokenMint.slice(0,3)+"..."+token.tokenMint.slice(-3)}
                              <ArrowTopRightIcon width={12} height={12}/>
                              </Badge>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 h-full">
                      <input lang="en" type="number" placeholder="0.00" inputMode='decimal' pattern="[0-9,]*" className="w-16 text-xl h-full text-center rounded-md border bg-background-over font-bold" value={token.weight > 0 ? token.weight : ""} onChange={(e) => adjustTokenWeight(token, e.target.value)}/>
                      <div onClick={() => removeToken(token)} className="w-6 h-full rounded-md bg-red-900 bg-opacity-50 hover:bg-red-700 transition-all cursor-pointer flex items-center justify-center">
                        <TrashIcon width={16} height={16} className="text-white"/>
                      </div>
                    </div>
                  </div>
                }) : 
                <div className="w-full h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Start by adding tokens to composition</p>
                </div>
              }
            </div>
          </div>
          {
            step > 1 &&
            <div className="w-full flex flex-col gap-2">
              <p className="text-lg">Name your {BasketType(type)}</p>
              <div className="w-full flex flex-col gap-2">
                {/* <div className="w-full flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">{BasketType(type)} Token Icon</p>
                  <div className="w-12 h-12 cursor-pointer rounded-full bg-secondary flex items-center justify-center">
                  <UploadIcon onClick={uploadClick}/>
                    <div>
                      <input type="file" accept="image/*" ref={inputFile} style={{display: "none" }} onChange={onChangeFile} />
                    </div>
                    
                  </div>
                  {image && 
                    <div className="w-12 h-12 cursor-pointer rounded-full bg-secondary flex items-center justify-center">
                      <img alt="not found" src={URL.createObjectURL(image)}></img>
                    </div>
                  }
                </div> */}
                {/* {image && <Upload connection={connection} wallet={wallet} drive={drive} file={image} setFile={setImage} 
                          setTxnSig={setTxnSig} setUploadUrl={setUploadUrl} />} */}
                <div className="w-full flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{BasketType(type)} Name</p>
                  <p className="text-xs text-muted-foreground">{BasketType(type)} Token Ticker</p>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                  <input className="w-full h-12 rounded-md border bg-background p-4" value={basketName} onChange={(e) => setBasketName(e.target.value)} placeholder="My Portfolio"/>
                  <input className="w-full h-12 rounded-md border bg-background p-4" value={basketSymbol} onChange={(e) => setBasketSymbol(e.target.value)} placeholder="TSLA"/>
                </div>
                {/* <p className="text-xs text-muted-foreground">{BasketType(type)} Description</p>
                <Textarea className="min-h-[75px]" value={basketDescription} onChange={(e) => setBasketDescription(e.target.value)} placeholder={"Describe your basket and what it's about. A good description helps users understand your " + BasketType(type) + " and what to expect"} /> */}
              </div>
            </div>
          }
          {
            step > 2 &&
            <div className="w-full flex flex-col gap-2">
              <p className="text-lg">Settings</p>
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Deposit Fee</p>
                  <p className="text-xs text-muted-foreground">Slippage Tolerance</p>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                  <div className="w-full h-12 relative">
                    <input className="w-full h-12 rounded-md border bg-background p-4" onChange={
                      (e) => {
                        let value = e.target.value;
                        if(value <= 15)
                        setDepositFee(value);
                      }
                    } value={depositFee} placeholder="0.1"/>
                    <span className="absolute right-4 top-0 h-12 flex items-center text-muted-foreground font-bold">%</span>
                  </div>
                  <div className="w-full h-12 relative">
                    <input onChange={
                      (e) => {
                        let value = e.target.value;
                        if(value <= 15)
                        setSlippageTolerance(value);
                      }
                    } value={slippageTolerance} className="w-full h-12 rounded-md border bg-background p-4" placeholder="1"/>
                    <span className="absolute right-4 top-0 h-12 flex items-center text-muted-foreground font-bold">%</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">Create Fee:</p>
                <p className="text-sm font-bold">~0.28902 SOL</p>
              </div>
            </div>
          }
          {
            wallet.connected ?
            <Button onClick={() => {
              if(step < 3)
                setStep((_step) => _step+1)
              else createBasket();
            }} disabled={basketComposition ? basketComposition.length < 1 : true} variant={"default"} className="w-full h-12">
              {step < 3 ? "Next" : "Create"}
            </Button>
            :
            <Button variant={'secondary'} className="w-full h-12" disabled>
              Please connect wallet to continue
            </Button>
          }
        </div>
        
      </div>

    </div>
    {
      tokensPopup &&
      <SelectTokenPopup open={tokensPopup} onClose={() => setTokensPopup(false)} onSelect={
        (token) => addToken(token)} tokenList={state.supportedTokens}/>
    }

  </div>
}

export default CreatePage;