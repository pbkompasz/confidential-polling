import { BrowserProvider, ethers, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers';
import { createContext, useState } from 'react';

type AccountContextType = {
  isConnected: any;
  isPassportVerified: any;
  isEmailVerified: any;
  account: any;
  signIn: any;
  signUp: any;
  signUpHost: any;
  signOut: any;
  useDemoAccount: any;
  signer: any;
  browserProvider: any;
  addEmail: any;
  addPassport: any;
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
  const [browserProvider, setBrowserProvider] = useState<BrowserProvider | JsonRpcProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner | Wallet>();
  const [isPassportVerified] = useState(true);
  const [isEmailVerified] = useState(true);

  const demoAccounts = [
    {
      address: '0x3500438F95D4CCc2e6cd00ab2EbC4ed979D8218c',
      privateKey:
        '0x54b873583b06adad015e9e3f6496011ad62aa6330728bbcedea2a1f17fdb396b',
      name: 'Alice',
      isAdmin: true,
    },
    {
      address: '0x9EBA6Aa76418E8A560E7E0002670C54B5d8a8790',
      privateKey:
        '0x5208b7e6153189c2d50d8eb57db7a99f0248153c1e04164e6b5fc54fafa7ddba',
      name: 'Bob',
    },
    {
      address: '0x8Fb434616E5DCb006653DaB81DB5b427A412458a',
      privateKey:
        '0xfb6e299fc78a41ed1a1492fd04660e960361e33e594f4da5ed6fb266ce1cd2a5',
      name: 'Carol',
    },
  ];

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

    // Check if user has account, if not create

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

    const message = 'Sign up';
    const signature = await signer.signMessage(message);

    // Save account, if already have return false
    await switchToHardhat();

    setAccount({
      name: signer.address,
      address: signer.address,
    });
    setIsConnected(true);
  };

  const signUpHost = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setBrowserProvider(provider);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    setSigner(signer);
    const address = await signer.getAddress();

    console.log('User address:', address);

    const message = 'Sign up as host';
    const signature = await signer.signMessage(message);

    // Save account, if already have return false

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
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Or use an Infura/Alchemy endpoint
    const wallet = new ethers.Wallet(account.privateKey, provider);
    setSigner(wallet);
    setBrowserProvider(provider);
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
        signUpHost,
        signOut,
        useDemoAccount,
        signer,
        browserProvider,
        addEmail,
        addPassport,
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
