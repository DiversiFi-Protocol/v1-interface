import { BigNumber } from 'bignumber.js';

export type BigNumberish = BigNumber | string | number;
export type LocaleSeparators = { group?: string; decimal?: string };

export const BIG_NUMBERS = {
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
};

export const MustBigNumber = (amount?: BigNumberish | null): BigNumber =>
  new BigNumber(amount || 0);
