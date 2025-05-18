# Smart contracts

This directory contains all the smart contracts to run a confidential benchmarking and polling system

## Directory structure

- identity: Contains all the smart contracts to create on-chain identities with off-chain information e.g. passkeys, email, etc .
- IMT.sol: Incremental Merkle Trees are the base data types that is used to efficiently keep track of all the data onchain
- Polling.sol: The smart contract that implements a polling survey event
- Benchmarking.sol: The smart contract that implements a benchmarking survery event

The different between benchmarking and polling is the type of form they use, the former accepts boolean, numerical and byte values, while the later only accepts boolean and option(e.g. 0=Male, 1=Female, 2=Other) values.

## Analytics

For a polling contract the analytics operation is the process of counting the number of participants for the request constraints, for example if there are 3 constraints (gender, ageGroup(18-34, 34-49, ...), doYouAgree) and the organizer wants a breakdown for each constraint we would calculate 3*5*2 results.  
The benchmarking contract on the other hand is more complex and it consists of two parts, the constraints and a set of numerical values. We can similarly calculate the constraint group and then we can take the numerical values and do the following operations, SUM, AVG and MEAN.
Given the large cost of FHE operations, especially decryption, we use a bitfields to generate the constraint results for each `formData` and then use bit-shifting and comparisons to create the final results.

Analysts can take this data and do skyline queries, for example they can calculate the average salary of males aged 18-34.
Paper: https://arxiv.org/pdf/1704.01788
