import { createSlice } from '@reduxjs/toolkit';

export const FormSettingsSlice = createSlice({
  name: 'formSettings',
  initialState: {
    allowMaxApproval: false,
  },
  reducers: {
    setAllowMaxApproval: (state, action) => {
      state.allowMaxApproval = action.payload;
    },
  },
});

export const { setAllowMaxApproval } = FormSettingsSlice.actions;
