import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import ParticlesBackground from '@/components/ParticlesBackground';
import { Button } from '@/components/ui/button';

export default function Home({ particlesReady }: { particlesReady: boolean }) {
  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground particlesReady={particlesReady} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              USD1 Protocol
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The next generation decentralized stablecoin protocol
            </p>
            <Link to={PageRoutes.Pool}>
              <Button variant="default">Swap Now</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-background/50">
              <h3 className="text-xl font-semibold mb-4">Decentralized</h3>
              <p className="text-muted-foreground">
                Fully decentralized protocol with no central point of failure
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-background/50">
              <h3 className="text-xl font-semibold mb-4">Secure</h3>
              <p className="text-muted-foreground">
                Battle-tested smart contracts with comprehensive security measures
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-background/50">
              <h3 className="text-xl font-semibold mb-4">Efficient</h3>
              <p className="text-muted-foreground">
                Optimized for low gas fees and maximum capital efficiency
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
