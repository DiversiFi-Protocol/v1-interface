import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function FormInput({
  token,
  onChange,
  onClick,
  value,
}: {
  token: string;
  onChange: (value: string) => void;
  onClick: () => void;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-input rounded-md p-4">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          value={value}
          type="number"
          inputMode="decimal"
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-2xl focus-visible:outline-none min-w-0"
        />
        <Button onClick={onClick}>
          <AssetIcon asset={token} />
          {token}
        </Button>
      </div>

      <div className="flex flex-row justify-between text-sm text-muted-foreground">
        <span>$0.00</span>
        <span className="flex flex-row items-center gap-2">
          0.00 <Wallet className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}
