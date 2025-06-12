import { cn } from '@/lib/tw';

import styles from './bento.module.scss';

export function BentoSection() {
  const a = (
    <div className={cn(styles.section, styles.a)}>
      <h2>Introducing DFiUSD</h2>
      <p>
        DFiUSD is a new type of stablecoin backed by a diverse basket of USD stablecoins. It is designed
        to be a long-term, sustainable substitute for the wild selection of USD stablecoins on the market.
      </p>
    </div>
  );

  const b = (
    <div className={cn(styles.section, styles.b)}>
      <h2>Risk Mitigation</h2>
      <p>
        Simple Diversification protects users from total loss via any individual depeg.
        Governance is incentivized to prioritize risk mitigation above all else via a system of
        rewards and punishments for selecting good and bad assets.
      </p>
    </div>
  );

  const c = (
    <div className={cn(styles.section, styles.c)}>
      <h2>Simplification</h2>
      <p>
        The stablecoin market is extremely complicated and constantly changing. Users should not need industry level knowledge in finance and technology
        to get safe exposure to USD. DiversiFi takes on this job of curating a risk adjusted stablecoin portfolio on the user's behalf.
      </p>
    </div>
  );

  const d = (
    <div className={cn(styles.section, styles.d)}>
      <h2>Additional Security</h2>
      <p>
        All future protocol revenue goes directly into an insurance fund for bailing out bad assets.
        Governance can only tap into fee revenue if insurance is fully funded.
      </p>
    </div>
  );

  const e = (
    <div className={cn(styles.section, styles.e)}>
      <h2>Non-Custodial</h2>
      <p>
        No central administrator can access any underlying funds, or mint
        uncollateralized tokens.
      </p>
    </div>
  );

  const f = (
    <div className={cn(styles.section, styles.f)}>
      <h2>Community Driven</h2>
      <p>
        With DiversiFi governance, the community curates DFiUSD's underlying portfolio, giving users peace of mind for long term stability.
      </p>
    </div>
  );

  const g = (
    <div className={cn(styles.section, styles.g)}>
      <h2>Seamless Disaster Recovery</h2>
      <p>
        In a worst case disaster scenario, a simple rebasement mechanism allows our token to recover from depegs without a token contract migration.
        Users can simply set it and forget it for very long timescales with no need for outside interaction - even in the worst possible scenario.
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
