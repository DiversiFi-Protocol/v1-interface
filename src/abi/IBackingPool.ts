export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrowAsset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'borrowAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'repayAmount',
        type: 'uint256',
      },
    ],
    name: 'Flash',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'targetAllocation',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'maxAllocation',
        type: 'uint16',
      },
    ],
    name: 'ParamsUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'inputAsset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'outputAsset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'deltaInput',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'deltaOutput',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'tickIndex',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'allocation',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'price',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'increaseFee',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'priceSlope',
        type: 'uint32',
      },
    ],
    name: 'TickUpdate',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'burn',
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
        name: '_borrowAsset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_borrowAmount',
        type: 'uint256',
      },
    ],
    name: 'flash',
    outputs: [
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
            internalType: 'address',
            name: 'assetAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint16',
            name: 'targetAllocation',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'maxAllocation',
            type: 'uint16',
          },
        ],
        internalType: 'struct IBackingPool.AssetParams',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBackedToken',
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
    name: 'getFeeRecipient',
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
    name: 'getInsuranceFund',
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
    name: 'getIsFrozen',
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
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'assetAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
          {
            internalType: 'uint16',
            name: 'targetAllocation',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'maxAllocation',
            type: 'uint16',
          },
        ],
        internalType: 'struct IBackingPool.AssetParams[]',
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
        internalType: 'bool',
        name: '_isFrozen',
        type: 'bool',
      },
    ],
    name: 'setIsFrozen',
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
