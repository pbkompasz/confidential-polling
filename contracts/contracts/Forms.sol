// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IForm } from "./interfaces/IForm.sol";

// TODO Set option values
contract Forms is Ownable, IForm {
    RequirementBytes[] requirementsBytes;
    RequirementAddress[] requirementsAddress;
    RequirementUint[] requirementsEuint;

    uint8 constant MAX_FIELDS = 10;

    // This are confidential constants that have to be defined at runtime
    euint8 ZERO;
    euint8 ONE;
    ebool TRUE;
    ebool FALSE;

    constructor() Ownable(msg.sender) {
        ZERO = TFHE.asEuint8(0);
        ONE = TFHE.asEuint8(1);
        TRUE = TFHE.asEbool(true);
        FALSE = TFHE.asEbool(false);
    }

    function _createForm(Field[] memory _fields) internal view onlyOwner returns (Form memory) {
        Form memory f = Form({ fields: _fields });

        return f;
    }

    function createField(
        string memory name,
        EncryptedInputType encryptedInputType,
        uint256 requirementId
    ) public view onlyOwner returns (Field memory) {
        Field memory field = Field(name, encryptedInputType, requirementId);
        if (field.encryptedInputType == EncryptedInputType.Eaddress) {
            require(requirementId < requirementsAddress.length);
        } else if (field.encryptedInputType == EncryptedInputType.Euint64) {
            require(requirementId < requirementsEuint.length);
        } else if (field.encryptedInputType == EncryptedInputType.Ebytes64) {
            require(requirementId < requirementsBytes.length);
        }
        return field;
    }

    /**
     * Check all the submitted data
     */
    function validateForm(Form memory form, einput input, bytes calldata inputProof) public {
        for (uint i = 0; i < form.fields.length; i++) {
            validateField(form.fields[i], input, inputProof);
        }
    }

    function validateField(Field memory field, einput input, bytes memory inputProof) public {
        if (field.encryptedInputType == EncryptedInputType.Eaddress) {
            eaddress encryptedAddress = TFHE.asEaddress(input, inputProof);
            validateEaddress(field.requirementId, encryptedAddress);
        } else if (field.encryptedInputType == EncryptedInputType.Ebool) {
            TFHE.asEbool(input, inputProof);
        } else if (field.encryptedInputType == EncryptedInputType.Euint64) {
            euint64 encryptedEuint = TFHE.asEuint64(input, inputProof);
            validateEuint64(field.requirementId, encryptedEuint);
        } else if (field.encryptedInputType == EncryptedInputType.Ebytes64) {
            ebytes64 encryptedEbytes = TFHE.asEbytes64(input, inputProof);
            validateEbytes64(field.requirementId, encryptedEbytes);
        }
    }

    /**
     *  Checks that the submitted address is not in one of the blacklisted values
     *  The return value returns an encrypted bool and plaintext bool, if the plaintext is true we accept it
     *  otherwise we have to rely on the encrypted value
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
        assert(requirementId < requirementsEuint.length);
        RequirementUint memory requirement = requirementsEuint[requirementId];
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
}
