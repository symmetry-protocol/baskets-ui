// store.js
import { configureStore } from '@reduxjs/toolkit';
import stateReducer from './state';

export default configureStore({
  reducer: {
    storage: stateReducer
  }
})