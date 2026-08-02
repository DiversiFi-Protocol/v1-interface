type Hook = {
  hookType: number;
  registryAddress: string;
  registryChainId: number;
};

type CampaignParams = {
  hooks: Hook[];
  lpFee: number;
  poolId: string;
  duration: number;
  blacklist: string[];
  currency0: string;
  currency1: string;
  whitelist: string[];
  forwarders: string[];
  weightFees: number;
  poolManager: string;
  weightToken0: number;
  weightToken1: number;
  symbolCurrency0: string;
  symbolCurrency1: string;
  decimalsCurrency0: number;
  decimalsCurrency1: number;
  symbolRewardToken: string;
  decimalsRewardToken: number;
  isOutOfRangeIncentivized: boolean;
};

type CampaignChain = {
  id: number;
  name: string;
  icon: string;
  liveCampaigns: number;
  endOfDisputePeriod: number;
  lastClaimsOnchainFetchTimestamp: string;
};

type CampaignToken = {
  id: string;
  name: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  icon: string;
  verified: boolean;
  isNative: boolean;
  isTest: boolean;
  type: string;
  displaySymbol: string;
  price?: number | null;
  updatedAt?: string | null;
  priceSource?: string | null;
};

type CampaignStatus = {
  status: string;
  preComputeStatus: string;
  error: string;
  details: string;
  delay: number;
  computedUntil: number;
  createdAt: number;
  processingStarted: number;
  preComputeProcessingStarted: number;
};

type Creator = {
  address: string;
  tags: string[];
  creatorId: string | null;
};

type DailyRewardBreakdown = {
  token: Token;
  amount: string;
  value: number;
  distributionType: string;
  id: string;
  timestamp: string;
  campaignId: string;
  dailyRewardsRecordId: string;
};

type MerklCampaign = {
  id: string;
  computeChainId: number;
  distributionChainId: number;
  campaignId: string;
  type: string;
  subType: number;
  rewardTokenId: string;
  amount: string;
  opportunityId: string;
  startTimestamp: number;
  endTimestamp: number;
  dailyRewards: number;
  apr: number;
  creatorAddress: string;
  params: CampaignParams;
  chain: CampaignChain;
  rewardToken: CampaignToken;
  distributionType: string;
  distributionChain: CampaignChain;
  campaignStatus: CampaignStatus;
  creator: Creator;
  createdAt: string;
  childCampaignIds: string[];
  dailyRewardsBreakdown: DailyRewardBreakdown[];
};

type Explorer = {
  chainId: number;
  id: string;
  type: string;
  url: string;
};

type Chain = {
  endOfDisputePeriod: number;
  explorers: Explorer[];
  icon: string;
  id: number;
  liveCampaigns: number;
  name: string;
};

type Token = {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  price: number | null;
};

type Breakdown = {
  root: string;
  distributionChainId: number;
  reason: string;
  amount: string;
  claimed: string;
  pending: string;
  campaignId: string;
};

type Reward = {
  root: string;
  distributionChainId: number;
  recipient: string;
  amount: string;
  claimed: string;
  pending: string;
  proofs: string[];
  token: Token;
  breakdowns: Breakdown[];
};

type RewardsResponse = {
  chain: Chain;
  rewards: Reward[];
};

export type { MerklCampaign, RewardsResponse };
