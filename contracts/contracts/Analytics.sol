// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IForm } from "./interfaces/IForm.sol";
import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/config/ZamaGatewayConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";

contract Analytics is SepoliaZamaFHEVMConfig, SepoliaZamaGatewayConfig, GatewayCaller {
    euint8 bINARY_SEPARATOR_ENCRYPTED;
    euint8 cHOICE2_SEPARATOR_ENCRYPTED;
    euint8 cHOICE4_SEPARATOR_ENCRYPTED;
    euint16 cHOICE8_SEPARATOR_ENCRYPTED;
    euint16 encryptedConstraint;

    enum QueryOperation {
        SUM,
        AVG,
        MAX,
        MIN,
        COUNT
    }

    constructor() {
        bINARY_SEPARATOR_ENCRYPTED = TFHE.asEuint8(10);
        TFHE.allowThis(bINARY_SEPARATOR_ENCRYPTED);
        cHOICE2_SEPARATOR_ENCRYPTED = TFHE.asEuint8(10);
        TFHE.allowThis(cHOICE2_SEPARATOR_ENCRYPTED);
        cHOICE4_SEPARATOR_ENCRYPTED = TFHE.asEuint8(100);
        TFHE.allowThis(cHOICE4_SEPARATOR_ENCRYPTED);
        cHOICE8_SEPARATOR_ENCRYPTED = TFHE.asEuint16(1000);
        TFHE.allowThis(cHOICE8_SEPARATOR_ENCRYPTED);
    }

    function createQueryConstraint(
        IForm.Field[] memory fields,
        uint256[] memory constraintFields,
        uint8[] memory constraintValues //,
    ) public view returns (uint16) {
        uint16 constraint = 0;
        for (uint i = 0; i < constraintFields.length; i++) {
            IForm.Field memory field = fields[constraintFields[i]];
            if (field.encryptedInputType == IForm.EncryptedInputType.Ebool) {
                constraint = (constraint << 1) | constraintValues[i];
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice2) {
                constraint = (constraint << 1) | constraintValues[i];
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice4) {
                constraint = (constraint << 2) | constraintValues[i];
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice8) {
                constraint = (constraint << 3) | constraintValues[i];
            }
        }

        return constraint;
    }

    /**
     *  Create the values that will be XOR with the constraint
     */
    function createEncryptedQueryConstraint(
        IForm.Field[] memory fields,
        uint256[] memory constraintFields,
        IForm.FormData memory data
    ) public {
        encryptedConstraint = TFHE.asEuint16(0);
        for (uint i = 0; i < constraintFields.length; i++) {
            IForm.Field memory field = fields[constraintFields[i]];
            euint16 value = TFHE.asEuint16(data.inputs[i], data.inputProof);
            if (field.encryptedInputType == IForm.EncryptedInputType.Ebool) {
                encryptedConstraint = TFHE.or(TFHE.shl(encryptedConstraint, 1), value);
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice2) {
                encryptedConstraint = TFHE.or(TFHE.shl(encryptedConstraint, 1), value);
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice4) {
                encryptedConstraint = TFHE.or(TFHE.shl(encryptedConstraint, 2), value);
            } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice8) {
                encryptedConstraint = TFHE.or(TFHE.shl(encryptedConstraint, 3), value);
            }
        }
    }

    function getEncryptedConstraint() public view returns (euint16) {
      return encryptedConstraint;
    }

    // TODO Check cache
    // Return value?
    // TODO Batches
    // TODO Check if storage contains data
    function sum(
        IForm.Field[] memory fields,
        IForm.FormData[] memory data,
        uint256[] memory constraintFields,
        uint8[] memory constraintValues
    ) public {
        // Create encrypted constraint
        // Encrypt check constraint
        // XOR w/ each data's constrain euint8
        // TFHE.sum(acc, TFHE.mul(TFHE.xor(constraint, tConstraint), data[i]));
        // operation(fields, data, constraintFields, constraintValues, 0, QueryOperation.COUNT);
    }

    function operation(
        // IForm.Field[] memory fields,
        // IForm.FormData[] memory data,
        uint256[] memory constraintFields,
        uint8[] memory constraintValues,
        uint256 operationField,
        QueryOperation operationType
    ) public {
        euint64 acc = TFHE.asEuint64(0);
        // uint16 constraint = createQueryConstraint(fields, constraintFields, constraintValues);
        // euint16 encryptedConstraint = TFHE.asEuint16(constraint);
        // for (uint i = 0; i < data.length; i++) {
        //     // euint16 tConstraint = createEncryptedQueryConstraint(fields, constraintFields, data[i]);
        //     euint16 tConstraint = createEncryptedQueryConstraint(fields, constraintFields);
        //     euint64 value = TFHE.asEuint64(data[i].inputs[operationField], data[i].inputProof);
        //     if (operationType == QueryOperation.SUM) {
        //         TFHE.add(acc, TFHE.mul(TFHE.xor(encryptedConstraint, tConstraint), value));
        //     } else if (operationType == QueryOperation.AVG) {
        //         TFHE.add(acc, TFHE.mul(TFHE.xor(encryptedConstraint, tConstraint), value));
        //         TFHE.add(acc, TFHE.asEuint64(TFHE.xor(constraint, tConstraint)));
        //     } else if (operationType == QueryOperation.MAX) {
        //         // TODO
        //         // TFHE.add(acc, TFHE.mul(TFHE.xor(constraint, tConstraint), data[i]));
        //     } else if (operationType == QueryOperation.MIN) {
        //         // TODO
        //         // TFHE.add(acc, TFHE.mul(TFHE.xor(constraint, tConstraint), data[i]));
        //     } else if (operationType == QueryOperation.COUNT) {
        //         TFHE.add(acc, TFHE.asEuint64(TFHE.xor(constraint, tConstraint)));
        //     }
        // }
    }
}
