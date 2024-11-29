import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    walletInfo: null, 
    isLoggedIn: false, 
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        // setCurrentAccount: (state, action) => {
        //     state.walletInfo = action.payload;
        // },
        setWalletInfo: (state, action) => {
            state.walletInfo = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
    },
}); 

export const { setWalletInfo, setIsLoggedIn, setCurrentAccount } = walletSlice.actions;

export default walletSlice.reducer;