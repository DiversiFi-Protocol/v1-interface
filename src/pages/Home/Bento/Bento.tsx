import { cn } from '@/lib/tw';

import styles from './bento.module.scss';

export function BentoSection() {
  const a = (
    <div className={cn(styles.section, styles.a)}>
      <h2>Introducing DFiUSD</h2>
      <p>
        DFiUSD is a stablecoin that is backed by a basket of USD stablecoins. It is designed
        to be a long-term, sustainable substitute for the wild selection of USD stablecoins on the market.
      </p>
    </div>
  );

  const b = (
    <div className={cn(styles.section, styles.b)}>
      <h2>Community Driven</h2>
      <p>
        With DiversiFi governance, the community can create a portfolio of like kind
        assets, giving users peace of mind for long term stability.
      </p>
    </div>
  );

  const c = (
    <div className={cn(styles.section, styles.c)}>
      <h2>Risk Mitigation</h2>
      <p>
        Governance is incentivized to prioritize risk mitigation above all else via a system of
        rewards and punishments for selecting good and bad assets.
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
      <h2>Seamless Disaster Recovery</h2>
      <p>
        A simple rebasement mechanism allows our token to recover from depegs without a token contract migration.
        Users can simply set it and forget it for very long timescales with no need for outside interaction.
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
      <h2>Perfect Equilibrium</h2>
      <p>
        DFiUSD is backed and redeemable 1:1 by all USD stablecoin assets in the pool. 
        The pool's target allocations can be updated on the fly and the pool will always trend towards it.
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
