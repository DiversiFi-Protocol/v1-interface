import { Wallet } from 'lucide-react';

import { SupportedAsset } from '@/constants/tokens';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/tw';

import TokenSelectDialog from './TokenSelectDialog';

export default function FormInput({
  className,
  label,
  token,
  disabled,
  onChange,
  onSelectToken,
  value,
  balance,
}: {
  className?: string;
  disabled?: boolean;
  label?: string;
  token: string;
  onChange: (value: string) => void;
  onSelectToken?: (token: SupportedAsset) => void;
  value: string;
  balance?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 bg-input rounded-xl px-4 py-2',
        disabled && 'cursor-not-allowed [&>*]:cursor-not-allowed [&_input]:cursor-not-allowed',
        className
      )}
    >
      <label className="text-md text-foreground">{label}</label>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={value}
          disabled={disabled}
          type="number"
          inputMode="decimal"
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-2xl focus-visible:outline-none min-w-0"
        />

        {onSelectToken ? (
          <TokenSelectDialog onSelectToken={onSelectToken}>
            <Button className="rounded-3xl" variant="outline">
              <AssetIcon
                className="border-background border-solid [border-width:1px]"
                asset={token}
              />
              {token}
            </Button>
          </TokenSelectDialog>
        ) : (
          <Button className="rounded-3xl" variant="outline">
            <AssetIcon
              className="border-background border-solid [border-width:1px]"
              asset={token}
            />
            {token}
          </Button>
        )}
      </div>

      <div className="flex flex-row justify-end text-sm text-muted-foreground">
        <span className="flex flex-row items-center gap-2">
          {balance ?? '0.00'} <Wallet className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
