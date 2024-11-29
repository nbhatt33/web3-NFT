import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contract: null,
};

const contractSlice = createSlice({
    name: 'contract',
    initialState,
    reducers: {
        setMarketContract: (state, action) => {
            state.contract = action.payload;
        },
    },
});
export const { setMarketContract } = contractSlice.actions;
export default contractSlice.reducer;
// In contractSlice.js
// const initialState = {
//     contract: null,
//     loading: false,
//     error: null,
// };

// const contractSlice = createSlice({
//     name: 'contract',
//     initialState,
//     reducers: {
//         setMarketContract: (state, action) => {
//             state.contract = action.payload;
//             state.loading = false;
//             state.error = null;
//         },
//         setContractLoading: (state) => {
//             state.loading = true;
//         },
//         setContractError: (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//         },
//     },
// });

// export const { setMarketContract, setContractLoading, setContractError } = contractSlice.actions;
// export default contractSlice.reducer;