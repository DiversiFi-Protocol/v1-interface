import { DollarSignIcon, LockIcon, ShieldIcon } from 'lucide-react';

const FEATURES = [
  {
    title: 'Non-Custodial',
    description:
      'There is no central administrator that can access any underlying funds, or mint uncollateralized tokens',
    icon: <LockIcon />,
  },
  {
    title: 'Risk Mitigation',
    description:
      'Users are hedged against the risk of a single collateral failure through simple diversification',
    icon: <ShieldIcon />,
  },
  {
    title: 'Low Fees',
    description:
      'Our simple and efficient protocol has a low overhead enabling us to charge very low fees',
    icon: <DollarSignIcon />,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feature) => (
          <div key="title" className="p-6 rounded-lg bg-card border border-solid border-accent">
            <h3 className="text-xl font-semibold mb-4 inline-flex items-center gap-2">
              {feature.title}
              <span className="inline">{feature.icon}</span>
            </h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
