import { cacheExchange, createClient, fetchExchange } from 'urql';
import { mainnet } from 'viem/chains';

const GRAPH_API_KEY = import.meta.env.VITE_GRAPH_API_KEY;

export const UNISWAP_V4_SUBGRAPH_IDS = {
  [mainnet.id]: 'DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G',
};

export const uniswapGraphClient = createClient({
  url: 'https://gateway.thegraph.com/api/subgraphs/id/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G',
  preferGetMethod: false,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${GRAPH_API_KEY}`,
    },
  },
  exchanges: [cacheExchange, fetchExchange],
});
