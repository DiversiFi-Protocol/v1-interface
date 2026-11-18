// The DiversiFi app screen from diversifi.tech/app (web/components/AppFlow.tsx), moved here as the front end only.
// Everything that touches money is the client's own code, unchanged: quotes, approvals and transactions come from
// src/hooks/BackingPool (swapHook, mintHook, burnHook), balances from useAssetBalances, reserve figures from
// usePoolReserves/useAssets, and wallets from the existing Wagmi + ConnectKit setup. The step runner below repeats
// the one in the client's SwapForm/MintForm/BurnForm. Screens for features the client app doesn't have (one-coin
// rebalance, our own terms step, activity history, market price) are left out.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useModal } from 'connectkit';
import { toast } from 'sonner';
import { type WalletClient } from 'viem';
import { useAccount, useDisconnect, useSwitchChain, useWalletClient } from 'wagmi';

import { chainId as APP_CHAIN_ID } from '@/constants/chain';
import { EMPTY_ARR } from '@/constants/objects';
import { TermsRoutes } from '@/constants/routes';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS, type SupportedAsset } from '@/constants/tokens';

import { useBurnSteps, useBurnWithdrawalAmounts, useSimulateBurn } from '@/hooks/BackingPool/burnHook';
import { useMintDepositAmounts, useMintSteps, useSimulateMint } from '@/hooks/BackingPool/mintHook';
import { useGetSwapQuote, useSwapSteps } from '@/hooks/BackingPool/swapHook';
import { useGetAssetParamsForAllAssets } from '@/hooks/BackingPool/useAssets';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { useDebounce } from '@/hooks/useDebounce';

import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';

import s from './app.module.css';
import { COINS, ETHERSCAN, FOOTNOTE, SITE, f2, hhmm, Mark, MiniBar, TokenIcon, Wordmark } from './coins';
import './design.css';
import { ReserveBar, useReserveReading } from './ReserveBar';

type View = 'amount' | 'review' | 'done';
type Tab = 'swap' | 'contribute';
type Toast = { color: string; text: string; word: string } | null;
type Step = { type: string; execute: (signer: WalletClient) => Promise<{ success: boolean; error?: unknown }> };

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum mainnet', 10: 'OP Mainnet', 56: 'BNB Chain', 137: 'Polygon', 8453: 'Base', 42161: 'Arbitrum One', 43114: 'Avalanche', 11155111: 'Sepolia',
};
const STEP_LABELS: Record<string, string> = {
  network: 'switch network',
  approve: 'approve',
  'approve-permit2': 'Permit2 approval',
  swap: 'swap',
  mint: 'mint',
  burn: 'redeem',
};

