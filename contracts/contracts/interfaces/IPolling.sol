// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPolling {
    enum EvaluationType {
        Eager,
        Lazy
    }

    enum ValidationType {
        Eager,
        Lazy
    }

    enum StorageType {
        Onchain,
        Offchain,
        Hybrid
    }

    enum PollStatus {
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
}
