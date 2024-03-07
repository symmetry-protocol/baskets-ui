import { createSlice } from "@reduxjs/toolkit";
import globalState from "./globalState";

export const stateSlice = createSlice({
  name: "state",
  initialState: globalState,
  reducers: {
    setSupportedTokens: (state, action) => {
      state.supportedTokens = action.payload;
    },
    setAvailableTokens: (state, action) => {
      state.availableTokens = action.payload;
    },
    setTokenList: (state, action) => {
      state.tokenList = action.payload.tokens;
    },
    setWalletConnected: (state, action) => {
      state.connected = true;
      state.publicKey = action.payload.toBase58();
    },
    setWalletDisconnected: (state, action) => {
      state.connected = false;
      state.publicKey = null;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { setSdk, setLiquiditySdk, setPendingStates, setPrismSdk, setSupportedTokens, 
setAvailableTokens, setTokenList, setFundsList, setTokenAccounts, setExplorerHistory, setExplorerStats, 
setWalletConnected, setWalletDisconnected, setProvider, initWallet, setAccounts, setOpenOrders, setNewTx,
setGeneralStats, setBenchmarkCharts, setMarketsV1, setMarketsV2, setWallet, setTheme, setDex, setClosedOpenOrders, setTopTokens, refreshState } = stateSlice.actions;

export default stateSlice.reducer;
