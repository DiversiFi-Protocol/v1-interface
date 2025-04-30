import { BigNumber } from 'bignumber.js';

export type BigNumberish = BigNumber | string | number;
export type LocaleSeparators = { group?: string; decimal?: string };

export const BIG_NUMBERS = {
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
};

export const MustBigNumber = (amount?: BigNumberish | null): BigNumber =>
  new BigNumber(amount || 0);

type FormatNumberType = 'compact' | 'fiat' | 'number' | 'compact-fiat';

export function formatNumber({
  value,
  type = 'number',
  options,
}: {
  value?: BigNumberish | null;
  type?: FormatNumberType;
  options?: Intl.NumberFormatOptions;
}) {
  if (value == null) return '-';

  const numValue = MustBigNumber(value).toNumber();

  const baseOptions: Intl.NumberFormatOptions = {
    compact: { notation: 'compact' as const },
    'compact-fiat': { notation: 'compact' as const, style: 'currency' as const, currency: 'USD' },
    fiat: { style: 'currency' as const, currency: 'USD' },
    number: {},
  }[type];

  const formatter = Intl.NumberFormat('en', { ...baseOptions, ...options });
  return formatter.format(numValue);
}
