import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

export const selectTheme = createSelector(
  (state: RootState) => state.theme,
  (theme) => theme.theme
);
