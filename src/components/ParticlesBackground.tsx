import { Particles } from '@tsparticles/react';

export default function ParticlesBackground({ particlesReady }: { particlesReady: boolean }) {
  if (!particlesReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 120,
        particles: {
          color: { value: '#666' },
          links: {
            color: '#666',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            direction: 'none',
            outModes: { default: 'bounce' },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: { enable: true },
            value: 80,
          },
          opacity: { value: 0.2 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}
