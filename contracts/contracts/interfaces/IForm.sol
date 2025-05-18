// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

interface IForm {
    struct Form {
        Field[] fields;
        uint256 id;
    }

    struct FormData {
        einput[] inputs;
        bytes inputProof;
    }

    struct Field {
        string name;
        // 0 - eaddress
        // 1 - ebool
        // 2 - euint64
        // 3 - ebytes64
        // 4 - choice w/ 2 options 0, 1
        // 5 - choice w/ up to 4 options 0, 1, 2, 3
        // 6 - choice w/ up to 8 options 0, 1, 2, 3, 4, 5, 6, 7
        EncryptedInputType encryptedInputType;
        uint256 requirementId;
    }

    enum EncryptedInputType {
        None,
        Eaddress,
        Ebool,
        Euint64,
        Ebytes64,
        Choice2,
        Choice4,
        Choice8
    }

    struct RequirementBytes {
        bytes[] forbiddenValues;
    }

    struct RequirementAddress {
        address[] forbiddenValues;
    }

    struct RequirementUint {
        uint256 min;
        uint256 max;
        uint256[] forbiddenValues;
    }
}
