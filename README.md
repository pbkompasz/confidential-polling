# Confidential Benchmarking and Polling

## Features

- Confidential benchmarking and polling
- Custom forms: Hosts can define custom forms
- Encrypted data submissions:
- Private KYC: w/ zk proofs, including email and passport
- Custom analytics:

## Architecture

<!-- TODO Pic
  frontend(self, zkemail, etc.) -> onchain, hybrid(IMT) or offchain(IMT) storage -> (polling or benchmarking -> event(check status, etc.) -> form (validation, evaluation) -> Store the result in a relation database -> Back to the frontend
 -->

To offer a fast, provable, and cost-efficient solution, we use Incremental Merkle Trees (IMTs).

The initial data is stored off-chain and is fetched when analytics query is requested. Data is submitted for computation in batches, including only the parts required for that computation. This data is sent via calldata, which is pruned from the full node, making it more cost-effective.

The poll/benchmark event proceeds through three stages:

- Planned stage: After a host creates a poll or benchmark event, it enters this stage during which users cannot submit data.
- Live stage: Users submit encrypted data to the poll. Depending on the configuration, the data can be processed either immediately upon submission or after the event concludes.
- Completed stage: The data is evaluated (if not processed continuously during the live stage), and analysts can query the data based on custom constraints. These queries are cached, so the data does not need to be recalculated in the future.

### Analytics

An analyst can request constrained counts on poll forms and constrained operations (SUM, AVG, MAX, MIN, COUNT) on benchmark data.  
The analyst specifies the constraint fields; given this and the input types, we create a binary uint. Then we iterate over every submitted data point, XOR them, cache the response, and return the value.

This value for a poll is just a count, and for benchmarks, we can specify a field and an operation that we want to perform.

For example:

- **Poll** with fields `gender`, `ageGroup`, and `T/F`. If we want to get a breakdown of all the males in the 29-44 age group that voted, we create the following value:  
  `00000010`, where from right to left:

  - `0` = male
  - `01` = the second age group.

- **Salary benchmark** with fields `gender`, `ageGroup`, `position`, and `brut salary`. If we want to get a breakdown of all the females, programmers, 45-60 age group, and get their average salary:  
  The constraint value is `00110101`, where from right to left:
  - `1` = female
  - `10` = the third age group
  - `011` = the programmer value
  - The operation field is salary, and the operation is AVG (we cache SUM and COUNT values).

If we want to calculate the number of respondents with 2 binary fields and 100,000 submissions, we would have to do:  
`100,000 * 2 \_ 2 (Create constraint string) + 100,000 (XOR) + 100,100 (ADD);`  
This results in an approximate complexity of `O(n*2 + n*2^noConstraint)`, which is roughly `O(n)`.

This approach is really convenient when we want to add or remove a constraint. It would take up to 3 bit-shifts left or right and an addition.

Other ideas that could work include creating a **"search tree"**, where each branch represents a possible constraint value. Then at each child node, we would have a data structure that accumulates the values. The downside is that we would have to push data into multiple branches to avoid revealing other submitters to the current submitter and store an encrypted flag to notify if a value is valid or just a decoy. Or a bundler can submit the data.

## Data Validation

The submitted data is verified both in the dApp interface before submission and at computation time on-chain.  
There are two validation types: **eager** and **lazy**.

- **Eager validation** means that data is validated at submission time, for each submission individually.
- **Lazy validation** means that data is either validated at the end of the survey or in batches while the survey is ongoing.

## Scalability

By opting to use the most favorable settings (lazy evaluation with lazy validation), and thanks to Incremental Merkle Trees and batched execution, the survey can support a high number of participants.

You can check the benchmarks below where the estimated gas costs and execution times are presented for various numbers of participants, e.g., 1000.

The complexity of creating an analytics query is:
O(n * 2^(noBinaryConstraints - 1) + n * 4^(noChoice4Constraints) + n * 8^(noChoice*Constraints))

| Submissions                              | Gas Cost | Performance |
| ---------------------------------------- | -------- | ----------- |
| `n=100`, `noConstraints=3`, action=COUNT |          |             |
| `n=1,000`, `evaluationBatch=20`          |          |             |

## KYC and Proof of Humanity

[ZK Passport](https://self.xyz) is a password verification mechanism that uses zero-knowledge proofs, allowing users to selectively share their information.  
[ZK Email](https://prove.email/) is a service that enables users to perform on-chain actions by sending emails.

These tools allow the event organizer to choose the level of authentication they require. For example, a user might only need to verify their email, or they might have to undergo an extensive KYC and password verification. This adds flexibility to the registration flow on the platform.  

Furthermore, a user’s main identifier is their **"passkey wallet"**, to which other external identifiers are linked. These serve as proofs of ownership and do not reveal any personal information unless the user consents to share it.

Currently, these methods only verify that the user has a valid email or passport, but they can be further enhanced by asking users to disclose certain personal data (e.g., age) or prove that they are not in a sanctioned country.

## How to Run

Deployed contracts:

To run locally run the following command:

Create a `.env` file based on the `.env.example` provided.

```bash
docker compose -f docker-compose.dev.yml up
```

Disclaimer, the identity verification only works on Sepolia testnet.

To connect to the Sepolia contracts run

```bash
docker compose -f docker-compose.test.yml up
```

Create demo polls and benchmarks
```
npx hardhat create-events --contract ${ENTRYPOINT_CONTRACT_ADDRESS} --network ${'localhost' | 'sepolia'}
```

## Known issues/TODOs

- [ ] Email address registration
- [ ] Benchmarks
- [ ] The survey page only works with 1 form per survey
