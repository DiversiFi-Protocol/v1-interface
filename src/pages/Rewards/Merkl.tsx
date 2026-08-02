import { useAccount } from 'wagmi';

import SingleColumnLayout from '@/layouts/SingleColumnLayout';

import { useMyCampaignIds, useMyPoints } from '@/hooks/MerklHooks/useMyRewards';

import CampaignTables from './CampaignTables';

export default function MerklRewardsPage() {
  const { address } = useAccount();
  const { data: myPoints } = useMyPoints();
  const { data: myCampaignIds } = useMyCampaignIds();

  return (
    <SingleColumnLayout className="w-full" innerClassName="flexColumn gap-8 py-4">
      <div className="row gap-2">
        Diversifi Points{' '}
        <img src="/brand/diversifi-logo.png" alt="DiversiFi" className="w-8 min-w-8 h-auto" />
        {myPoints != null && (
          <span className="text-sm text-muted-foreground">{myPoints.toFixed(4)}</span>
        )}
      </div>

      {address && (
        <CampaignTables
          title="My Strategies"
          campaignIds={myCampaignIds}
          emptyMessage="You're not participating in any campaigns yet."
        />
      )}

      <CampaignTables title="All Strategies" showFilters />
    </SingleColumnLayout>
  );
}
