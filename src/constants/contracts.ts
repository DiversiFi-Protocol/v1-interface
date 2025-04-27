import { Address } from 'viem';
import { envVar } from './environment';

export const BACKING_POOL_ADDRESS: Address = envVar.backingPoolAddress;
