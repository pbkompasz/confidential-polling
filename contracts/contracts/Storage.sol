// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { LeanIMT, LeanIMTData } from "./lean-imt/LeanIMT.sol";
import { IForm } from "./interfaces/IForm.sol";

/**
 * This will contain all the Merkle trees and onchain data
 * @title
 * @author
 * @notice
 */
contract Storage is Ownable {
    struct OffchainData {
        uint256 databaseId;
    }

    // eventAddress => formId => IMT
    mapping(address => mapping (uint256 => mapping (address => bytes32))) dataRegistry;
    // eventAddress => formId => user => formData[]
    mapping(bytes32 => IForm.FormData) onchainData;
    mapping(bytes32 => OffchainData) offchainData;

    /**
     * The owner is the bundler
     */
    constructor() Ownable(msg.sender) {}

    /**
     * Submit the hash of an encrypted data
     * @param form Form
     * @param owner Owner
     * @param dataHash  hash of data
     */
    function submitData(address eventAddress, IForm.Form calldata form, address owner, bytes32 dataHash, uint256 databaseId) public {
        require(dataRegistry[eventAddress][form.id][owner] == dataHash);
        offchainData[dataRegistry[eventAddress][form.id][owner]] = OffchainData({
            databaseId: databaseId
        });
    }

    function submitData(address eventAddress, IForm.Form calldata form, address owner, IForm.FormData calldata formData) public {
        // uint256 dataHash = hash(formData);
        // require(dataHash == dataRegistry[eventAddress][form.id][owner]);
        onchainData[dataRegistry[eventAddress][form.id][owner]] = formData;
    }

    function createDataEntry(address eventAddress, uint256 formId, bytes32 dataHash) public {
        dataRegistry[eventAddress][formId][msg.sender] = dataHash;
    }
}
