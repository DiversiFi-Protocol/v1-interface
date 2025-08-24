import { useState } from 'react';

import { useQuery } from 'urql';

const GET_POOL_VOLUMES_QUERY = `query PoolsDaily {
  poolDayDatas(
    first: 1000
    orderBy: date
    orderDirection: asc
    where: { pool_in: ["0x053f6a47ccba79e7d5d623173ed6dd5a31cf19c28bae0fb8276f4506295f90da","0x21c67e77068de97969ba93d4aab21826d33ca12bb9f565d8496e8fda8a82ca27"], date_gte: 1753479430 }
  ) {
    pool {
      id
      token0 { symbol decimals }
      token1 { symbol decimals }
    }
    date
    volumeToken0
    volumeToken1
  }
}`;

export function useGetPoolVolumes({ poolIds }: { poolIds: string[] }) {
  // 30 days ago
  const [from] = useState(Date.now() - 1000 * 60 * 60 * 24 * 30);

  return useQuery({
    query: GET_POOL_VOLUMES_QUERY,
    variables: {
      pools: poolIds,
      from: Math.floor(from / 1000),
    },
  });
}
