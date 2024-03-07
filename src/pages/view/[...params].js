import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadSymmetryVault, LoadTokenPrices, LoadVaultHolders } from "@/utils/symmetry";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Checkmark from "/public/static/icons/checkmark.svg";
import { Badge } from "@/components/ui/badge";
import GenerativeAvatar from "@/components/generative-avatar";
import { SOL_TOKEN, formatNumber } from "@/utils/utils";
import { PriceChange } from "@/components/price-change";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Title } from "@/components/title";
import { VaultChart } from "@/components/vault-chart";
import { useSelector } from "react-redux";
import Image from "next/image";
import { CompositionTable } from "@/components/composition-table";
import { SwapComponent } from "@/components/swap-component";
import { VaultValue } from "@/components/vault-value";
import { UserVaultHolding } from "@/components/user-vault-holding";
import { VaultInfoBox } from "@/components/vault-infobox";
import { useWallet } from "@solana/wallet-adapter-react";
import { VaultIntegrations } from "@/components/vault-integrations";
import { ManagerDashboard } from "@/components/manager-dashboard";
import { VaultManager } from "@/components/vault-manager";
import { EditHoldingsPopup } from "@/components/edit-holdings-popup";
import { useSymmetry } from "@/utils/SymmetryContext";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { TokenIcon } from "@/components/token-icon";

