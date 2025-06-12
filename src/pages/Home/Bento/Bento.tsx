import { cn } from '@/lib/tw';

import styles from './bento.module.scss';

export function BentoSection() {
  const a = (
    <div className={cn(styles.section, styles.a)}>
      <h2>Introducing DFiUSD</h2>
      <p>
        DFiUSD is a new type of stablecoin, backed 1:1 by a diverse pool of USD stablecoins. 
        It is designed to be a long-term, sustainable alternative to the wide array of USD stablecoins currently on the market.
      </p>
    </div>
  );

  const b = (
    <div className={cn(styles.section, styles.b)}>
      <h2>Risk Mitigation</h2>
      <p>
        Simple diversification protects users from total loss caused by any individual depeg.
        The protocol prioritizes risk mitigation above all else when selecting underlying asset allocations.
      </p>
    </div>
  );

  const c = (
    <div className={cn(styles.section, styles.c)}>
      <h2>Simplification</h2>
      <p>
        The stablecoin market is extremely complex and constantly evolving. 
        Users shouldn't need industry-level knowledge in finance and technology to gain safe exposure to USD. 
        DiversiFi handles the task of curating a risk-adjusted stablecoin portfolio, so users don't have to.
      </p>
    </div>
  );

  const d = (
    <div className={cn(styles.section, styles.d)}>
      <h2>Additional Security</h2>
      <p>
        All protocol revenue goes directly into an insurance fund, to be used for bailing out bad assets if the need arises.
        Governance can only access revenue once the insurance fund is fully capitalized.
      </p>
    </div>
  );

  const e = (
    <div className={cn(styles.section, styles.e)}>
      <h2>Non-Custodial</h2>
      <p>
        No central administrator can access underlying funds or mint uncollateralized tokens.
      </p>
    </div>
  );

  const f = (
    <div className={cn(styles.section, styles.f)}>
      <h2>Community Driven</h2>
      <p>
        Through DiversiFi governance, the community curates DFiUSD's underlying portfolio, giving users peace of mind for long-term stability.
      </p>
    </div>
  );

  const g = (
    <div className={cn(styles.section, styles.g)}>
      <h2>Seamless Disaster Recovery</h2>
      <p>
        In a worst-case disaster scenario, a simple rebasement mechanism enables our token to recover from depegs without requiring a token migration.
        Users can set it and forget it for extended timescales, with no need for external interaction—even in the worst possible scenario.
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
