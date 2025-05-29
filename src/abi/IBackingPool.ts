export default [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_burnAmount',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAdmin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllAssets',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getAsset',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getAssetParams',
    outputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint32',
            name: 'targetAllocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'maxAllocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'minAllocation',
            type: 'uint32',
          },
          {
            components: [
              {
                internalType: 'uint32',
                name: 'allocation',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'nextAllocation',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'price',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'increaseFee',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'decreaseFee',
                type: 'uint32',
              },
              {
                internalType: 'uint48',
                name: 'priceSlope',
                type: 'uint48',
              },
            ],
            internalType: 'struct TickData[]',
            name: 'tickData',
            type: 'tuple[]',
          },
          {
            internalType: 'uint32[]',
            name: 'tickBoundaries',
            type: 'uint32[]',
          },
        ],
        internalType: 'struct AssetParams',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBurnFeeQ128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFeesCollected',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIsDirectMintEnabled',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIsSwapEnabled',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLiquidityToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
    ],
    name: 'getLowerTick',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'allocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'nextAllocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'price',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'increaseFee',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'decreaseFee',
            type: 'uint32',
          },
          {
            internalType: 'uint48',
            name: 'priceSlope',
            type: 'uint48',
          },
        ],
        internalType: 'struct TickData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMaxReservesLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMaxReservesLimitRatioQ128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMintFeeQ128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
    ],
    name: 'getPriceQ128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
    ],
    name: 'getSpecificReserves',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getSpecificReservesScaled',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalReservesScaled',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'recoverFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assetAddresses',
        type: 'address[]',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint32',
            name: 'targetAllocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'maxAllocation',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'minAllocation',
            type: 'uint32',
          },
          {
            components: [
              {
                internalType: 'uint32',
                name: 'allocation',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'nextAllocation',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'price',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'increaseFee',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'decreaseFee',
                type: 'uint32',
              },
              {
                internalType: 'uint48',
                name: 'priceSlope',
                type: 'uint48',
              },
            ],
            internalType: 'struct TickData[]',
            name: 'tickData',
            type: 'tuple[]',
          },
          {
            internalType: 'uint32[]',
            name: 'tickBoundaries',
            type: 'uint32[]',
          },
        ],
        internalType: 'struct AssetParams[]',
        name: '_params',
        type: 'tuple[]',
      },
    ],
    name: 'setAssetParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_burnFeeQ128',
        type: 'uint256',
      },
    ],
    name: 'setBurnFeeQ128',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isDepositEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsDepositEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isDirectMintEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsDirectMintEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_isSwapEnabled',
        type: 'bool',
      },
    ],
    name: 'setIsSwapEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintFeeQ128',
        type: 'uint256',
      },
    ],
    name: 'setMintFeeQ128',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_publicLimitIncreaseCooldown',
        type: 'uint256',
      },
    ],
    name: 'setPublicLimitIncreaseCooldown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_inputAsset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_outputAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_minOutput',
        type: 'uint256',
      },
    ],
    name: 'swapGivenIn',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_inputAsset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_outputAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxInput',
        type: 'uint256',
      },
    ],
    name: 'swapGivenOut',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address',
      },
    ],
    name: 'withdrawFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
