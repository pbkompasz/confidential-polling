import { ZKPassport } from '@zkpassport/sdk';
import { createWalletClient, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export async function verifyOnChain(
  proofResult: any,
  walletProvider: any,
  isIDCard: any,
) {
  const zkPassport = new ZKPassport('your-domain.com');

  // Get verification parameters
  const verifierParams = zkPassport.getSolidityVerifierParameters({
    proof: proofResult,
    // Use the same scope as the one you specified with the request function
    scope: 'my-scope',
    // Enable dev mode if you want to use mock passports, otherwise keep it false
    devMode: false,
  });

  // // Create wallet client
  // const walletClient = createWalletClient({
  //   chain: sepolia,
  //   transport: custom(walletProvider),
  // });

  // // Get the account
  // const [account] = await walletClient.getAddresses();

  // // Create a public client
  // const publicClient = createPublicClient({
  //   chain: sepolia,
  //   transport: http(),
  // });

  // // Call your contract with the verification parameters
  // const hash = await walletClient.writeContract({
  //   address: YOUR_CONTRACT_ADDRESS,
  //   abi: YOUR_CONTRACT_ABI,
  //   functionName: "register",
  //   args: [verifierParams, isIDCard],
  //   account,
  // });

  // // Wait for the transaction
  // await publicClient.waitForTransactionReceipt({ hash });

  // console.log("Verification completed on-chain!");
}