const short = (a?: string) => (a ? a.slice(0, 6) + '…' + a.slice(-4) : '');
// Balances are rounded down to the cent, so the shown balance is exactly what clicking it fills in.
const down2 = (n: number) => Math.floor(n * 100) / 100;
const num = (v: string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function isRejection(e: unknown) {
  for (let c = e as { name?: string; code?: number; cause?: unknown } | undefined; c; c = c.cause as typeof c) {
    if (c.name === 'UserRejectedRequestError' || c.code === 4001) return true;
  }
  return false;
}

/**
 * Runs the client's approve/sign steps the way their SwapForm, MintForm and BurnForm do: a one-step job runs once
 * directly; a multi-step job is handed to the auto-runner, which runs each step after the previous one succeeds; an
 * error stops and offers a retry of the same step.
 * Two additions: a step can never start while another is still waiting for the wallet (no double requests), and a
 * retried final step also counts as done, so the confirmation screen shows.
 */
function useStepRunner(signer: WalletClient | undefined, onComplete: () => void) {
  const [steps, setSteps] = useState<Step[]>(); // multi-step jobs only, as in the client's forms
  const [single, setSingle] = useState<Step[]>(); // a one-step job, kept for retry; never auto-run
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  const done = useRef(onComplete);
  done.current = onComplete;

  const run = async (step: Step, wallet: WalletClient) => {
    if (running.current) return null;
    running.current = true;
    try {
      return await step.execute(wallet);
    } finally {
      running.current = false;
    }
  };

  useEffect(() => {
    async function autoPromptSteps() {
      if (steps == null || steps.length === 0 || steps[idx] == null || signer == null) return;
      const res = await run(steps[idx], signer);
      if (!res) return;
      if (res.success && idx < steps.length - 1) setIdx((prev) => prev + 1);
      else if (res.success) done.current();
      if (!res.success && res.error) setError(res.error);
    }
    autoPromptSteps();
  }, [steps, idx, signer]);

  const start = async (all: Step[] | undefined) => {
    const first = all?.at(0);
    if (all == null || all.length === 0 || !signer || !first) {
      toast.error('Something went wrong');
      return;
    }
    if (running.current) return;
    setError(undefined);
    setBusy(true);
    setIdx(0);
    if (all.length === 1) {
      setSteps(undefined);
      setSingle(all);
      const res = await run(first, signer);
      if (!res) return;
      if (res.success) done.current();
      else {
        setBusy(false);
        setError(res.error);
      }
    } else {
      setSingle(undefined);
      setSteps(all);
    }
  };

  const retry = async () => {
    if (single) return start(single);
    const step = steps?.[idx];
    if (step == null || signer == null) return;
    setError(undefined);
    const res = await run(step, signer);
    if (!res) return;
    if (res.success && idx < steps!.length - 1) setIdx((prev) => prev + 1);
    else if (res.success) done.current();
    else setError(res.error);
  };

  const reset = useCallback(() => {
    setSteps(undefined);
    setSingle(undefined);
    setIdx(0);
    setBusy(false);
    setError(undefined);
  }, []);

  return { steps, idx, error, busy, start, retry, reset };
}

/* Coin picker: a styled pill over a native <select>, so it works with keyboards, screen readers and phone pickers. */
function CoinPick({ id, label, value, options, onChange }: {
  id: string; label: string; value: string;
  options: { value: string; label: string; color: string; note?: string; disabled?: boolean }[];
  onChange: (v: string) => void;
}) {
  const cur = options.find((o) => o.value === value) ?? options[0];
  return (
    <span className={s.pick}>
      {cur.color ? <i className="sw" style={{ background: cur.color }} /> : <MiniBar width={22} height={8} gap={1} radius={1} />}
      <span>{cur.label}</span>
      <svg viewBox="0 0 12 12" width={10} height={10} aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
      <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}{o.note ? ` · ${o.note}` : ''}</option>)}
      </select>
    </span>
  );
}

/* Fixed DFiUSD tag, same size as the picker. */
const DfiTag = () => <span className={s.unit}><TokenIcon size={18} />DFiUSD</span>;
const BasketTag = () => <span className={s.unit}><MiniBar width={22} height={8} gap={1} radius={1} />basket</span>;
const FlipIcon = () => (
  <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5v11M2.5 11 5 13.5 7.5 11M11 13.5v-11M8.5 5 11 2.5 13.5 5" /></svg>
);

