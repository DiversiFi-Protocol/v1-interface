import ParticlesBackground from '@/components/ParticlesBackground';

// import { ExplainerSection } from './Explainer';
import { FeaturesSection } from './Features';
import { HeroSection } from './Hero';
import { RoadmapSection } from './Roadmap';

export default function Home({ particlesReady }: { particlesReady: boolean }) {
  return (
    <div className="relative min-h-full bg-background">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground particlesReady={particlesReady} />
      </div>

      <div className="relative z-10 mb-10">
        <HeroSection />
        <FeaturesSection />
        {/* <ExplainerSection /> */}
        <RoadmapSection currentPhase={1} />
      </div>
    </div>
  );
}
