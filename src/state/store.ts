import { configureStore } from '@reduxjs/toolkit';

import { SwapFormSlice } from './swapForm';

export const store = configureStore({
  reducer: {
    swapForm: SwapFormSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
