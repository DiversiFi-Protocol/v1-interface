import { createSlice } from '@reduxjs/toolkit';

export const SwapFormSlice = createSlice({
  name: 'swapForm',
  initialState: {
    inputAsset: null,
  },
  reducers: {
    setInputAsset: (state, action) => {
      state.inputAsset = action.payload;
    },
  },
});

export const { setInputAsset } = SwapFormSlice.actions;
