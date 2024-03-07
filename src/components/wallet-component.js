import {
  useWalletModal
} from '@solana/wallet-adapter-react-ui';
import { useWalletDisconnectButton } from '@solana/wallet-adapter-base-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from "react";
import { ChevronDownIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSymmetry } from '@/utils/SymmetryContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BasketsSDK } from '@symmetry-hq/baskets-sdk';
import { formatNumber } from '@/utils/utils';
import { LoaderIcon } from 'react-hot-toast';
import { DepositPopup } from './deposit-popup';
import { RedeemPopup } from './redeem-popup';

require('@solana/wallet-adapter-react-ui/styles.css');


export const WalletComponent = ({}) => {
  const wallet = useWallet();
  const sdk = useSymmetry();
  const [depositStates, setDepositStates] = useState([]);
  const [redeemStates, setRedeemStates] = useState([]);

  const [depositPopup, setDepositPopup] = useState(false);
  const [redeemPopup, setRedeemPopup] = useState(false);
  const [tempState, setTempState] = useState(null);

  useEffect(() => {
    if (sdk && wallet && wallet.connected && wallet.publicKey) {
      sdk.findActiveBuyStates(wallet.publicKey).then(res => setDepositStates(res));
      sdk.findActiveSellStates(wallet.publicKey).then(res => setRedeemStates(res));
      let interval = setInterval(() => {
        sdk.findActiveBuyStates(wallet.publicKey).then(res => setDepositStates(res));
        sdk.findActiveSellStates(wallet.publicKey).then(res => setRedeemStates(res));
      }, 25000);
      return () => clearInterval(interval);
    }
  }, [sdk, wallet]);

  const {visible, setVisible} = useWalletModal();
  const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } = useWalletDisconnectButton();

  useEffect(() => { // connect to a wallet if its selected but not connected
    let timeout = null;
    if(!wallet.connected && wallet.wallet) {
      timeout = setTimeout(() => wallet.connect(), 1000)
    }

    return () => clearTimeout(timeout)
  },[wallet]);

  return <div className={'flex items-center w-fit'}>
    {
      wallet.connected ?
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"secondary"} className={"flex items-center gap-2 p-1 md:p-2"}>
            <Image width={24} height={24} src={walletIcon} alt={walletName} />
            <p className={'text-primary'}>{wallet.publicKey.toBase58().slice(0,3) + "..." + wallet.publicKey.toBase58().slice(-3)}</p>
            <ChevronDownIcon/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Temporary Accounts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            depositStates.map((depState, i) => {
              return <DropdownMenuItem key={i} onClick={() => {
                setTempState(depState);
                setDepositPopup(true);
              
              }} className='flex items-center gap-1'>
                <LoaderIcon/>
                <p className='text-sm'>Depositing {formatNumber(depState.data.usdcContributed.toNumber() / 10**6,2)} USDC</p>
              </DropdownMenuItem>
            })
          }
          {
            redeemStates.map((redeemState, i) => {
              return <DropdownMenuItem key={i} onClick={() => {
                setTempState(redeemState);
                setRedeemPopup(true);
              }}>
                <p className='text-sm'>Redeem Pending</p>
              </DropdownMenuItem>
            })
          }
          {
            redeemStates.length === 0 && depositStates.length === 0 &&
            <p className='w-full h-12 text-xs flex text-muted-foreground items-center p-4'>No Temporary Accounts</p>
          }
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => onButtonClick()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      :
      <Button variant="secondary" className={"flex items-center gap-1 bg-blue-600 hover:bg-blue-700"} onClick={() => setVisible(true)}>
        {/* <PersonIcon width={20} height={20}/> */}
        <p className={'text-white'}>Connect Wallet</p>
      </Button>
    }
    { depositPopup &&
      <DepositPopup tempState={tempState} open={depositPopup} onClose={() => setDepositPopup(false)}/>
    }
    { redeemPopup &&
      <RedeemPopup tempState={tempState} open={redeemPopup} onClose={() => setRedeemPopup(false)}/>
    }
  </div>
}
