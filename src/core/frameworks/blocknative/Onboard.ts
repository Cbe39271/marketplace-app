import Onboard from 'bnc-onboard';
import { API } from 'bnc-onboard/dist/src/interfaces';
import { getAddress } from '@ethersproject/address';

import { getConfig } from '@config';
import { getNetworkId, getNetworkRpc } from '@utils';
import { Wallet, Subscriptions, Network, Theme } from '@types';

import ledgerIframeWallet from './IframeWallet';

export class BlocknativeWalletImpl implements Wallet {
  private onboard?: API;

  private getState() {
    return this.onboard?.getState();
  }

  get selectedAddress() {
    const address = this.getState()?.address;
    return address ? getAddress(address) : undefined;
  }

  get networkVersion() {
    return this.getState()?.network;
  }

  get balance() {
    return this.getState()?.balance;
  }

  get name() {
    return this.getState()?.wallet.name ?? undefined;
  }

  get provider() {
    return this.getState()?.wallet.provider;
  }

  get isCreated(): boolean {
    return !!this.onboard;
  }

  get isConnected(): Promise<boolean> {
    return this.onboard?.walletCheck() ?? Promise.resolve(false);
  }

  public create(network: Network, subscriptions: Subscriptions, theme?: Theme): boolean {
    const networkId = 5;
    const { BLOCKNATIVE_KEY, FORTMATIC_KEY, PORTIS_KEY } = getConfig();

    const rpcUrl = getNetworkRpc(network);
    const appName = 'Debt DAO';

    const wallets = [
      { walletName: 'metamask' },
      {
        walletName: 'walletConnect',
        rpc: {
          [networkId]: 'https://eth-goerli.public.blastapi.io',
        },
      },
      {
        walletName: 'trezor',
        appUrl: 'https://reactdemo.blocknative.com',
        email: 'aaron@blocknative.com',
        rpcUrl,
      },
      {
        walletName: 'ledger',
        rpcUrl,
      },
      { walletName: 'frame' },
      { walletName: 'coinbase' },
      { walletName: 'tally' },
      { walletName: 'status' },
      {
        walletName: 'lattice',
        appName,
        rpcUrl,
      },
      { walletName: 'walletLink', rpcUrl },
      {
        walletName: 'portis',
        apiKey: PORTIS_KEY,
      },
      { walletName: 'fortmatic', apiKey: FORTMATIC_KEY },
      { walletName: 'torus' },
      { walletName: 'authereum', disableNotifications: true },
      { walletName: 'trust', rpcUrl },
      { walletName: 'opera' },
      { walletName: 'operaTouch' },
      { walletName: 'imToken', rpcUrl },
      { walletName: 'meetone' },
      { walletName: 'gnosis' },
      {
        walletName: 'keystone',
        rpcUrl,
        appName,
      },
      { walletName: 'huobiwallet' },
      { walletName: 'liquality' },
      { walletName: 'detectedwallet' },
    ];

    const walletCheck = [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }];

    this.onboard = Onboard({
      networkId: 5,
      dappId: BLOCKNATIVE_KEY,
      darkMode: theme !== 'light',
      subscriptions,
      walletSelect: {
        wallets: [...wallets, ledgerIframeWallet],
      },
      walletCheck,
    });

    return !!this.onboard;
  }

  public async connect(args?: any): Promise<boolean> {
    try {
      await this.onboard?.walletSelect(args?.name);
      const valid = await this.onboard?.walletCheck();
      return valid ?? false;
    } catch (error) {
      return false;
    }
  }

  public async changeTheme(theme: Theme) {
    const darkMode = theme !== 'light';
    if (this.onboard) {
      this.onboard.config({ darkMode });
    }
  }

  public async addToken(
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenImage: string
  ): Promise<boolean> {
    try {
      await this.getState()?.wallet.provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private isMetaMask(): boolean {
    return this.name?.toUpperCase() === 'MetaMask'.toUpperCase();
  }
}
