import { useCallback } from 'react';

import { CheckedState } from '@radix-ui/react-checkbox';
import { AlertTriangle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useAppDispatch, useAppSelector } from '@/state/appTypes';
import { setAllowMaxApproval } from '@/state/formSettings';
import { selectShouldAllowMaxApprovals } from '@/state/formSettingsSelector';

import { cn } from '@/lib/tw';

const popoverRotateSvg = '[&[data-state=open]_svg]:rotate-90 [&_svg]:transition-transform';

export function FormSettingsPopover({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const allowMaxApproval = useAppSelector(selectShouldAllowMaxApprovals);

  const onToggleMaxApproval = useCallback(
    (checked: CheckedState) => {
      if (checked === 'indeterminate') return;
      dispatch(setAllowMaxApproval(checked));
    },
    [dispatch]
  );

  const maxApprovalRow = (
    <div className="row gap-1">
      <Checkbox
        id="max-approvals"
        checked={allowMaxApproval}
        onCheckedChange={onToggleMaxApproval}
      />
      <label htmlFor="max-approvals">Allow max token approvals</label>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-fit p-0">
            <AlertTriangle className="size-3 text-yellow-500" />
          </TooltipTrigger>

          <TooltipContent className="max-w-[300px]">
            <p>
              Allowing max token approval will prevent the need for future approve calls. You can
              update your past approvals{' '}
              <Link className="text-accent" to={PageRoutes.Allowance}>
                here
              </Link>
              .
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn(popoverRotateSvg, className)} variant="ghost">
          <Settings />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border border-solid border-accent px-4 py-2 w-fit text-xs">
        {maxApprovalRow}
      </PopoverContent>
    </Popover>
  );
}
