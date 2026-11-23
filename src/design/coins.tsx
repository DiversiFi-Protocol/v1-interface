// Display data for the app screens, copied from diversifi.tech (web/lib/coins.ts, web/components/brand.tsx).
// Colours, display names and issuers only: amounts, addresses and decimals always come from the client's
// constants and hooks (SUPPORTED_RESERVE_ASSETS, BACKED_TOKEN), matched here by address.
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SUPPORTED_RESERVE_ASSETS, type SupportedAsset } from '@/constants/tokens';

type Style = { t: string; s: number; color: string; issuer: string };

// Brand order (never reorder) keyed by lower-case mainnet address.
const STYLE: [string, Style][] = [
  ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', { t: 'USDC', s: 30, color: 'var(--usdc)', issuer: 'Circle' }],
  ['0x6b175474e89094c44da98b954eedeac495271d0f', { t: 'DAI', s: 15, color: 'var(--dai)', issuer: 'Sky' }],
  ['0xdc035d45d973e3ec169d2276ddab16f1e407384f', { t: 'USDS', s: 15, color: 'var(--usds)', issuer: 'Sky' }],
  ['0xdac17f958d2ee523a2206206994597c13d831ec7', { t: 'USDT', s: 10, color: 'var(--usdt)', issuer: 'Tether' }],
  ['0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f', { t: 'GHO', s: 10, color: 'var(--gho)', issuer: 'Aave' }],
  ['0xc5f0f7b66764f6ec8c8dff7ba683102295e16409', { t: 'FDUSD', s: 10, color: 'var(--fdusd)', issuer: 'First Digital' }],
  ['0xcacd6fd266af91b8aed52accc382b4e165586e29', { t: 'frxUSD', s: 10, color: 'var(--frxusd)', issuer: 'Frax' }],
];
const FALLBACK_COLORS = ['var(--usdc)', 'var(--dai)', 'var(--usds)', 'var(--usdt)', 'var(--gho)', 'var(--fdusd)', 'var(--frxusd)'];

export type Coin = Style & { asset: SupportedAsset };

/** The client's reserve assets, in brand order, with display styling. Unknown assets keep their own symbol. */
export const COINS: Coin[] = (() => {
  const order = STYLE.map(([a]) => a);
  const byAddr = new Map(STYLE);
  return [...SUPPORTED_RESERVE_ASSETS]
    .sort((a, b) => {
      const ia = order.indexOf(a.address.toLowerCase());
      const ib = order.indexOf(b.address.toLowerCase());
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    })
    .map((asset, i) => ({
      asset,
      ...(byAddr.get(asset.address.toLowerCase()) ?? {
        t: asset.symbol,
        s: 100 / SUPPORTED_RESERVE_ASSETS.length,
        color: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        issuer: asset.symbol,
      }),
    }));
})();

export const ETHERSCAN = 'https://etherscan.io';
export const SITE = 'https://diversifi.tech';
export const coinUrl = (c: Coin) => `${ETHERSCAN}/token/${c.asset.address}?a=${BACKING_POOL_ADDRESS}`;
// No allocation date: the split shown in the app is read live from the reserve contract.
export const FOOTNOTE = 'Diversification reduces single-issuer exposure; it does not eliminate risk.';

export const f2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtK = (v: number) => '$' + (v / 1000).toFixed(1) + 'K';
export const hhmm = (ms: number) => {
  const d = new Date(ms);
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
};
/** Round shares to one decimal by largest remainder so they total exactly 100.0. */
export function largestRemainder(weights: number[], total = 1000): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (!sum) return weights.map(() => 0);
  const raw = weights.map((w) => (w / sum) * total);
  const floor = raw.map(Math.floor);
  let left = total - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - floor[i], i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left-- <= 0) break;
    floor[i]++;
  }
  return floor.map((v) => v / 10);
}

// Ring mark. Arc lengths encode the 30/15/15/10/10/10/10 split on r=40 (circumference 251.33).
const ARCS = [
  { d: '70.40 180.93', o: 0 },
  { d: '32.70 218.63', o: -75.4 },
  { d: '32.70 218.63', o: -113.1 },
  { d: '20.13 231.19', o: -150.8 },
  { d: '20.13 231.19', o: -175.93 },
  { d: '20.13 231.19', o: -201.06 },
  { d: '20.13 231.19', o: -226.19 },
];

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: 'block', flex: 'none' }}>
      <g fill="none" transform="rotate(-90 50 50)" stroke="var(--fg)" strokeWidth={10}>
        {ARCS.map((a, i) => (
          <circle key={i} cx={50} cy={50} r={40} strokeDasharray={a.d} strokeDashoffset={a.o} />
        ))}
      </g>
      <circle cx={50} cy={50} r={8} fill="var(--signal)" />
    </svg>
  );
}

export function Wordmark({ size = 24, mark = 28 }: { size?: number; mark?: number }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Mark size={mark} />
      <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: '-0.03em' }}>diversifi</span>
    </span>
  );
}

export function TokenIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx={50} cy={50} r={50} fill="#BFEFFF" />
      <circle cx={50} cy={50} r={30} fill="none" stroke="#0D0E10" strokeWidth={12} />
      <circle cx={50} cy={50} r={9} fill="#0D0E10" />
    </svg>
  );
}

/** Static basket bar at the target split, for tags. */
export function MiniBar({ height = 14, gap = 2, radius = 2, width }: { height?: number; gap?: number; radius?: number; width?: number }) {
  return (
    <span aria-hidden="true" className="minibar" style={{ height, gap, width, display: 'flex' }}>
      {COINS.map((c) => (
        <i key={c.t} style={{ flex: `${c.s} 1 0`, background: c.color, borderRadius: radius }} />
      ))}
    </span>
  );
}
