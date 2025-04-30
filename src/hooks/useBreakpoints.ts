import { useMemo } from 'react';

import { create } from '@kodingdotninja/use-tailwind-breakpoint';

/**
 * @description Use breakpoints to determine the current screen size
 * @url https://tailwindcss.com/docs/responsive-design#working-mobile-first
 */
export const { useBreakpoint, useBreakpointValue } = create({
  none: '0rem',
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
});

export const useBreakpoints = () => {
  const smallBreakpoint = useBreakpointValue('sm', 'tablet', 'mobile');
  const lgBreakpoint = useBreakpointValue('lg', 'desktop', 'tablet');

  return useMemo(
    () => ({
      isMobile: smallBreakpoint === 'mobile' || lgBreakpoint === 'tablet',
      isTablet: lgBreakpoint === 'tablet',
      isDesktop: lgBreakpoint === 'desktop',
    }),
    [smallBreakpoint, lgBreakpoint]
  );
};
