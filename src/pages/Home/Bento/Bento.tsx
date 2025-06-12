import { cn } from '@/lib/tw';

import styles from './bento.module.scss';

export function BentoSection() {
  const a = (
    <div className={cn(styles.section, styles.a)}>
      <h2>Introducing DFiUSD</h2>
      <p>
        DFiUSD is a stablecoin that is backed by a basket of USD pegged stablecoins. It is designed
        to be a long-term, sustainable token that can be used with your favorite DeFi protocols.
      </p>
    </div>
  );

  const b = (
    <div className={cn(styles.section, styles.b)}>
      <h2>Perfect Equilibrium</h2>
      <p>
        DFiUSD can be redeemed 1:1 for any underlying asset in the index, and any index asset can be
        swapped for DFiUSD at the same rate.
      </p>
    </div>
  );

  const c = (
    <div className={cn(styles.section, styles.c)}>
      <h2>Protecting Assets & Peace of Mind</h2>
      <p>
        With DiversiFi governance, the community will be able to create a portfolio of like kind
        assets, giving users peace of mind for long term stability.
      </p>
    </div>
  );

  const d = (
    <div className={cn(styles.section, styles.d)}>
      <h2>Additional Security</h2>
      <p>
        A portion of swap fees that are generated from different DiversiFi pools are added to an
        insurance fund to be used to cover any losses from a bad underlying asset.
      </p>
    </div>
  );

  const e = (
    <div className={cn(styles.section, styles.e)}>
      <h2>Low Fees</h2>
      <p>
        Our simple and efficient protocol has a low overhead enabling us to charge very low fees.
      </p>
    </div>
  );

  const f = (
    <div className={cn(styles.section, styles.f)}>
      <h2>Non-Custodial</h2>
      <p>
        There is no central administrator that can access any underlying funds, or mint
        uncollateralized tokens.
      </p>
    </div>
  );
  const g = (
    <div className={cn(styles.section, styles.g)}>
      <h2>Risk Mitigation</h2>
      <p>
        Users are hedged against the risk of a single collateral failure through simple
        diversification.
      </p>
    </div>
  );
  return (
    <section className="py-20 px-4">
      <div className={styles.dfiusd}>
        {a}
        {b}
        <img className={styles.dfiusdImage} src="/currencies/dfiusd.png" alt="DFiUSD" />
      </div>

      <div className={styles.bento}>
        {c}
        {d}
        {e}
        {f}
        {g}
      </div>
    </section>
  );
}
