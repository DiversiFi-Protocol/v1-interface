import { useChainLocal } from '@/providers/ChainProvider';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function ChainSelectorPopover() {
  const { chain, supportedChains, switchChain } = useChainLocal();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="hover:brightness-110 h-[2rem] border-none">
          {supportedChains.find((c) => c.id === chain)?.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-fit">
        <div className="flexColumn flex-col rounded-md overflow-hidden w-fit">
          {supportedChains.map((chain) => (
            <Button
              variant="popover"
              size="lg"
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
            >
              {chain.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
