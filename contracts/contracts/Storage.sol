// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

import { LeanIMT, LeanIMTData } from "./lean-imt/LeanIMT.sol";
import { IForm } from "./interfaces/IForm.sol";

/**
 * This will contain all the Merkle trees and onchain data
 * @title
 * @author
 * @notice
 */
contract Storage {
    // TODO Might have to cast them beforehand
    struct EncryptedData {
        einput[] inputs;
        bytes inputProof;
    }

    // Each user has a  has a dynamic incremental merkle tree
    mapping(address => mapping(uint256 => LeanIMTData)) dataTracker;
    mapping(address => mapping(address => mapping(uint256 => uint))) submissions;
    // Event -> Form -> User submission
    mapping(address => mapping(address => mapping(uint256 => EncryptedData))) encryptedData;

    constructor() {}

    function insert(uint256 formId, uint256 dataHash) public {
        // Check if user hasn't laready submitted
        // Event's id: msg.sender
        // Submitter: tx.origin
        uint256 resp = LeanIMT.insert(dataTracker[msg.sender][formId], dataHash);
        submissions[tx.origin][msg.sender][formId] = resp;
    }

    function insert(uint256 formId, einput[] calldata inputs, bytes calldata inputProof) public {
        // Event's id: msg.sender
        // Submitter: tx.origin
        EncryptedData memory encrypted = EncryptedData({ inputs: inputs, inputProof: inputProof });
        encryptedData[msg.sender][tx.origin][formId] = encrypted;
    }
}
