// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// import { IForm } from "./interfaces/IForm.sol";
import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/config/ZamaGatewayConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";


contract Analytics is SepoliaZamaFHEVMConfig, SepoliaZamaGatewayConfig, GatewayCaller {
    uint8 BINARY_SEPARATOR = 10;
    uint8 CHOICE2_SEPARATOR = 10;
    uint8 CHOICE4_SEPARATOR = 100;
    uint16 CHOICE8_SEPARATOR = 1000;
    euint8 bINARY_SEPARATOR_ENCRYPTED;
    euint8 cHOICE2_SEPARATOR_ENCRYPTED;
    euint8 cHOICE4_SEPARATOR_ENCRYPTED;
    euint16 cHOICE8_SEPARATOR_ENCRYPTED;
    euint16 constraint;

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

    // function createQueryConstraint(
    //     IForm.Field[] memory fields,
    //     uint256[] memory constraintFields,
    //     uint8[] memory constraintValues //,
    // ) public view returns (uint16) {
    //     uint16 constraint;
    //     for (uint i = 0; i < constraintFields.length; i++) {
    //         IForm.Field memory field = fields[constraintFields[i]];
    //         if (field.encryptedInputType == IForm.EncryptedInputType.Ebool) {
    //             constraint = constraint * BINARY_SEPARATOR + constraintValues[i];
    //         } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice2) {
    //             constraint = constraint * CHOICE2_SEPARATOR + constraintValues[i];
    //         } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice4) {
    //             constraint = constraint * CHOICE4_SEPARATOR + constraintValues[i];
    //         } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice8) {
    //             constraint = constraint * CHOICE8_SEPARATOR + constraintValues[i];
    //         }
    //     }

    //     return constraint;
    // }

    /**
     *  Create the values that will be XOR with the constraint
     */
    function createEncryptedQueryConstraint(
        // IForm.Field[] memory fields,
        uint256[] memory constraintFields,
        einput input,
        bytes calldata inputProof // IForm.FormData memory data
    ) public {
        // TFHE.allowThis(bINARY_SEPARATOR_ENCRYPTED);
        // require(
        //     TFHE.isSenderAllowed(bINARY_SEPARATOR_ENCRYPTED),
        //     "The caller is not authorized to access this encrypted amount."
        // );
        euint16 value = TFHE.asEuint16(input, inputProof);
        TFHE.allowThis(value);
        // require(TFHE.isSenderAllowed(constraint), "The caller is not authorized to access this encrypted amount2.");
        for (uint i = 0; i < constraintFields.length; i++) {
            // IForm.Field memory field = fields[constraintFields[i]];
        //     if (field.encryptedInputType == IForm.EncryptedInputType.Ebool) {
        //         // euint16 value = TFHE.asEuint16(input, inputProof);
        //         // TFHE.allowThis(value);
        //         // constraint = TFHE.mul(
        //         //     constraint,
        //         //     TFHE.add(bINARY_SEPARATOR_ENCRYPTED, value)
        //         // );
        //         // TFHE.mul(bINARY_SEPARATOR_ENCRYPTED, bINARY_SEPARATOR_ENCRYPTED);
        //     } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice2) {
        //         // constraint = TFHE.mul(
        //         //     constraint,
        //         //     TFHE.add(cHOICE2_SEPARATOR_ENCRYPTED, TFHE.asEuint16(data.inputs[i], data.inputProof))
        //         // );
        //     } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice4) {
        //         // constraint = TFHE.mul(
        //         //     constraint,
        //         //     TFHE.add(cHOICE4_SEPARATOR_ENCRYPTED, TFHE.asEuint16(data.inputs[i], data.inputProof))
        //         // );
        //     } else if (field.encryptedInputType == IForm.EncryptedInputType.Choice8) {
        //         // constraint = TFHE.mul(
        //         //     constraint,
        //         //     TFHE.add(cHOICE8_SEPARATOR_ENCRYPTED, TFHE.asEuint16(data.inputs[i], data.inputProof))
        //         // );
        //     }
        }

        // return constraint;
    }

    // TODO Check cache
    // Return value?
    // TODO Batches
    function sum(
        // IForm.Field[] memory fields,
        // IForm.FormData[] memory data,
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
