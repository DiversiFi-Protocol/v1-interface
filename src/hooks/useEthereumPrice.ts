import { useQuery } from '@tanstack/react-query';

const API_URL =
  'https://66iv2m87ol.execute-api.ap-northeast-1.amazonaws.com/mainnet/metadata-service/v1/prices';

export function useEthereumPrice() {
  const ethPriceQuery = useQuery({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          assets: ['ETH'],
        }),
      });

      const responseJson = await response.json();
      return responseJson['ETH'];
    },
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return {
    data: ethPriceQuery.data,
    isLoading: ethPriceQuery.isLoading,
    isError: ethPriceQuery.isError,
  };
}
