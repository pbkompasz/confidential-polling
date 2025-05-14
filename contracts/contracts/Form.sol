// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Forms is Ownable {
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
    RequirementBytes[] requirementsBytes;
    RequirementAddress[] requirementsAddress;
    RequirementUint[] requirementsUint;

    uint8 constant MAX_FIELDS = 10;
    uint256 fieldNo;

    euint8 ZERO;
    euint8 ONE;
    ebool TRUE;
    ebool FALSE;

    Field[] fields;

    constructor(Field[] memory _fields) Ownable(msg.sender) {
        assert(_fields.length < MAX_FIELDS);
        // Create the form
        for (uint i = 0; i < _fields.length; i++) {
            fields.push(_fields[i]);
        }
        fieldNo = _fields.length;

        ZERO = TFHE.asEuint8(0);
        ONE = TFHE.asEuint8(1);
        TRUE = TFHE.asEbool(true);
        FALSE = TFHE.asEbool(false);
    }

    /**
     * Check all the submitted data
     */
    function validateForm() public {}

    function validateField(uint256 fieldId, einput input, bytes calldata inputProof) public {
        Field memory field = fields[fieldId];
        assert(field.isEncrypted == true);
        if (field.encryptedInputType == 0) {
            eaddress encryptedAddress = TFHE.asEaddress(input, inputProof);
            validateEaddress(fieldId, encryptedAddress);
        } else if (field.encryptedInputType == 1) {
            TFHE.asEbool(input, inputProof);
        } else if (field.encryptedInputType == 2) {
            euint64 encryptedEuint = TFHE.asEuint64(input, inputProof);
            validateEuint64(fieldId, encryptedEuint);
        } else if (field.encryptedInputType == 3) {
            ebytes64 encryptedEbytes = TFHE.asEbytes64(input, inputProof);
            validateEbytes64(fieldId, encryptedEbytes);
        }
    }

    /**
     *  Checks that the submitted address is not in one of the blacklisted values
     *  The return value returns an encrypted bool and plaintext bool, if the plaintext is true we accept it otherwise we have to rely on the encrypted value
     * @param requirementId Requirement id
     * @param encrytpedAddress Encrypted address
     */
    function validateEaddress(uint256 requirementId, eaddress encrytpedAddress) private returns (ebool, bool) {
        assert(requirementId < requirementsAddress.length);
        RequirementAddress memory requirement = requirementsAddress[requirementId];
        if (requirement.forbiddenValues.length == 0) {
            return (TFHE.asEbool(true), true);
        }
        euint8 toAdd;
        for (uint i = 0; i < requirement.forbiddenValues.length; i++) {
            euint8 r = TFHE.select(
                TFHE.eq(TFHE.asEaddress(requirement.forbiddenValues[i]), encrytpedAddress),
                ONE,
                ZERO
            );
            toAdd = TFHE.add(toAdd, r);
        }

        return (TFHE.select(TFHE.eq(toAdd, ZERO), TRUE, FALSE), false);
    }

    /**
     *  Checks that the submitted euint64 is between min and max and not in the forbidden values
     * @param requirementId Requirement id
     * @param encrytpedEuint64 Encrypted euint64
     */
    function validateEuint64(uint256 requirementId, euint64 encrytpedEuint64) private returns (ebool, bool) {
        assert(requirementId < requirementsUint.length);
        RequirementUint memory requirement = requirementsUint[requirementId];
        if (requirement.forbiddenValues.length == 0) {
            return (TFHE.asEbool(true), true);
        }
        euint8 toAdd;
        for (uint i = 0; i < requirement.forbiddenValues.length; i++) {
            euint8 r = TFHE.select(
                TFHE.eq(TFHE.asEuint64(requirement.forbiddenValues[i]), encrytpedEuint64),
                ONE,
                ZERO
            );
            toAdd = TFHE.add(toAdd, r);
        }

        // Check value is between min and max
        toAdd = TFHE.add(toAdd, TFHE.select(TFHE.le(TFHE.asEuint64(requirement.min), encrytpedEuint64), ONE, ZERO));
        toAdd = TFHE.add(toAdd, TFHE.select(TFHE.ge(TFHE.asEuint64(requirement.max), encrytpedEuint64), ONE, ZERO));

        return (TFHE.select(TFHE.eq(toAdd, ZERO), TRUE, FALSE), false);
    }

    /**
     *  Checks that the submitted ebytes64 is between min and max and not in the forbidden values
     * @param requirementId Requirement id
     * @param encrytpedEbytes64 Encrypted bytest64
     */
    function validateEbytes64(uint256 requirementId, ebytes64 encrytpedEbytes64) private returns (ebool, bool) {
        assert(requirementId < requirementsBytes.length);
        RequirementBytes memory requirement = requirementsBytes[requirementId];
        if (requirement.forbiddenValues.length == 0) {
            return (TFHE.asEbool(true), true);
        }
        euint8 toAdd;
        for (uint i = 0; i < requirement.forbiddenValues.length; i++) {
            euint8 r = TFHE.select(
                TFHE.eq(TFHE.asEbytes64(requirement.forbiddenValues[i]), encrytpedEbytes64),
                ONE,
                ZERO
            );
            toAdd = TFHE.add(toAdd, r);
        }

        return (TFHE.select(TFHE.eq(toAdd, ZERO), TRUE, FALSE), false);
    }

    function submit(uint8 fieldId, einput param, bytes calldata inputProof) public {}

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 20))
        }
    }
}
