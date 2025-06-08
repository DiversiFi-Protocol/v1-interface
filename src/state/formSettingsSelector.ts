import { type RootState } from '@/state/store';

export const selectShouldAllowMaxApprovals = (state: RootState) =>
  state.formSettings.allowMaxApproval;
