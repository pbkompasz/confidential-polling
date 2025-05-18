// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IForm } from "./interfaces/IForm.sol";
import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import "fhevm/config/ZamaGatewayConfig.sol";
import "fhevm/gateway/GatewayCaller.sol";

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
        Node[] childNodes;
    }

    constructor() {}

    function createTree(IForm.Field[] memory fields) public returns (uint16) {
        Node memory root = Node({ value: 0, field: 0, childNodes: new Node[](0) });
        Node[] memory nodes = new Node[](fields.length * 8);
        nodes[0] = root;
        _insertNode(fields, nodes, 0, 0);
    }

    function _insertNode(IForm.Field[] memory fields, Node[] memory nodes, uint256 pos, uint256 fieldPos) internal {
        if (fields[fieldPos].encryptedInputType == IForm.EncryptedInputType.Ebool) {
            // nodes[pos].childNodes.push(Node({ value: 0, field: nodes[pos].field, childNodes: new Node[](0) }));
            // _insertNode(fields, nodes, );
        }
    }

    function appendToTree() public {}

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