const VaultPage = ({}) => {
  const state = useSelector((state) => state.storage);
  const router = useRouter();
  const params = router.query.params;
  const wallet = useWallet();
  const sdk = useSymmetry();

  const [basketInfo, setVaultInfo] = useState(null);
  const [vaultToken, setVaultToken] = useState(null);

  const [reload, setReload] = useState(0);
  // popups
  const [editHoldingsPopup, setEditHoldingsPopup] = useState(false);
  useEffect(() => {
    if(params && state.tokenList && sdk) {
      console.log("[params]", params[0])
      sdk.loadFromPubkey(new PublicKey(params[0])).then(basket => {
        if (basket)
          sdk.getCurrentCompositions([basket]).then(parsedData => {
        console.log("[D]", parsedData);
            if (parsedData) {
              let vaultInfo = {
                api: null,
                basket: basket,
                parsed: parsedData[0]
              }
              let vaultToken  = {
                name: vaultInfo.parsed.name,
                symbol: vaultInfo.parsed.symbol,
                uri: vaultInfo.parsed.uri,
                address: vaultInfo.parsed.basketTokenMint,
                price: basket.data.supplyOutsanding.toNumber() == 0 ? 100 : vaultInfo.parsed.rawPrice,
                basket: true,
                logoURI: null,
              }
              // setVaultInfo(vaultInfo);
              // setVaultToken(vaultToken);
              LoadSymmetryVault(params[0]).then(vault => {
                if(vault && vault.status != 'fail') {
                  console.log("[vault]", vault)
                  let formattedVault = Object.assign({},vault);
                    return LoadVaultHolders(vault.fund_token).then(holders => {
                      console.log('fund holders', holders)
                      formattedVault.holders = holders;
                      formattedVault.current_comp_token = formattedVault.current_comp_token.map((token, index) => {
                        return {
                          ...state.tokenList.find(t => t.address === token)
                        }
                      })
                      return formattedVault;
                    })
                } else return null;
              }).then(formattedVault => {
                vaultInfo.api = formattedVault;
                if (formattedVault)
                  vaultToken.logoURI = formattedVault.logoURI;
                  console.log('vaultInfo', vaultInfo, vaultToken);
                  setVaultInfo(vaultInfo);
                  setVaultToken(vaultToken);
              })
            }
          })
      })
    }
  }, [params, state.tokenList, sdk, reload]);


  const rebalanceHoldings = async () => {
    sdk.setWallet(wallet);
    sdk.setPriorityFee(500000);
    toast.loading(<div className="flex flex-col">
      <p className="text-lg font-bold">Rebalancing</p>
      <p className="text-sm text-muted-foreground">Please approve transaction in your wallet</p>
    </div>, {id: 3});
    sdk.rebalanceBasket(basketInfo.basket).catch((e) => {
      toast.error(e.message, {id: 3});
      return null;
    }).then(txs => {
      if (txs) {
        toast.success(
          <div className="flex flex-col">
          <p className="text-lg font-bold">Rebalanced</p>
          <p className="text-sm text-muted-foreground">Basket rebalanced successfully</p>
          {txs.filter(x => x).map((tx, i) => 
            <Link className="text-xs text-blue-500" href={`https://solscan.io/tx/${tx}`} target="_blank">View on Solscan {i+1}</Link>
          )}
        </div>,{id: 3});
      }
      setReload(reload + 1);
    })
  }
  

  return <div className="w-full bg-background flex flex-col items-center gap-4">
    <Header title={(basketInfo && basketInfo.parsed) ? 
      `${basketInfo.parsed.name} | ${basketInfo.parsed.activelyManaged === 0 ? 'Bundle' : 'Portfolio'} - Symmetry`
      : 
      "Symmetry"}
    path={'/explore'}
    />
    <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
      <Breadcrumbs root={{path:'/explore', label: "Explore" }} vaultAddress={basketInfo ? basketInfo.basket.ownAddress.toBase58() : null} items={basketInfo ? [basketInfo.parsed.name] : null} badge={basketInfo ? (basketInfo.parsed.activelyManaged === 0 ? 'Bundle' : 'Portfolio') : null}/>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side */}
        <div className="w-full lg:col-span-2 flex flex-col gap-4">
          {/* Manage Section */}
          {
            basketInfo && wallet.connected && wallet.publicKey.toBase58() === basketInfo.parsed.manager &&
            <ManagerDashboard setEditHoldingsPopup={setEditHoldingsPopup} rebalanceHoldings={rebalanceHoldings}/>
          }
          
          {/* Vault Info */}
          <div className="w-full  flex flex-col p-4 gap-4 border rounded-xl">
            {/* Vault Name/Performance */}
            <div className="w-full flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex items-center gap-4">
                {
                  basketInfo ?
                  <GenerativeAvatar seed={basketInfo.parsed.symbol} size={48}/>
                  :
                  <Skeleton className="w-12 h-12 rounded-full"/>
                }
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {
                      basketInfo ?
                      <p className="text-md">{basketInfo.parsed.name}</p>
                      :
                      <Skeleton className="w-24 h-4"/>
                    }
                    <Checkmark width={16} height={16}/>
                  </div>
                  <div className="flex items-center gap-2">
                    {
                      basketInfo ?
                      <Badge variant={"outline"} className="rounded flex items-center gap-1 w-fit">
                        {
                          basketInfo.parsed.symbol
                        }
                      </Badge>
                      :
                      <Skeleton className="w-16 h-3"/>
                    }
                    {
                      basketInfo &&
                      basketInfo.parsed.basketWorth === 0 &&
                      <Badge variant={"default"} className="text-xs w-fit">NEW</Badge>
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PriceChange label={"24h"} change={(basketInfo && basketInfo.api && basketInfo.api.precise_historical) ? (basketInfo.parsed.rawPrice / basketInfo.api.precise_historical.data["24h"].price) * 100 - 100 : 0}/>
                <PriceChange label={"7d"} change={(basketInfo && basketInfo.api && basketInfo.api.precise_historical) ? (basketInfo.parsed.rawPrice / basketInfo.api.precise_historical.data["7d"].price) * 100 - 100 : 0}/>
                <PriceChange label={"30d"} change={(basketInfo && basketInfo.api && basketInfo.api.precise_historical) ? (basketInfo.parsed.rawPrice / basketInfo.api.precise_historical.data["30d"].price) * 100 - 100 : 0}/>
                <PriceChange label={"All-time"} change={basketInfo && basketInfo.api ? basketInfo.parsed.rawPrice - 100 : 0}/>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px] rounded-xl gap-1">
              {
                basketInfo ?
                basketInfo.parsed.basketWorth > 0 ?
                  <VaultChart vault={basketInfo.api} address={basketInfo.basket.ownAddress.toBase58()} benchmark={true}/>
                  :
                  <div className="w-full h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground text-center">Deposit into the basket to start tracking its performance</p>
                  </div>
                :
                <Skeleton className="w-full h-full"/>
              }
            </div>

            {/* Tokens */}
            <div className="w-full flex flex-col gap-2 overflow-hidden">
              <h1 className="text-sm font-bold">Composition</h1>
              <div className="w-full overflow-x-scroll flex items-center gap-2">
                {
                  basketInfo &&
                  basketInfo.parsed.currentComposition.map((token, index) => {
                    if(token.targetWeight > 0)
                    return <div key={index} className="flex items-center flex-shrink-0 gap-1 p-1 pr-2 border rounded-full">
                      <TokenIcon symbol={token.mintAddress} size={24} className="rounded-full" alt="Token"/>
                      <p className="text-sm font-bold">
                        {formatNumber((token.targetWeight), "2")}%
                        {" " + token.symbol}
                      </p>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
          
          {/* Vault & Creator Description */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <VaultInfoBox vault={basketInfo}/>
            <VaultManager vault={basketInfo}/>
          </div>

          {/* Vault Composition */}
          {
            basketInfo ? 
            <CompositionTable setEditHoldingsPopup={setEditHoldingsPopup} rebalanceHoldings={rebalanceHoldings} basket={basketInfo}/>
            :
            <Skeleton className="w-full h-64"/>
          }
          <div className="w-full flex flex-col gap-2 mb-12">

          </div>
        </div>
        
        {/* Swap */}
        <div className="h-fit flex flex-col gap-4">
          {
            vaultToken && state.supportedTokens &&
            <SwapComponent from={state.supportedTokens[0]} to={vaultToken} basket={basketInfo} setReload={setReload} reload={reload}/>
          }
          <UserVaultHolding vaultToken={vaultToken}/>
          <VaultValue vault={basketInfo ? basketInfo.parsed : null}/>
          {/* <VaultIntegrations vault={basketInfo ? basketInfo.api : null}/> */}
        </div>
      </div>
    </div>
    {
      editHoldingsPopup &&
      <EditHoldingsPopup basket={basketInfo} open={editHoldingsPopup} onClose={() => setEditHoldingsPopup(false)} setReload={setReload} reload={reload}/>
    }
  </div>
}

export default VaultPage;