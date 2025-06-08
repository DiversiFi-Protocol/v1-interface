import { hardhat, mainnet, sepolia } from 'viem/chains';

export class EnvVar {
  private WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  private CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

  get walletConnectProjectId() {
    return this.WALLETCONNECT_PROJECT_ID;
  }

  get chainId(): 1 | 31337 | 11155111 {
    if (!this.CHAIN_ID) {
      throw new Error('CHAIN_ID is missing from environment variables');
    }

    if (
      ![mainnet.id.toString(), sepolia.id.toString(), hardhat.id.toString()].includes(this.CHAIN_ID)
    ) {
      throw new Error('CHAIN_ID is not valid');
    }

    return parseInt(this.CHAIN_ID, 10) as 1 | 31337 | 11155111;
  }
}

export const envVar = new EnvVar();
