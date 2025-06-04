import { useMemo, useState } from 'react';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/tw';

interface RoadmapProps {
  currentPhase: number; // 0-based index of the current phase
}

export function RoadmapSection({ currentPhase }: RoadmapProps) {
  const { isMobile } = useBreakpoints();

  const milestones = useMemo(
    () => [
      {
        type: 'milestone',
        title: 'Phase 0',
        description: 'Testnet Launch',
      },
      {
        type: 'sub-milestone',
        description: 'Simple minting and burning of mock tokens',
      },
      {
        type: 'sub-milestone',
        description: 'Uniswap integration with arbitrage bot',
      },
      {
        type: 'sub-milestone',
        description: 'Testing a mid-flight allocation change',
      },
      {
        type: 'sub-milestone',
        description: 'Successful handling of a depeg migration exercise',
      },
      {
        type: 'milestone',
        title: 'Phase 1',
        description: 'Mainnet Launch',
      },
      {
        type: 'sub-milestone',
        description: 'Liquidity bootstrapping via Liquidity Mining',
      },
      {
        type: 'sub-milestone',
        description: 'Platform integrations (e.g. AAVE, Compound, CEXs)',
      },
      {
        type: 'milestone',
        title: 'Phase 2',
        description: 'Decentralized governance',
      },
      {
        type: 'sub-milestone',
        description: 'Staking for Protocol Insurance',
      },
      {
        type: 'sub-milestone',
        description: 'Adding new asset classes',
      },
      {
        type: 'milestone',
        title: 'Phase 3',
        description: 'Reserves Management',
      },
    ],
    []
  );

  // Calculate the gradient stop position based on current phase. Update to accept sub-milestones
  const gradientStop = useMemo(() => {
    const milestoneIndices = milestones.map((m, i) => i);
    const currentMilestoneIndex = milestoneIndices[currentPhase] ?? 0;
    return (currentMilestoneIndex / (milestones.length - 1)) * 100;
  }, [currentPhase, milestones]);

  const isExtendedIndex = (index: number) => {
    const remainder = index % 4;
    return remainder === 2 || remainder === 3;
  };

  const [viewedPhase, setViewedPhase] = useState(currentPhase);
  const label =
    viewedPhase === currentPhase
      ? 'Current'
      : viewedPhase > currentPhase
        ? 'Upcoming'
        : 'Completed';

  return (
    <section
      className={cn(
        'py-20 rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden',
        isMobile ? 'px-10' : 'px-24'
      )}
    >
      <div className="flexColumn">
        <h2 className="text-4xl font-bold text-center mb-12">Roadmap</h2>

        {/* Milestones Container */}
        <div
          className={cn('flexColumn justify-center relative', isMobile ? 'h-auto' : 'h-[360px]')}
        >
          {isMobile && (
            <div className="flexColumn justify-center relative mb-4">
              <div className="row justify-between">
                <div className="px-4 rounded-xl bg-accent w-fit">
                  <b>{label}</b>
                </div>
                <div className="row gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setViewedPhase((prev) => (prev > 0 ? prev - 1 : prev))}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      setViewedPhase((prev) => (prev < milestones.length - 1 ? prev + 1 : prev))
                    }
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </div>
              {milestones[viewedPhase].title && (
                <h4 className="text-2xl font-bold text-left">{milestones[viewedPhase].title}</h4>
              )}
              <p className="text-muted-foreground">{milestones[viewedPhase].description}</p>
            </div>
          )}
          {/* Progress Line */}
          <div className="relative h-4 bg-foreground/30 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-full"
              style={{
                width: `${gradientStop}%`,
                transition: 'width 0.5s ease-in-out',
              }}
            />
          </div>

          {/* Milestones */}
          {!isMobile && (
            <div className="relative row">
              {milestones.map((milestone, index) => {
                const isAbove = index % 2 === 0;
                const isExtended = isExtendedIndex(index);
                console.log(isExtended, index);
                const lineHeight = isExtended ? 'h-32' : 'h-16';
                const contentOffset = isExtended
                  ? isAbove
                    ? 'top-[-12rem]'
                    : 'top-[8rem]'
                  : isAbove
                    ? 'top-[-8rem]'
                    : 'top-[4rem]';

                return (
                  <div
                    key={index}
                    className="relative"
                    style={{
                      left: `${(index / (milestones.length - 1)) * 100}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Vertical Line */}
                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b',
                        isAbove ? 'from-transparent to-primary' : 'from-primary to-transparent',
                        isExtended
                          ? isAbove
                            ? 'top-[-9rem]'
                            : 'top-0'
                          : isAbove
                            ? 'top-[-5rem]'
                            : 'top-0',
                        lineHeight
                      )}
                    />

                    {/* Milestone Marker */}
                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2',
                        milestone.type === 'milestone'
                          ? 'w-6 h-6 rotate-45 bg-primary top-[-1.25rem]'
                          : 'w-4 h-4 rounded-full bg-foreground/30 top-[-1rem]'
                      )}
                    />

                    {/* Content */}
                    <div
                      className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-[200px] text-center',
                        contentOffset
                      )}
                    >
                      {milestone.type === 'milestone' ? (
                        <>
                          <h3 className="text-xl font-semibold">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">{milestone.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
