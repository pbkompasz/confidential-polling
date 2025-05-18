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
    // TODO Might have to cast them beforehand
    struct EncryptedData {
        einput[] inputs;
        bytes inputProof;
    }

    // eventAddress => formId => IMT
    mapping(address => mapping(uint256 => LeanIMTData)) offchainData;
    // eventAddress => formId => user => formData[]
    mapping(address => mapping(uint256 => mapping(address => IForm.FormData[]))) onchainData;

    /**
     * The owner is the bundler
     */
    constructor() Ownable(msg.sender) {}

    function submitData(IForm.Form calldata form, uint256 dataHash) public {
        LeanIMT.insert(offchainData[msg.sender][form.id], dataHash);
    }

    function submitData(IForm.Form calldata form, IForm.FormData calldata formData) public {
        onchainData[msg.sender][form.id][tx.origin].push(formData);
    }

    function submitDataV2() public {}

    function createEventEntry() public {
        msg.sender;
    }
}
