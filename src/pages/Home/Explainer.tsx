import { useMemo } from 'react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { cn } from '@/lib/tw';

export function ExplainerSection() {
  const { isMobile } = useBreakpoints();
  const slides = useMemo(
    () => [
      {
        src: '/info-assets/defi-compatible.jpg',
        description:
          'dUSD benefits from all the offerings of DeFi, including staking, lending, and borrowing.',
      },
      {
        src: '/info-assets/one-one-redemption.png',
        description: 'dUSD is redeemable 1:1 for the reserves of the portfolio.',
      },
      {
        src: '/info-assets/asset-portfolio.png',
        description:
          'DiversiFi Governance can create a portfolio of pegged assets based on their risk profiles.',
      },
      {
        src: '/info-assets/conversion.png',
        description:
          'Users deposit tokens into the portfolio to mint dUSD with a 1:1 conversion rate.',
      },
    ],
    []
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-[100vh] mx-auto grid gap-8">
        <Carousel orientation={isMobile ? 'vertical' : 'horizontal'}>
          <CarouselPrevious />
          <CarouselContent className={cn('w-full', isMobile && 'h-[600px]')}>
            {slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className="h-[600px] max-h-[600px] flex flex-col items-center justify-center gap-4"
              >
                <img
                  src={slide.src}
                  alt={slide.description}
                  className="h-[400px] max-h-[400px]object-cover rounded-lg "
                />
                <p className="text-muted-foreground text-center text-lg">{slide.description}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
