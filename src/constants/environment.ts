import { Address } from 'viem';
import { hardhat, mainnet } from 'viem/chains';

export class EnvVar {
  private WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  private CHAIN_ID = import.meta.env.VITE_CHAIN_ID;
  private BACKING_POOL_ADDRESS = import.meta.env.VITE_BACKING_POOL_ADDRESS;
  private APP_ALCHEMY_KEY = import.meta.env.VITE_APP_ALCHEMY_KEY;

  get walletConnectProjectId() {
    return this.WALLETCONNECT_PROJECT_ID;
  }

  get chainId(): 1 | 31337 {
    if (!this.CHAIN_ID) {
      throw new Error('CHAIN_ID is missing from environment variables');
    }

    if (![mainnet.id.toString(), hardhat.id.toString()].includes(this.CHAIN_ID)) {
      throw new Error('CHAIN_ID is not valid');
    }

    return parseInt(this.CHAIN_ID, 10) as 1 | 31337;
  }

  get backingPoolAddress() {
    if (!this.BACKING_POOL_ADDRESS) {
      throw new Error('BACKING_POOL_ADDRESS is missing from environment variables');
    }

    return this.BACKING_POOL_ADDRESS as Address;
  }

  get alchemyKey() {
    if (!this.APP_ALCHEMY_KEY) {
      throw new Error('APP_ALCHEMY_KEY is missing from environment variables');
    }

    return this.APP_ALCHEMY_KEY;
  }
}

export const envVar = new EnvVar();
