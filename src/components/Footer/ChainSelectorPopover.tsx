import { useChainLocal } from '@/providers/ChainProvider';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function ChainSelectorPopover() {
  const { chain, supportedChains, switchChain } = useChainLocal();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled
          variant="outline"
          className="hover:brightness-110 h-[2rem] border-none text-xs"
        >
          {chain === 1 ? 'Mainnet' : supportedChains.find((c) => c.id === chain)?.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="border border-solid border-accent p-0 w-fit">
        <div className="flexColumn flex-col rounded-md overflow-hidden w-fit">
          {supportedChains.map((chain) => (
            <Button
              variant="popover"
              className="text-xs"
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
            >
              {chain.id === 1 ? 'Mainnet' : chain.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
