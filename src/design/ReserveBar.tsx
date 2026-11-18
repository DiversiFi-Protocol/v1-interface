// The live reserve bar from diversifi.tech (web/components/ReserveBar.tsx). Same look and behaviour; the numbers
// come from the client's read-only hooks (usePoolReserves, useAssets) instead of our own chain reads.
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAllAssetScaledReserves, useGetTotalScaledReserves } from '@/hooks/BackingPool/usePoolReserves';
import { useGetAssetParamsForAllAssets } from '@/hooks/BackingPool/useAssets';
import { SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import s from './ReserveBar.module.css';
import { COINS, coinUrl, fmtK, hhmm, largestRemainder } from './coins';

export type ReserveMode = 'loading' | 'live' | 'unavailable';
export type ReserveReading = {
  coins: { t: string; held: number; target: number; current: number }[];
  total: number;
  readAt: number;
};

/** Per-coin held dollars, current and target shares (one decimal, totalling 100), in brand order. */
export function useReserveReading(): { reading: ReserveReading; mode: ReserveMode } {
  const { scaledReserves, isError } = useAllAssetScaledReserves();
  const { totalScaledReserves } = useGetTotalScaledReserves();
  const params = useGetAssetParamsForAllAssets();
  const [readAt, setReadAt] = useState(() => Date.now());
  useEffect(() => setReadAt(Date.now()), [scaledReserves, totalScaledReserves]);

  return useMemo(() => {
    const heldBy = new Map((scaledReserves ?? []).map((r) => [r.address.toLowerCase(), Number(r.amount) || 0]));
    const targetBy = new Map(
      SUPPORTED_RESERVE_ASSETS.map((a, i) => [a.address.toLowerCase(), params.data?.[i]?.targetAllocation ?? 0])
    );
    const held = COINS.map((c) => heldBy.get(c.asset.address.toLowerCase()) ?? 0);
    const current = largestRemainder(held);
    const target = largestRemainder(COINS.map((c) => targetBy.get(c.asset.address.toLowerCase()) ?? 0));
    const loaded = !!scaledReserves && held.some((h) => h > 0);
    return {
      reading: {
        coins: COINS.map((c, i) => ({ t: c.t, held: held[i], target: target[i], current: loaded ? current[i] : c.s })),
        total: Number(totalScaledReserves) || held.reduce((a, b) => a + b, 0),
        readAt,
      },
      mode: loaded ? 'live' : isError ? 'unavailable' : 'loading',
    };
  }, [scaledReserves, totalScaledReserves, params.data, isError, readAt]);
}

type Props = {
  reading: ReserveReading;
  mode: ReserveMode;
  size?: 'lg' | 'md' | 'sm';
  readout?: boolean;
  showTotal?: boolean;
  animate?: boolean;
  /** Default readout shows whether the basket is on target and how many issuers and coins back it. */
  status?: boolean;
};

const BAR_H = { lg: 72, md: 40, sm: 12 };

export function ReserveBar({ reading, mode, size = 'md', readout = false, showTotal = true, animate = true, status = false }: Props) {
  const loading = mode === 'loading';
  const root = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(560);
  const [p, setP] = useState(animate ? 0 : 1);
  const [shown, setShown] = useState(!animate);
  const [settled, setSettled] = useState(!animate);
  const [hover, setHover] = useState(-1);
  const touch = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Settle once on entering the viewport: scaleX 0→1 (overshoot), shares count up (ease-out quart).
  const started = useRef(false);
  const timers = useRef({ raf: 0, done: 0 });
  useEffect(
    () => () => {
      cancelAnimationFrame(timers.current.raf);
      clearTimeout(timers.current.done);
    },
    []
  );
  useEffect(() => {
    if (!animate || started.current || loading) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = () => {
      started.current = true;
      setShown(true);
      if (reduce) {
        setP(1);
        setSettled(true);
        return;
      }
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1600);
        setP(1 - Math.pow(1 - k, 4));
        if (k < 1) timers.current.raf = requestAnimationFrame(step);
      };
      timers.current.raf = requestAnimationFrame(step);
      timers.current.done = window.setTimeout(() => setSettled(true), 2600);
    };
    const el = root.current!;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          io.disconnect();
          go();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate, loading]);

  const data = reading.coins;
  const minCol = ((w - 12) * Math.min(...data.map((c) => c.current))) / 100;
  const stagger = size !== 'sm' && minCol < (size === 'lg' ? 64 : 52);
  const tickerFs = minCol < 36 ? 11 : size === 'lg' ? 13 : 12;
  const shareFs = minCol < 36 ? 13 : minCol < 48 ? 16 : size === 'lg' ? 24 : 16;
  const asOf = hhmm(reading.readAt) + ' UTC';
  // Balanced when every coin is within 0.05 percentage points of its target; issuers counted from the coin list (DAI and USDS share one).
  const balanced = data.every((c) => Math.abs(c.current - c.target) < 0.05);
  const issuers = new Set(COINS.map((c) => c.issuer)).size;

  const h = hover >= 0 && !loading ? hover : -1;
  const hc = h >= 0 ? data[h] : null;
  const rd = hc
    ? { label: hc.t, color: COINS[h].color, value: hc.current.toFixed(1) + '%', scope: (showTotal ? fmtK(hc.held) + ' held · ' : '') + 'target ' + hc.target.toFixed(1) + '% · as of ' + asOf }
    : status
      ? { label: 'RESERVE STATUS', color: '', value: loading ? '—' : balanced ? 'balanced' : 'off target', scope: loading ? 'reading the reserve contract' : `${issuers} issuers · ${data.length} coins · as of ${asOf}` }
      : { label: 'RESERVE', color: '', value: loading ? '—' : showTotal ? fmtK(reading.total) : 'multi-issuer', scope: loading ? 'reading the reserve contract' : (showTotal ? 'every basket coin' : 'no single issuer') + ' · as of ' + asOf };

  const onSegClick = (i: number) => (e: React.MouseEvent) => {
    // Touch: first tap shows the readout, second follows the link.
    if (touch.current && hover !== i) {
      e.preventDefault();
      setHover(i);
    }
  };

  return (
    <div
      ref={root}
      className={s.root}
      style={{ opacity: mode === 'unavailable' ? 0.35 : 1 }}
      onMouseLeave={() => setHover(-1)}
      onPointerDown={(e) => {
        touch.current = e.pointerType === 'touch';
      }}
    >
      {size !== 'sm' && (
        <div aria-hidden="true" className="ruler" style={{ marginBottom: 10 }}>
          {Array.from({ length: 21 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      )}
      <div className={s.bar} style={{ height: BAR_H[size], transform: shown || loading ? 'scaleX(1)' : 'scaleX(0)' }}>
        {COINS.map((c, i) => (
          <a
            key={c.t}
            href={coinUrl(c)}
            target="_blank"
            rel="noopener"
            aria-label={`${c.t}, ${data[i].current.toFixed(1)} percent of the reserve. Opens its balance on Etherscan.`}
            onMouseEnter={() => !loading && setHover(i)}
            onFocus={() => !loading && setHover(i)}
            onBlur={() => setHover(-1)}
            onClick={onSegClick(i)}
            className={s.seg}
            style={{ flex: `${data[i].current} 1 0px`, background: loading ? 'var(--line)' : c.color, opacity: h >= 0 && h !== i ? 0.28 : 1 }}
          />
        ))}
      </div>
      {size !== 'sm' && (
        <div className={s.labels} aria-hidden="true">
          {COINS.map((c, i) => (
            <div
              key={c.t}
              onMouseEnter={() => !loading && setHover(i)}
              className={s.col}
              style={{
                flex: `${data[i].current} 1 0px`,
                opacity: !shown && !loading ? 0 : h >= 0 && h !== i ? 0.35 : 1,
                transitionDelay: settled ? '0ms' : 500 + i * 110 + 'ms',
              }}
            >
              <i className={s.stem} style={{ height: stagger && i % 2 ? 44 : 14 }} />
              <div className={s.lab} style={{ alignSelf: stagger && i === COINS.length - 1 ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: tickerFs }} className={s.ticker}>
                  {c.t}
                </span>
                <span style={{ fontSize: shareFs }} className={loading ? `${s.share} skel` : s.share}>
                  {loading ? '00.0%' : (data[i].current * (shown ? p : 1)).toFixed(1) + '%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {readout && mode !== 'unavailable' && (
        <div className={s.readout} aria-live="polite">
          <span className={s.rdLabel}>
            {rd.color && <i className="sw" style={{ background: rd.color }} />}
            {rd.label}
          </span>
          <span className={s.rdValue}>{rd.value}</span>
          <span className={s.rdScope}>{rd.scope}</span>
        </div>
      )}
    </div>
  );
}
