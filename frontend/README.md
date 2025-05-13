# Confidential Benchmarking and Polling

## Features

- [x] Confidential benchmarking
- [x] Define custom data models
- [x] Define custom data models

<!-- To win https://github.com/zama-ai/bounty-program/issues/144
# Admin logs in with EOA or passkeys but participant can log in w/ EOA, passkeys and passport
  Use porto and self.xyz, which I will have to utilize anyways for Noirhack
  https://docs.self.xyz/contract-integration/basic-integration
  https://porto.sh/
# Merkle trees (or Verkle trees if time) to improve efficiency
  https://github.com/polytope-labs/solidity-merkle-trees
  https://soliditydeveloper.com/merkle-tree
  https://github.com/zcash/incrementalmerkletree
  https://github.com/merkletreejs/merkletreejs/blob/master/src/IncrementalMerkleTree.ts
  https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4758
  https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/imt
# Third interface for analysts
  Calculates in batches
  Users will have 3 different roles: admin, analyst, participant
# Store the encrypted data on IPFS and submit hash
  Add to Merkle tree
  Verify Merkle proof
 -->

## Architecture

To offer a fast, provable and cheap solution we use IMTs(Incremental Merkle Tree) with a predefined number of elements.
At each submission the new hash, the old Merkle proof and the expected root hash is submitted. Given these we can calculate the new root and make sure that tree is only modified and not completely rewritten.
The initial data is stored off-chain i.e. IPFS, VPS and is requested at computation. The requested data is submitted for computation in batches and only the parts that are required for computation. This is done in the calldata which is pruned from the full node and is cheaper.

There are two particular data structures that can be used, one optimized for repeated analytics and another one that is only used for single calculations.

### Eager evaluation

Eager evaluation utilizes a much more comples data structure, a "big" binary tree structure where for each constraint we have bifurcation and the end nodes are IMTs.
For example if the data we collect is age and nationality and the constraints are "is over 18" and "not on OFAC list" we would have 4 IMTs.
The algorithm calculates the node position for each response received and the has of the data is inserted in the corresponding IMT.  
When an analytics calculation is performed, simply the non-zero child nodes in the corresponding IMTs are calculated.
Computation can also happen, for example we can calculate the average age for each "over 18" by summing the received data and storing it in the IMT root. When we want to get the value we add the two IMTs values and decrypt them.
This more complex structure, but it has many benefits, if the analytics will happen large number of times and if we want to keep some intermediary data on-chain.
<!-- NOTE it can be 3^no_contraints or 4... -->
This solution is powerful if the number 2^(no_contraints) is greater than no_participants and we want to perform more than no_participant computations.

### Lazy evaluation

This option stores all the received data in a Incremental Merkle Tree and generates survey computations on the data on demand. This is very useful for things like confidential "straw polls" or events where the data is ephemeral. 

## Participation incentives

More than just knowing there are also monetary incentives for participating in the survey....
We can set up incentives in a way that we can hit a sweet spot that is statistically relevant (e.g. >1000 participants) and not too computationally intensive(e.g. MoE too high and not worth it).
With FHE we can adjust this incentive multipliers based on the data received in a given batch. This way we can ask for relevant data while not sharing sensitive information of the users.

## Data Validation

The submitted data is verified both in the dApp interface before submission and at computation time on-chain.
Each data "packet" has a list of verification criteria that the data has to pass.

## Scalability

Thanks to Incremental Merkle Trees and batched execution the survey can serve a high number of participants. You can check the benchmarks below where the estimated gas costs and execution time is presented for various number of participants e.g. 1000.

### Gas Benchmarks

n = 10
n = 100
n = 100.000

| Submissions                      | Gas cost | Performance |
| -------------------------------- | -------- | ----------- |
| `n=100` and `perBatch=3`         |          |             |
| `n=1_000` and `perBatch=20`      |          |             |
| `n=1_000_000` and `perBatch=150` |          |             |

## KYC and Proof of Humanity

[Civic Pass](https://docs.civic.com/pass/use-cases/smart-contract-development) is used to verify liveness of a person.
[Self](https://self.xyz) is a password verification mechanism that uses zero-knowledge proofs and users can selective share their information.
[ZK Email](https://prove.email/) is a service that allows users to perform onchain actions by sending emails.
Through [Porto](porto.sh) we can use passkeys to create an account.

These tools allow the event organizer to select the amount of authentication they desire, a user could only need to verify their email or they would have to perform an extensive KYC and password verification. This adds flexibility to the registration flow on the platform.

## Getting started

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and update the gateway URL, ACL address, and KMS address to match the fhEVM you're using.

## Development

```bash
npm run dev
```

The server listens on [http://localhost:5173/](http://localhost:5173/)

## Build

```bash
npm run build
```

## Using the mocked coprocessor for front end

As an alternative to use the real coprocessor deployed on Sepolia, to help you develop your dApp faster and without needing testnet tokens, you can use a mocked fhevm. Currently, we recommend you to use the `ConfidentialERC20` dApp example available on the [`mockedFrontend` branch of this repository](https://github.com/zama-ai/fhevm-react-template/tree/mockedFrontend). Follow the README on this branch, and you will be able to deploy exactly the same dApp both on Sepolia as well as on the mocked coprocessor seamlessly.

## Documentation

For more information about fhevmjs, you can [read the documentation](https://docs.zama.ai/fhevm).
