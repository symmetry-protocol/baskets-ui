import React, { createContext, useContext, useState, useEffect } from 'react';
// Import the Symmetry SDK
import { BasketsSDK } from '@symmetry-hq/baskets-sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Create the context
const SymmetryContext = createContext();

export const useSymmetry = () => {
  const context = useContext(SymmetryContext);
  if (context === undefined) {
    throw new Error('useSymmetry must be used within a SymmetryProvider');
  }
  return context;
};
// Provider component
export const SymmetryProvider = ({ children }) => {
  const [sdk, setSdk] = useState(null);
  const {connection} = useConnection();
  const wallet = useWallet();

  /* Initialize Baskets SDK */
  useEffect(() => {
    BasketsSDK.init(connection).then(_sdk => setSdk(_sdk));
  }, []);

  /* Set wallet in Baskets SDK when connected */
  useEffect(() => {
    if (wallet.connected) {
      //@ts-ignore
      sdk?.setWallet(wallet.wallet);
    }
  }, [wallet.connected]);

  return (
    <SymmetryContext.Provider value={sdk}>
      {children}
    </SymmetryContext.Provider>
  );
};
