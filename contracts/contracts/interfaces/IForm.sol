// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IForm {
    struct Form {
        Field[] fields;
    }

    struct Field {
        string name;
        bool isEncrypted;
        // -1 - non encrypted fields
        // 0 - eaddress
        // 1 - ebool
        // 2 - euint64
        // 3 - ebytes64
        int8 encryptedInputType;
        uint256 requirementId;
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
