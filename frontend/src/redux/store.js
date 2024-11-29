import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './features/walletSlice';
import contractReducer from './features/contractSlice';

export const store = configureStore({
    reducer: {
      wallet: walletReducer,
      contract: contractReducer,
    },
  });
  
  export default store;