export default function AppScreen() {
  const { reading, mode } = useReserveReading();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { setOpen: openConnectKit } = useModal();
  const signer = useWalletClient();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const connected = mounted && isConnected;
  const wrongNet = connected && chainId !== APP_CHAIN_ID;

  const [step, setStep] = useState<View>('amount');
  const [tab, setTab] = useState<Tab>('swap');
  // swap: 'buy' pays a coin for DFiUSD, 'sell' pays DFiUSD for a coin.
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [swapIdx, setSwapIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<'mint' | 'redeem'>('mint');
  const [amount, setAmount] = useState('');
  const [focus, setFocus] = useState(false);
  const [toast_, setToast] = useState<Toast>(null);
  const [done, setDone] = useState<{ at: number; title: string; sumIn: string; sumOut: string; inLabel: string } | null>(null);
  const toastT = useRef(0);
  const showToast = (t: Toast, ms?: number) => {
    clearTimeout(toastT.current);
    setToast(t);
    if (ms) toastT.current = window.setTimeout(() => setToast(null), ms);
  };

  const view = !connected ? 'connect' : wrongNet ? 'wrong-network' : step;

  /* ---------- wallet balances (client hook) ---------- */
  const { balances } = useAssetBalances();
  const balBy = useMemo(() => objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address.toLowerCase(), a])), [balances]);
  const balOf = (a: SupportedAsset) => num(balBy[a.address.toLowerCase()]?.balance);
  const ready = connected && balances != null;
  const dfiNum = balOf(BACKED_TOKEN);

  /* ---------- amount ---------- */
  const debounced = useDebounce(amount);
  const settled = debounced === amount;
  const amt = num(amount);
  const isSwap = tab === 'swap';
  const isMint = tab === 'contribute' && dir === 'mint';
  const isRedeem = tab === 'contribute' && dir === 'redeem';

  /* ---------- swap (client swapHook) ---------- */
  const richest = COINS.reduce((best, c, i) => (balOf(c.asset) > balOf(COINS[best].asset) ? i : best), 0);
  const sIdx = swapIdx ?? richest;
  const sCoin = COINS[sIdx];
  const assetIn = side === 'buy' ? sCoin.asset : BACKED_TOKEN;
  const assetOut = side === 'buy' ? BACKED_TOKEN : sCoin.asset;
  const inT = side === 'buy' ? sCoin.t : 'DFiUSD';
  const outT = side === 'buy' ? 'DFiUSD' : sCoin.t;
  const swapAmount = isSwap ? debounced : '';
  const swapQuote = useGetSwapQuote({ assetIn, assetOut, amount: swapAmount });
  const { amountOutBigInt, amountOut = '' } = swapQuote?.data ?? {};
  const swapSteps = useSwapSteps({
    assetIn,
    assetOut,
    amount: swapAmount,
    minAmountOut: amountOutBigInt ?? 0n * 9995n / 10000n, // unchanged from the client's SwapForm
  });
  const swapPayBal = balOf(assetIn);
  const swapOut = isSwap && settled && swapQuote.data && amt > 0 ? num(amountOut) : null;
  let swapErr = '';
  if (isSwap && amt > 0 && settled && swapQuote.isError) swapErr = 'the pool can’t fill this amount. try a smaller one.';
  else if (isSwap && ready && amt > swapPayBal) swapErr = 'amount is above your balance.';
  const rateText = swapOut !== null && amt > 0
    ? side === 'buy' ? `1 ${sCoin.t} = ${(swapOut / amt).toFixed(4)} DFiUSD` : `1 DFiUSD = ${(swapOut / amt).toFixed(4)} ${sCoin.t}`
    : '—';
  const swapValid = isSwap && ready && amt > 0 && swapOut !== null && !swapErr && (swapSteps.data?.length ?? 0) > 0;

  /* ---------- full-basket mint (client mintHook) ---------- */
  const mintAmount = isMint ? debounced : '';
  const mintDeposits = useMintDepositAmounts({ amount: mintAmount });
  const mintSim = useSimulateMint({ amount: mintAmount });
  const mintSteps = useMintSteps({ amount: mintAmount });
  const depositBy = new Map((mintDeposits ?? []).map((d) => [d.address.toLowerCase(), num(d.depositAmount)]));
  // Same rule as the client's MintForm: every deposit must be covered by the wallet balance.
  const hasTokensForMint = SUPPORTED_RESERVE_ASSETS.every((asset) => {
    const d = mintDeposits?.find((a) => a.address.toLowerCase() === asset.address.toLowerCase());
    if (d == null) return true;
    return MustBigNumber(balBy[asset.address.toLowerCase()]?.balance).gte(d.depositAmount);
  });
  const params = useGetAssetParamsForAllAssets();
  // "You can mint up to": the smallest balance ÷ target share across the basket (display only).
  const maxMint = useMemo(() => {
    const caps = SUPPORTED_RESERVE_ASSETS.map((a, i) => {
      const t = params.data?.[i]?.targetAllocation ?? 0;
      return t > 0 ? balOf(a) / t : Infinity;
    }).filter(Number.isFinite);
    return caps.length ? Math.max(0, down2(Math.min(...caps)) - 0.01) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.data, balBy]);

  /* ---------- full-basket redeem (client burnHook) ---------- */
  const burnAmount = isRedeem ? debounced : '';
  const withdrawals = useBurnWithdrawalAmounts({ burnAmount });
  const burnSim = useSimulateBurn({ amount: burnAmount });
  const burnSteps = useBurnSteps({ amount: burnAmount });
  const withdrawBy = new Map((withdrawals ?? []).map((w) => [w.address.toLowerCase(), num(w.withdrawalAmount)]));
  // Same rule as the client's BurnForm.
  const hasTokensForBurn = MustBigNumber(balBy[BACKED_TOKEN.address.toLowerCase()]?.balance).gte(MustBigNumber(burnAmount));

  const basketActive = tab === 'contribute';
  let error = '';
  if (basketActive && ready && amt > 0 && settled && (isMint ? !hasTokensForMint : !hasTokensForBurn)) error = 'amount is above your balance.';
  const basketQuoted = isMint ? !!mintDeposits && mintDeposits.length > 0 : !!withdrawals && withdrawals.length > 0;
  const basketSteps = isMint ? mintSteps : burnSteps;
  const valid = basketActive && ready && amt > 0 && settled && basketQuoted && !error && (basketSteps.data?.length ?? 0) > 0;
  const redeemNet = COINS.reduce((t, c) => t + (withdrawBy.get(c.asset.address.toLowerCase()) ?? 0), 0);
  const depositTotal = COINS.reduce((t, c) => t + (depositBy.get(c.asset.address.toLowerCase()) ?? 0), 0);
  const networkCost = isSwap ? swapQuote.data?.networkCost : isMint ? mintSim.data?.networkCost : burnSim.data?.networkCost;
  const approvalsNeeded = (isMint ? mintSteps.data : undefined)?.filter((x) => x.type === 'approve').length ?? 0;

  /* ---------- review summary ---------- */
  const summary = isSwap
    ? { title: 'review your swap.', in: `${f2(amt)} ${inT}`, out: `≈ ${f2(swapOut ?? 0)} ${outT}` }
    : isMint
      ? { title: 'review your mint.', in: `${f2(depositTotal)} across the basket`, out: `${f2(amt)} DFiUSD` }
      : { title: 'review your redemption.', in: `${f2(amt)} DFiUSD`, out: `≈ ${f2(redeemNet)} across the basket` };
  const activeSteps = (isSwap ? swapSteps.data : isMint ? mintSteps.data : burnSteps.data) as Step[] | undefined;

  const reset = () => {
    setStep('amount');
    setAmount('');
    setToast(null);
    setDone(null);
    runner.reset();
  };
  const runner = useStepRunner(signer.data ?? undefined, () => {
    setDone({
      at: Date.now(),
      title: isSwap ? 'swap confirmed.' : isMint ? 'mint confirmed.' : 'redemption confirmed.',
      sumIn: summary.in,
      sumOut: summary.out,
      inLabel: isSwap ? 'you paid' : isMint ? 'you added' : 'you redeemed',
    });
    setStep('done');
    showToast({ color: 'var(--ok)', text: isSwap ? 'swap confirmed.' : isMint ? 'mint confirmed.' : 'redemption confirmed.', word: 'CONFIRMED' }, 5000);
  });
  const confirm = () => runner.start(activeSteps);
  const rejected = runner.error != null && isRejection(runner.error);
  const failed = runner.error != null && !rejected;

  /* ---------- amount input ---------- */
  const onAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9.]/g, '');
    const i = v.indexOf('.');
    if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, '').slice(0, 2);
    setAmount(v);
  };
  const fill = (n: number) => setAmount(down2(Math.max(0, n)).toFixed(2));
  const clear = () => setAmount('');
  const goTab = (t: Tab) => { setTab(t); clear(); };
  const goDir = (d: 'mint' | 'redeem') => { setDir(d); clear(); };

  /* ---------- connecting: the client's ConnectKit window lists every wallet, as in the old app ---------- */
  const openWalletList = () => openConnectKit(true);

  const inputStyle = (bad: boolean) => ({ borderColor: bad ? 'var(--crit)' : focus ? 'var(--fg)' : 'var(--strong)', boxShadow: focus ? '0 0 0 3px var(--bg), 0 0 0 5px var(--signal)' : 'none' });
  const amountInput = (bad: boolean, label: string) => (
    <input id="amount" aria-label={label} value={amount} onChange={onAmount} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      inputMode="decimal" autoComplete="off" placeholder="0.00" aria-invalid={bad} aria-describedby={bad ? 'amount-err' : undefined} />
  );
  // Balance line: clicking the balance fills it in; an error sits right beside it.
  const balLine = (text: string, n: number, err: string) => (
    <div className={s.balRow}>
      <span className={s.balLeft}>
        <button type="button" className={s.balBtn} onClick={() => fill(n)} disabled={!ready}>{text}</button>
        {err && <span id="amount-err" role="alert" className={s.balErr}>{err}</span>}
      </span>
      <button type="button" className={s.max} onClick={() => fill(n)} disabled={!ready}>max</button>
    </div>
  );
  const MixList = () => (
    <div className={s.boxMix}>
      {COINS.map((c, i) => {
        const key = c.asset.address.toLowerCase();
        const dep = depositBy.get(key) ?? 0;
        const low = isMint && ready && dep > balOf(c.asset);
        const val = isMint ? f2(dep) : f2(withdrawBy.get(key) ?? 0);
        const quoted = amt > 0 && settled && basketQuoted;
        return (
          <div key={c.t} className={s.mixRow}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="sw" style={{ background: c.color }} />{c.t}
              <span style={{ fontSize: 12 }} className="dim">{isMint ? `balance ${ready ? f2(down2(balOf(c.asset))) : '—'}` : reading.coins[i].current.toFixed(1) + '%'}</span>
            </span>
            <span style={{ fontWeight: 600, color: low ? 'var(--crit)' : quoted ? 'var(--fg)' : 'var(--dim)' }}>{quoted ? val : '0.00'}</span>
          </div>
        );
      })}
    </div>
  );
  const stepsList = (list: Step[] | undefined) => {
    if (!list?.length) return '—';
    if (!runner.steps) return list.map((x) => STEP_LABELS[x.type] ?? x.type).join(' + ');
    return runner.steps
      .map((x, i) => `${i < runner.idx ? '✓ ' : i === runner.idx && runner.busy && runner.error == null ? '… ' : ''}${STEP_LABELS[x.type] ?? x.type}`)
      .join(' + ');
  };

  return (
    <div className={`dfi-app ${s.page}`}>
      <nav aria-label="app" className={s.nav}>
        <div className={`wrap ${s.navIn}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href={SITE} aria-label="DiversiFi home" className={s.logo}><Wordmark /></a>
            <div className={s.navLinks}>
              <span aria-current="page" className={s.current}>app</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className={s.net} style={wrongNet ? { color: 'var(--warn)', borderColor: 'var(--warn)' } : undefined}>{wrongNet ? 'WRONG NETWORK' : 'ETHEREUM'}</span>
            <button
              type="button"
              className={connected ? s.walletOn : `btn btn-primary btn-nav ${s.walletOff}`}
              onClick={() => (connected ? (disconnect(), reset()) : openWalletList())}
              aria-label={connected ? `connected as ${address}. disconnect` : undefined}
            >{connected ? short(address) : 'connect wallet'}</button>
          </div>
        </div>
      </nav>

      <main className={s.main}>
        <h1 className="sr-only">swap, mint and redeem DFiUSD</h1>
        <section aria-label="swap, mint and redeem" className={s.flow}>
          {view === 'connect' && (
            <div className={s.connect}>
              <Mark size={72} />
              <p className="h3" style={{ maxWidth: '18em' }}>connect a wallet to swap, mint or redeem DFiUSD.</p>
              <button type="button" className={`btn btn-primary ${s.b52} ${s.connectButton}`} onClick={openWalletList}>connect wallet</button>
              <p className="foot">Ethereum mainnet only. Connecting doesn&apos;t move any funds.</p>
            </div>
          )}

          {view === 'wrong-network' && (
            <div className={s.col} style={{ flex: 1 }}>
              <div className="rail"><span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warn)' }}><i className="dot" style={{ background: 'var(--warn)' }} />WRONG NETWORK</span><span>{short(address)}</span></div>
              <p className="h3">your wallet is on another network.</p>
              <p className="dim pretty">DFiUSD and the reserve contract are on Ethereum mainnet. Switch networks in your wallet to continue.</p>
              <dl className={s.dl}>
                <div><dt>wallet network</dt><dd className="mono" style={{ color: 'var(--warn)' }}>{CHAIN_NAMES[chainId ?? 0] ?? `chain ${chainId}`}</dd></div>
                <div><dt>required</dt><dd className="mono">{CHAIN_NAMES[APP_CHAIN_ID] ?? `chain ${APP_CHAIN_ID}`}</dd></div>
              </dl>
              <div className={s.btnRow}>
                <button type="button" className={`btn btn-secondary ${s.b52}`} style={{ flex: 1 }} onClick={() => disconnect()}>disconnect</button>
                <button type="button" className={`btn btn-primary ${s.b52}`} style={{ flex: 2 }} onClick={() => switchChain({ chainId: APP_CHAIN_ID })}>switch to Ethereum</button>
              </div>
            </div>
          )}

          {view === 'amount' && (
            <div className={s.col}>
              <div role="tablist" aria-label="mode" className={s.tabs}>
                <button type="button" role="tab" aria-selected={tab === 'swap'} className={tab === 'swap' ? s.tabOn : undefined} onClick={() => goTab('swap')}>swap</button>
                <button type="button" role="tab" aria-selected={tab === 'contribute'} className={tab === 'contribute' ? s.tabOn : undefined} onClick={() => goTab('contribute')}>mint &amp; redeem</button>
              </div>

              {/* ---------- SWAP: one coin in or out at market, like a DEX ---------- */}
              {tab === 'swap' && (
                <>
                  <p className={s.lead}>Trade one coin for DFiUSD, or back, in one step, through the DFiUSD pools on Uniswap.</p>
                  <div className={s.pair}>
                    <div className={s.box} style={inputStyle(!!swapErr)}>
                      <label htmlFor="amount" className={s.flabel}>you pay</label>
                      <div className={s.boxRow}>
                        {amountInput(!!swapErr, 'you pay')}
                        {side === 'buy'
                          ? <CoinPick id="swapcoin" label="pay with" value={String(sIdx)} onChange={(v) => setSwapIdx(Number(v))} options={COINS.map((c, i) => ({ value: String(i), label: c.t, color: c.color, note: ready ? f2(down2(balOf(c.asset))) : '' }))} />
                          : <DfiTag />}
                      </div>
                      {balLine(`balance ${ready ? f2(down2(swapPayBal)) : '—'} ${inT}`, swapPayBal, swapErr)}
                    </div>

                    <button type="button" className={s.flip} aria-label="switch what you pay and what you receive" onClick={() => { setSide(side === 'buy' ? 'sell' : 'buy'); clear(); }}>
                      <FlipIcon />
                    </button>

                    <div className={`${s.box} ${s.boxOut}`}>
                      <span className={s.flabel}>you receive</span>
                      <div className={s.boxRow}>
                        <span className={s.quoteAmt} style={{ color: swapOut !== null ? 'var(--fg)' : 'var(--strong)' }}>{swapOut !== null ? f2(swapOut) : amt > 0 && !swapErr ? '…' : '0.00'}</span>
                        {side === 'sell'
                          ? <CoinPick id="swapcoin" label="receive" value={String(sIdx)} onChange={(v) => setSwapIdx(Number(v))} options={COINS.map((c, i) => ({ value: String(i), label: c.t, color: c.color }))} />
                          : <DfiTag />}
                      </div>
                    </div>
                  </div>

                  <dl className={s.dl} style={{ fontSize: 14 }}>
                    <div><dt>rate</dt><dd className="mono">{rateText}</dd></div>
                    <div><dt>fee</dt><dd className="mono">{swapQuote.data && swapOut !== null ? `$${swapQuote.data.fee} · 0.01% Uniswap pool fee` : '0.01% Uniswap pool fee'}</dd></div>
                    <div><dt>network cost (est.)</dt><dd className="mono">{swapOut !== null && networkCost ? `$${networkCost}` : '—'}</dd></div>
                  </dl>

                  <button type="button" className={`btn btn-primary ${s.b52}`} disabled={!swapValid} onClick={() => { if (swapValid) { setSwapIdx(sIdx); setStep('review'); } }}>review swap</button>
                  <div className={s.alts}>
                    <button type="button" className={s.advLink} onClick={() => goTab('contribute')}>or mint &amp; redeem with the reserve directly →</button>
                  </div>
                </>
              )}

              {/* ---------- MINT & REDEEM: the full basket, laid out like swap ---------- */}
              {tab === 'contribute' && (
                <>
                  <p className={s.lead}>{isMint ? 'Deposit every basket coin at the target split, and get DFiUSD 1:1.' : 'Give DFiUSD and receive the current mix of every basket coin.'}</p>
                  <div className={s.pair}>
                    <div className={s.box} style={inputStyle(!!error)}>
                      <label htmlFor="amount" className={s.flabel}>{isMint ? 'you add (value in DFiUSD)' : 'you give'}</label>
                      <div className={s.boxRow}>
                        {amountInput(!!error, isMint ? 'value to add' : 'you give')}
                        {isMint ? <BasketTag /> : <DfiTag />}
                      </div>
                      {isMint
                        ? balLine(`you can mint up to ${ready ? f2(maxMint) : '—'}`, maxMint, error)
                        : balLine(`balance ${ready ? f2(down2(dfiNum)) : '—'} DFiUSD`, dfiNum, error)}
                      {isMint && <MixList />}
                    </div>

                    <button type="button" className={s.flip} aria-label={dir === 'mint' ? 'switch to redeem' : 'switch to mint'} onClick={() => goDir(dir === 'mint' ? 'redeem' : 'mint')}>
                      <FlipIcon />
                    </button>

                    <div className={`${s.box} ${s.boxOut}`}>
                      <span className={s.flabel}>{isMint ? 'you get' : 'you receive'}</span>
                      <div className={s.boxRow}>
                        <span className={s.quoteAmt} style={{ color: valid ? 'var(--fg)' : 'var(--strong)' }}>{valid ? f2(isMint ? amt : redeemNet) : '0.00'}</span>
                        {isMint ? <DfiTag /> : <BasketTag />}
                      </div>
                      {!isMint && <MixList />}
                    </div>
                  </div>

                  <dl className={s.dl} style={{ fontSize: 14 }}>
                    <div><dt>network cost (est.)</dt><dd className="mono">{valid && networkCost ? `$${networkCost}` : '—'}</dd></div>
                    {isMint && <div><dt>approvals</dt><dd className="mono">{valid ? (approvalsNeeded ? `${approvalsNeeded} of ${COINS.length} coins` : 'none needed') : '—'}</dd></div>}
                  </dl>
                  <button type="button" className={`btn btn-primary ${s.b52}`} disabled={!valid} onClick={() => valid && setStep('review')}>review {isMint ? 'mint' : 'redeem'}</button>
                </>
              )}
            </div>
          )}

          {view === 'review' && (
            <div className={s.col}>
              <div className="rail"><span>REVIEW · {isSwap ? 'SWAP' : isMint ? 'MINT' : 'REDEEM'}</span><span>STEP 2 OF 2</span></div>
              <p className="h3">{summary.title}</p>
              <dl className={s.dl}>
                <div><dt>{isSwap ? 'you pay' : isMint ? 'you deposit' : 'you redeem'}</dt><dd className="mono" style={{ fontWeight: 600 }}>{summary.in}</dd></div>
                <div><dt>you receive</dt><dd className="mono" style={{ fontWeight: 600 }}>{summary.out}</dd></div>
                {isSwap && <div><dt>fee</dt><dd className="mono">{swapQuote.data ? `$${swapQuote.data.fee} · 0.01% Uniswap pool fee` : '0.01% Uniswap pool fee'}</dd></div>}
                <div><dt>network cost (est.)</dt><dd className="mono">{networkCost ? `$${networkCost}` : '—'}</dd></div>
                <div><dt>wallet requests</dt><dd className="mono">{stepsList(activeSteps)}</dd></div>
              </dl>
              {isRedeem && (
                <div className={s.mix}>
                  {COINS.map((c) => (
                    <div key={c.t} className={s.mixRow}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><i className="sw" style={{ background: c.color }} />{c.t}</span>
                      <span style={{ fontWeight: 600 }}>{f2(withdrawBy.get(c.asset.address.toLowerCase()) ?? 0)}</span>
                    </div>
                  ))}
                </div>
              )}
              {rejected && <p role="alert" className="small" style={{ color: 'var(--crit)' }}>you rejected the request in your wallet. nothing was sent.</p>}
              {failed && <p role="alert" className="small" style={{ color: 'var(--crit)' }}>that step didn’t go through. you can try it again.</p>}
              <p className="foot">{isSwap ? 'Swaps run through the DFiUSD pools on Uniswap.' : 'Amounts are worked out from the reserve contract.'} Your wallet will ask you to confirm each request.</p>
              <div className={s.btnRow}>
                <button type="button" className={`btn btn-secondary ${s.b52}`} style={{ flex: 1 }} disabled={runner.busy && runner.error == null} onClick={() => { setStep('amount'); runner.reset(); }}>back</button>
                <button type="button" className={`btn btn-primary ${s.b52}`} style={{ flex: 2 }} disabled={runner.busy && runner.error == null} onClick={runner.error != null ? runner.retry : confirm}>
                  {runner.busy && runner.error == null ? 'waiting…' : runner.error != null ? 'try again' : 'confirm'}
                </button>
              </div>
            </div>
          )}

          {view === 'done' && done && (
            <div className={s.col} style={{ flex: 1 }}>
              <div className="rail"><span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ok)' }}><i className="dot" style={{ background: 'var(--ok)' }} />CONFIRMED</span><span>{hhmm(done.at)} UTC</span></div>
              <p style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.08, letterSpacing: '-0.03em' }}>{done.title}</p>
              <dl className={s.dl}>
                <div><dt>{done.inLabel}</dt><dd className="mono">{done.sumIn}</dd></div>
                <div><dt>you received</dt><dd className="mono" style={{ fontWeight: 600 }}>{done.sumOut}</dd></div>
                <div><dt>transactions</dt><dd><a href={`${ETHERSCAN}/address/${address}`} target="_blank" rel="noopener" className="mono" style={{ fontSize: 14 }}>{short(address)} · etherscan ↗</a></dd></div>
              </dl>
              <div className={s.btnRow}>
                <a href={`${SITE}/#reserve`} className={`btn btn-secondary ${s.b52}`} style={{ flex: 1 }}>check the reserve</a>
                <button type="button" className={`btn btn-primary ${s.b52}`} style={{ flex: 1 }} onClick={reset}>done</button>
              </div>
            </div>
          )}
        </section>

        <aside aria-label="backing" className={s.aside}>
          <div className="rail"><span>BACKING</span><span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg)' }}><span className="livedot" />LIVE · {hhmm(reading.readAt)} UTC</span></div>
          <p style={{ fontSize: 'clamp(20px, 2vw, 24px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>every DFiUSD is backed by the whole basket.</p>
          <ReserveBar reading={reading} mode={mode} size="md" readout showTotal={false} status />
          <a href={`${SITE}/#reserve`} style={{ fontSize: 15 }}>check the reserve →</a>
        </aside>
      </main>

      {toast_ && (
        <div role="status" className={s.toast}>
          <i className="dot" style={{ background: toast_.color }} />
          <span>{toast_.text}</span>
          <span className={s.toastWord} style={{ color: toast_.color }}>{toast_.word}</span>
        </div>
      )}

      <footer className={s.footer}>
        <div className={`wrap ${s.footIn}`}>
          <p style={{ maxWidth: '64em' }}>
            {FOOTNOTE}{' '}
            <a href={TermsRoutes.GeneralTerms} target="_blank" rel="noopener noreferrer">General Terms</a>{' · '}
            <a href={TermsRoutes.DFiUSDTerms} target="_blank" rel="noopener noreferrer">DFiUSD Terms</a>{' · '}
            <a href={TermsRoutes.DFiUSDMintUserTerms} target="_blank" rel="noopener noreferrer">Mint User Agreement</a>
          </p>
          <span className="mono">proof, not promises.</span>
        </div>
      </footer>
    </div>
  );
}
