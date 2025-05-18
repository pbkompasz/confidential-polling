// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEvent {
    enum Status {
        Created,
        Initiated,
        Active,
        Inactive,
        Finished
    }
    struct Submission {
        address submitter;
        bytes dataHash;
        bool verified;
    }
    enum EvaluationType {
        // Data is evaluated at submission time This only works for onchain and hybrid data storage type.
        Eager,
        // Data is evaluated at the end of the poll.
        Lazy,
        // Evaluate submitted data in batches as the event progresses
        Ongoing
    }

    enum ValidationType {
        // The submitted data is validated at submittion type. This only works for onchain or hybrid data storage type.
        Eager,
        // Data is validated at evaluation time.
        Lazy
    }

    // There are 3 data storage types, based on size and cost: onchain, offchain and hybrid
    enum StorageType {
        // This is the simplest implementation, every submission is stored in the blockchain.
        // This is useful for submission where the data is small
        // e.g. eboolean that stores a T/F result
        Onchain,
        // Only the hash of the data is submitted, this implies that the data is not verified or
        // processed at submission time. This is mitigated by having
        // a thrusted third party that vouches for a user's data
        Offchain,
        // This type refers to the situation when the data is verified and evaluated at runtime but the data
        // is not stored in the storage, only present
        // as calldata
        Hybrid
    }
}
