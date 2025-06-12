import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="sm:text-8xl text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          DiversiFi
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Tokenizing diversified portfolios of pegged assets
        </p>
        <Link to={PageRoutes.Pool}>
          <Button variant="gradient-primary">Swap Now</Button>
        </Link>
      </div>
    </section>
  );
}
