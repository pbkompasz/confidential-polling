// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import { Forms } from "./Forms.sol";
import { Storage } from "./Storage.sol";
import { IEvent } from "./interfaces/IEvent.sol";

// Event -> Forms -> Fields
// submitData to a form -> if evaluate eagerly -> call evaluate  and increase lastEvaluated...
//                                     ongoing -> push data in toEvaluate, check if batchsize is reached and evaluate
//                                     lazy    -> evaluate at the end
// Event(address) -> Form(formId, mapping) -> Field(array)

contract Event is Forms, IEvent {
    bool private requiresPassportValdation;
    bool private requiresEmailValdation;

    Status private status;
    uint256 constant MIN_SUBMISSIONS = 10;
    string private name;
    string private description;
    uint256 private maximumParticiants;
    EvaluationType private evaluationType;
    ValidationType private validationType;
    StorageType private storageType;
    uint8 private evaluationBatch = 1;

    Submission[] private submissions;
    uint256 private minSubmissions = 0;
    uint256 private lastSubmissionEvaluated;

    Storage private onchainStorage;

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
        bool _requireEmailValidation//,
        // address _onchainStorageAddress
    ) {
        // require(_maximumParticpants > 0);
        // name = _name;
        // description = _description;
        // maximumParticiants = _maximumParticpants;
        // evaluationBatch = _evaulationBatch;
        // evaluationType = _evaluationType;
        // validationType = _validationType;
        // storageType = _storageType;
        // status = Status.Created;
        // minSubmissions = _minSubmissions;
        // requiresEmailValdation = _requireEmailValidation;
        // requiresPassportValdation = _requirePassportValidation;
        // onchainStorage = Storage(_onchainStorageAddress);
        // onchainStorage.createEventEntry();
    }

    function initEvent() public onlyOwner {
        require(status == Status.Created);
        status = Status.Initiated;
    }

    function startEvent() public onlyOwner {
        require(status == Status.Initiated);
        status = Status.Active;
    }

    function stopEvent() public onlyOwner {
        require(status == Status.Active);
        require(submissions.length > MIN_SUBMISSIONS);
        if (minSubmissions != 0) {
            require(submissions.length > minSubmissions);
        }
        status = Status.Finished;
    }

    function evaluateEvent() public onlyOwner {
        require(status == Status.Finished);
        require(evaluationType == EvaluationType.Lazy);
        // Go over fields and create possible binary values in plaintext
        // Go over all submitted formData and create statistics
    }

    function getStatus() public view returns (Status) {
        return status;
    }

    /**
     * Export the evaluation results
     */
    function exportResult() public view {}

    function submitData(Form calldata form, uint256 dataHash) public {
        // Lazy data validity checking
        require(validationType == ValidationType.Lazy);
        // Lazy evaluation
        require(evaluationType == EvaluationType.Lazy);
        // Off-chain storage, we need to append the Merkle tree
        require(storageType == StorageType.Offchain);
        // TODO Save to IMT

        onchainStorage.insert(form, dataHash);
    }

    function submitData(Form calldata form, FormData calldata formData) internal {
        // Off-chain storage, we need to append the Merkle tree
        require(storageType == StorageType.Onchain && storageType == StorageType.Hybrid);

        // Batching
        if (evaluationType == EvaluationType.Eager) {
            validateFormData(form, formData);
            evaluateFormData(form, formData);
        } else if (validationType == ValidationType.Eager) {
            validateFormData(form, formData);
        }

        onchainStorage.insert(form, formData);
    }

    function validateFormData(Form memory form, FormData memory formData) private {
        require(form.fields.length == formData.inputs.length);
        for (uint i = 0; i < form.fields.length; i++) {
            validateField(form.fields[i], formData.inputs[i], formData.inputProof);
        }
    }

    /**
     *
     * Mark data as ready to evaluate
     * @param form  Form
     * @param formData  Form data
     */
    function evaluateFormData(Form memory form, FormData memory formData) private {
        bytes memory inputProof = formData.inputProof;
        for (uint i = 0; i < form.fields.length; i++) {
            einput input = formData.inputs[i];
            Field memory field = form.fields[i];
            if (field.encryptedInputType == EncryptedInputType.Eaddress) {
                eaddress encryptedAddress = TFHE.asEaddress(input, inputProof);
            } else if (field.encryptedInputType == EncryptedInputType.Ebool) {
                TFHE.asEbool(input, inputProof);
            } else if (field.encryptedInputType == EncryptedInputType.Euint64) {
                euint64 encryptedEuint = TFHE.asEuint64(input, inputProof);
            } else if (field.encryptedInputType == EncryptedInputType.Ebytes64) {
                ebytes64 encryptedEbytes = TFHE.asEbytes64(input, inputProof);
            }
        }
    }
}
