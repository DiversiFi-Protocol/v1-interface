import { cn } from '@/lib/tw';

const loadingStyle =
  'aspect-[4] animate-loading-dots bg-[radial-gradient(circle_closest-side_at_left_6px_top_50%,currentColor_90%,#0000),radial-gradient(circle_closest-side,currentColor_90%,#0000),radial-gradient(circle_closest-side_at_right_6px_top_50%,currentColor_90%,#0000)] bg-[length:100%_100%] bg-no-repeat';

export default function LoadingDots({ size = 60 }: { size?: number }) {
  return (
    <div
      className={cn(
        loadingStyle,
        `w-[${size}px] [--loading-dots-width-0:${size}px] [--loading-dots-width-1:${size / 2.4}px]`
      )}
    />
  );
}
