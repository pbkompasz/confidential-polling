// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Forms } from "./Forms.sol";
import { IPoll } from "./interfaces/IPoll.sol";
import { Event } from "./Event.sol";

contract Poll is SepoliaZamaFHEVMConfig, Forms, IPoll, Event {
    // Examples
    // euint8 IS_MALE = 1
    // euint8 IS_OVER_18 = 10
    // euint8 IS_EMPLOYED = 100
    // Some who is all three 111
    // Female employed minor 100

    Form[] private forms;

    /**
     * Create the bit fields for each binary constraint
     *  Set the IMT root
     * Set the evaluation type
     */
    constructor(
        string memory _name,
        string memory _description,
        uint256 _maximumParticpants,
        uint8 _evaulationBatch,
        EvaluationType _evaluationType,
        ValidationType _validationType,
        StorageType _storageType,
        uint256 _minSubmissions,
        bool _requirePassportValidation,
        bool _requireEmailValidation
    )
        Event(
            _name,
            _description,
            _maximumParticpants,
            _evaulationBatch,
            _evaluationType,
            _validationType,
            _storageType,
            _minSubmissions,
            _requirePassportValidation,
            _requireEmailValidation
        )
    {}

    /**
     * Create a form that only containst fields w/ boolean and option values
     */
    function createForm(Field[] memory fields) public onlyOwner {
        forms.push();
        for (uint i = 0; i < fields.length; i++) {
            EncryptedInputType inputType = fields[i].encryptedInputType;
            // Only form w/ boolean or option can be added
            require(
                inputType == EncryptedInputType.Ebool ||
                    inputType == EncryptedInputType.Choice2 ||
                    inputType == EncryptedInputType.Choice4 ||
                    inputType == EncryptedInputType.Choice8
            );
            forms[forms.length - 1].fields.push(fields[i]);
        }
    }

    /**
     * Change name, or requirements
     * @param formId Form id
     */
    function editField(uint256 formId) public onlyOwner {
        require(false);
    }

    function removeField(uint256 formId, uint256 fieldId) public onlyOwner {
        require(false);
    }

    function getForm(uint256 formId) public view returns (Form memory) {
        return forms[formId];
    }

    function getForms() public view returns (Form[] memory) {
        return forms;
    }
}
