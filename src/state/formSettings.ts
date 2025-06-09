import { createSlice } from '@reduxjs/toolkit';

export const FormSettingsSlice = createSlice({
  name: 'formSettings',
  initialState: {
    allowMaxApproval: true,
  },
  reducers: {
    setAllowMaxApproval: (state, action) => {
      state.allowMaxApproval = action.payload;
    },
  },
});

export const { setAllowMaxApproval } = FormSettingsSlice.actions;
