// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IForm } from "./interfaces/IForm.sol";
import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/config/ZamaGatewayConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";
import "hardhat/console.sol";

// How it works
// Create a tree for a form's fields
// Insert formData into field, go over the fields, and calculate the correct node
// Run operations e.g. SUM, AVG, on the evaluated data

/**
 * A tree is constructed where each branch represents a possible data point. For example if a field takes 3 answers a decision node would have 3 branches.
 * Each node has a child node or is a terminal node that contains all the `formData`s data match all the field values.
 * @title
 * @author
 * @notice
 */
contract AnalyticsV2 is SepoliaZamaFHEVMConfig, SepoliaZamaGatewayConfig, GatewayCaller {
    enum QueryOperation {
        SUM,
        AVG,
        MAX,
        MIN,
        COUNT
    }

    struct Node {
        uint value;
        uint256 field;
        uint256[8] childNodes;
    }

    constructor() {}

    // R
    // Insert root's children
    // R 1 2
    // Insert 1's children
    // R 1 2 3 4
    // Insert 2's children
    // R 1 2 3 4 5 6

    function createTree(IForm.Field[] memory fields) public view returns (Node[] memory _nodes) {
        uint256[8] memory emptyArray;
        Node memory root = Node({ value: 0, field: 0, childNodes: emptyArray });
        uint256 latest = 1;
        uint256 total = 1;
        for (uint i = 0; i < fields.length; i++) {
            if (fields[i].encryptedInputType == IForm.EncryptedInputType.Ebool) {
                total = total + latest * 2;
                latest = 2;
            }
            if (fields[i].encryptedInputType == IForm.EncryptedInputType.Choice2) {
                total = total + latest * 2;
                latest = 2;
            }
            if (fields[i].encryptedInputType == IForm.EncryptedInputType.Choice4) {
                total = total + latest * 4;
                latest = 4;
            }
            if (fields[i].encryptedInputType == IForm.EncryptedInputType.Choice8) {
                total = total + latest * 8;
                latest = 8;
            }
        }
        Node[] memory nodes = new Node[](total);
        nodes[0] = root;
        uint256 pushPos = 1;
        for (uint i = 0; i < total; i++) {
            Node memory node = nodes[i];
            console.log(i, node.field, pushPos);
            if (node.field == fields.length || pushPos >= total) {
                continue;
            }
            if (fields[node.field].encryptedInputType == IForm.EncryptedInputType.Ebool) {
                uint[8] memory children;
                children[0] = pushPos;
                children[1] = pushPos + 1;
                node.childNodes = children;
                uint256[8] memory emptyArray2;
                nodes[pushPos] = Node({ value: 0, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 1] = Node({ value: 1, field: node.field + 1, childNodes: emptyArray2 });
                pushPos = pushPos + 2;
            }
            if (fields[node.field].encryptedInputType == IForm.EncryptedInputType.Choice8) {
                uint[8] memory children;
                children[0] = pushPos;
                children[1] = pushPos + 1;
                children[2] = pushPos + 2;
                children[3] = pushPos + 3;
                children[4] = pushPos + 4;
                children[5] = pushPos + 5;
                children[6] = pushPos + 6;
                children[7] = pushPos + 7;
                node.childNodes = children;
                uint256[8] memory emptyArray2;
                nodes[pushPos] = Node({ value: 0, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 1] = Node({ value: 1, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 2] = Node({ value: 2, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 3] = Node({ value: 3, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 4] = Node({ value: 4, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 5] = Node({ value: 5, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 6] = Node({ value: 6, field: node.field + 1, childNodes: emptyArray2 });
                nodes[pushPos + 7] = Node({ value: 7, field: node.field + 1, childNodes: emptyArray2 });
                pushPos = pushPos + 8;
            }
        }

        return nodes;
    }

    // NOTE Should only be called in batches
    function appendToTree(Node[] memory tree, IForm.Field[] memory fields, IForm.FormData memory formData) public {
        for (uint i = 0; i < fields.length; i++) {
            // if (fields[i].encryptedInputType == IForm.EncryptedInputType.Eaddress) {
            //     eaddress encryptedAddress = TFHE.asEaddress(formData.inputs[i], formData.inputProof);
            // } else if (fields[i].encryptedInputType == IForm.EncryptedInputType.Ebool) {
            //     TFHE.asEbool(formData.inputs[i], formData.inputProof);
            // } else if (fields[i].encryptedInputType == IForm.EncryptedInputType.Euint64) {
            //     euint64 encryptedEuint = TFHE.asEuint64(formData.inputs[i], formData.inputProof);
            // } else if (fields[i].encryptedInputType == IForm.EncryptedInputType.Ebytes64) {
            //     ebytes64 encryptedEbytes = TFHE.asEbytes64(formData.inputs[i], formData.inputProof);
            // }
            euint64 encryptedEuint = TFHE.asEuint64(formData.inputs[i], formData.inputProof);

        }
    }

    function sum(
        IForm.Field[] memory fields,
        IForm.FormData[] memory data,
        uint256[] memory constraintFields,
        uint8[] memory constraintValues
    ) public {}

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
