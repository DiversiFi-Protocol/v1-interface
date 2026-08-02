import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { type Address, formatUnits } from 'viem';
import { gnosis } from 'viem/chains';
import { useAccount } from 'wagmi';

import type { RewardsResponse } from '@/constants/merkl';
import { DFI_MERKL_POINT_TOKEN } from '@/constants/tokens';

import { BIG_NUMBERS, MustBigNumber } from '@/lib/numbers';
import { MERKL_PROXY_BASE } from '@/lib/merkl';

const DEV_FALLBACK_ADDRESS = '0xC0Db3673F4699b3Cce75F7C7404CD94DeEe12767' as Address;

export function useMyRewards(overrideAddress?: Address) {
  const { address: connected } = useAccount();
  const address = overrideAddress ?? connected ?? DEV_FALLBACK_ADDRESS;

  return useQuery({
    queryKey: ['merkl-rewards', address],
    queryFn: async (): Promise<RewardsResponse[]> => {
      const response = await fetch(
        `${MERKL_PROXY_BASE}/v4/users/${address}/rewards?chainId=${gnosis.id}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Merkl rewards: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!address,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}

export function useMyPoints(overrideAddress?: Address) {
  const { data, ...rest } = useMyRewards(overrideAddress);

  const totalPoints = useMemo(() => {
    if (!data) return undefined;
    return data.reduce((acc, { rewards }) => {
      const dfiPointItems = rewards.filter(
        (reward) => reward.token.address === DFI_MERKL_POINT_TOKEN.address
      );
      const chainTotal = dfiPointItems.reduce((sum, { amount }) => {
        const formatted = formatUnits(BigInt(amount), DFI_MERKL_POINT_TOKEN.decimals);
        return sum.plus(formatted);
      }, BIG_NUMBERS.ZERO);
      return acc + MustBigNumber(chainTotal).toNumber();
    }, 0);
  }, [data]);

  return { data: totalPoints, ...rest };
}

export function useMyCampaignIds(overrideAddress?: Address) {
  const { data, ...rest } = useMyRewards(overrideAddress);

  const campaignIds = useMemo(() => {
    if (!data) return undefined;
    const ids = new Set<string>();
    for (const { rewards } of data) {
      for (const reward of rewards) {
        if (reward.token.address !== DFI_MERKL_POINT_TOKEN.address) continue;
        for (const b of reward.breakdowns) {
          if (b.campaignId) ids.add(b.campaignId);
        }
      }
    }
    return ids;
  }, [data]);

  return { data: campaignIds, ...rest };
}
