import {
  BrowserProvider,
  ethers,
  JsonRpcProvider,
  JsonRpcSigner,
  Wallet,
} from 'ethers';
import { createContext, useEffect, useState } from 'react';
import { Event } from '@/types';
import { demoAccounts, ENTRYPOINT_ADDRESS } from '@/const';
import { entrypointAbi, identityAbi } from '@/abi';
import { createDemoFhevmInstance } from '@/fhevmjs';

type AccountContextType = {
  isConnected: any;
  isPassportVerified: any;
  isEmailVerified: any;
  account: any;
  signIn: any;
  signUp: any;
  signOut: any;
  useDemoAccount: any;
  signer: any;
  browserProvider: any;
  addEmail: any;
  addPassport: any;
  canStartEvent: any;
  canStopEvent: any;
  canCancelEvent: any;
  canEditEvent: any;
  canQuery: any;
};

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined,
);

export const AccountProvider = ({ children }: { children: any }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<{
    address: string;
    privateKey?: string;
    name: string;
    isAdmin?: boolean;
  }>();
  const [browserProvider, setBrowserProvider] = useState<
    BrowserProvider | JsonRpcProvider
  >();
  const [signer, setSigner] = useState<JsonRpcSigner | Wallet>();
  const [isPassportVerified, setIsPassportVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        await createDemoFhevmInstance(
          browserProvider as JsonRpcProvider,
          signer as JsonRpcSigner,
        );
      } else {
        setIsPassportVerified(false);
        setIsEmailVerified(false);
      }
    })();
  }, [isConnected]);

  const signIn = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setBrowserProvider(provider);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();

    console.log('User address:', address);

    const message = 'Sign up';
    const signature = await signer.signMessage(message);

    setAccount({
      name: signer.address,
      address: signer.address,
    });
    setIsConnected(true);
  };

  const signUp = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setBrowserProvider(provider);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();

    console.log('User address:', address);

    // Save account, if already have return false
    await switchToHardhat();

    const message = 'Sign up';
    const signature = await signer.signMessage(message);

    // Check if user has account, if not create
    const entrypointContract = new ethers.Contract(
      ENTRYPOINT_ADDRESS,
      entrypointAbi,
      provider,
    );

    const identityRegistry =
      await entrypointContract.getIdentityRegistryAddress();
    const identityContract = new ethers.Contract(
      identityRegistry,
      identityAbi,
      provider,
    );
    const contractWithSigner = identityContract.connect(signer);
    // @ts-expect-error
    const tx = await contractWithSigner.signUp(signature);
    await tx.wait();

    setAccount({
      name: signer.address,
      address: signer.address,
    });
    setIsConnected(true);
  };

  const signOut = () => {
    setIsConnected(false);
    setSigner(undefined);
    setBrowserProvider(undefined);
    setAccount(undefined);
  };

  const addPassport = () => {};

  const addEmail = () => {};

  const useDemoAccount = (id: number) => {
    const account = demoAccounts[id];
    setAccount(account);
    setIsConnected(true);
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const wallet = new ethers.Wallet(account.privateKey, provider);
    setSigner(wallet);
    setBrowserProvider(provider);
  };

  const canStartEvent = (event?: Event) => {
    if (!account || !event) return false;
    return account?.address === event?.host;
  };

  const canStopEvent = (event?: Event) => {
    if (!account || !event) return false;
    return account?.address === event?.host;
  };

  const canCancelEvent = (event?: Event) => {
    if (!account || !event) return false;
    return account?.address === event?.host;
  };

  const canEditEvent = (event?: Event) => {
    if (!account || !event) return false;
    return account?.address === event?.host;
  };

  const canQuery = (event?: Event) => {
    if (!account || !event) return false;

  };

  return (
    <AccountContext.Provider
      value={{
        isConnected,
        isPassportVerified,
        isEmailVerified,
        account,
        signIn,
        signUp,
        signOut,
        useDemoAccount,
        signer,
        browserProvider,
        addEmail,
        addPassport,
        canStartEvent,
        canStopEvent,
        canCancelEvent,
        canEditEvent,
        canQuery
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

const HARDHAT_PARAMS = {
  chainId: '0x7A69', // 31337 in hex
  chainName: 'Hardhat',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
};

async function switchToHardhat() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_PARAMS.chainId }],
    });
  } catch (switchError: Error | any) {
    // This error code means the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HARDHAT_PARAMS],
        });
      } catch (addError) {
        console.error('Failed to add Hardhat network:', addError);
      }
    } else {
      console.error('Failed to switch network:', switchError);
    }
  }
}
