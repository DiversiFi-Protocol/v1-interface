import { Button } from '@/components/ui/button';

export default function SwapForm() {
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 border-border border-solid border-[1px]">
      <div className="text-2xl font-semibold">Swap</div>

      <div className="flex justify-end">
        <Button className="w-full">Swap</Button>
      </div>
    </div>
  );
}
