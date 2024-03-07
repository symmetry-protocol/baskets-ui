import "@/styles/globals.css";
import "@/styles/App.scss";
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { RPC_ENDPOINT } from '@/redux/globalState';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import { useDispatch, useSelector } from "react-redux";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { setAccounts, setDex, setSupportedTokens, setTheme, setTokenList, setTopTokens, setWallet, setWalletConnected } from "@/redux/state";
import { TOKEN_LIST_API } from "@/redux/globalState";
import { GET_USER_TOKENS } from "@/utils/utils";
import { ThemeProvider } from "@/components/theme-provider"
import { useRouter } from "next/router";
import { SymmetryProvider, useSymmetry } from "@/utils/SymmetryContext";
import { Footer } from "@/components/footer";

function MyApp({ Component, pageProps }) {
  return <Provider store={store}>
    <Web3Wrapper Component={Component} pageProps={pageProps}/>
  </Provider>
}


function Web3Wrapper({Component, pageProps}) {

  const network = "mainnet-beta";
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => RPC_ENDPOINT, [RPC_ENDPOINT]);

  const wallets = useMemo(
      () => [
          /**
           * Wallets that implement either of these standards will be available automatically.
           *
           *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
           *     (https://github.com/solana-mobile/mobile-wallet-adapter)
           *   - Solana Wallet Standard
           *     (https://github.com/solana-labs/wallet-standard)
           *
           * If you wish to support a wallet that supports neither of those standards,
           * instantiate its legacy wallet adapter here. Common legacy adapters can be found
           * in the npm package `@solana/wallet-adapter-wallets`.
           */
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new UnsafeBurnerWalletAdapter(),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SymmetryProvider>
              <App Component={Component} pageProps={pageProps} />
            </SymmetryProvider>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function App({Component, pageProps}) {
  const state = useSelector((state) => state.storage);
  const dispatch = useDispatch();
  const { connection } = useConnection();
  const wallet = useWallet();
  const router = useRouter();
  const params = router.query.params || [];
  const sdk = useSymmetry();

  useEffect(() => {
    fetch(TOKEN_LIST_API).then(response => response.json())
    .then(tokenlist => {
      let arr = {
        tokens: tokenlist
      }
      dispatch(setTokenList(arr));
    })
  },[]);


  // force theme to dark
  useEffect(() => {
    let theme = localStorage.getItem('theme');
    if(theme !== 'dark') {
      localStorage.setItem('theme', 'dark');
      router.reload();
    }
  }, [])

  useEffect(() => {
    if(wallet.connected) {
      GET_USER_TOKENS(wallet.publicKey.toBase58(), connection, dispatch);
    }
  }, [wallet, state.refreshState]);

  // set symmetry supported tokens
  useEffect(() => {
    if(sdk) {
      let tokens = Object.assign([],sdk.getTokenListData());
      sdk.getOraclePrices().then(prices => {
        for (let i = 0; i < tokens.length; i++)
          tokens[i].price = prices[i];
        dispatch(setSupportedTokens(tokens));
      })
    }
  }, [sdk])

  return <div className="w-full bg-background flex flex-col items-center">
    <Component {...pageProps} />
    <Footer/>
    <Toaster 
      position="bottom-left"
      
      toastOptions={{
        className: 'border shadow-lg',
        style: {
          fontSize: '16px',
        },
        style: {
          background: 'hsl(var(--background-over))',
          color: '#fff',
        },
      }}
    />
  </div>
}


export default MyApp;