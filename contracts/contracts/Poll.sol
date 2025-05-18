// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IPoll } from "./interfaces/IPoll.sol";
import { IEvent } from "./interfaces/IEvent.sol";
import { IForm } from "./interfaces/IForm.sol";

contract Poll is SepoliaZamaFHEVMConfig, IPoll, IEvent, IForm, Ownable {
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
        bool _requireEmailValidation //, // address _onchainStorageAddress
    ) Ownable(tx.origin) {
        require(_maximumParticpants > 0);
        name = _name;
        description = _description;
        maximumParticiants = _maximumParticpants;
        evaluationBatch = _evaulationBatch;
        evaluationType = _evaluationType;
        validationType = _validationType;
        storageType = _storageType;
        status = Status.Created;
        minSubmissions = _minSubmissions;
        requiresEmailValdation = _requireEmailValidation;
        requiresPassportValdation = _requirePassportValidation;
        // onchainStorage = Storage(_onchainStorageAddress);
        // onchainStorage.createEventEntry();
    }

    /**
     * Create a form that only containst fields w/ boolean and option values
     */
    function createForm(Field[] memory fields) public onlyOwner {
        forms.push();
        for (uint i = 0; i < fields.length; i++) {
            EncryptedInputType inputType = fields[i].encryptedInputType;
            // // Only form w/ boolean or option can be added
            // require(
            //     inputType == EncryptedInputType.Ebool ||
            //         inputType == EncryptedInputType.Choice2 ||
            //         inputType == EncryptedInputType.Choice4 ||
            //         inputType == EncryptedInputType.Choice8
            // );
            forms[forms.length - 1].fields.push(fields[i]);
        }
    }

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

    function getDetails() public view returns (bool, bool, Status, uint8 participantThreshold, bool isThresholdMet) {
        return (
            requiresEmailValdation,
            requiresPassportValdation,
            status,
            0,
            false
        );
    }

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

        // onchainStorage.insert(form, dataHash);
    }

    function submitData(Form calldata form, FormData calldata formData) internal {
        // Off-chain storage, we need to append the Merkle tree
        require(storageType == StorageType.Onchain && storageType == StorageType.Hybrid);

        // Batching
        if (evaluationType == EvaluationType.Eager) {
            validateFormData(form, formData);
            // evaluateFormData(form, formData);
        } else if (validationType == ValidationType.Eager) {
            validateFormData(form, formData);
        }

        // onchainStorage.insert(form, formData);
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

    RequirementBytes[] requirementsBytes;
    RequirementAddress[] requirementsAddress;
    RequirementUint[] requirementsEuint;

    uint8 constant MAX_FIELDS = 10;

    // This are confidential constants that have to be defined at runtime
    euint8 ZERO;
    euint8 ONE;
    ebool TRUE;
    ebool FALSE;

    // ZERO = TFHE.asEuint8(0);
    // ONE = TFHE.asEuint8(1);
    // TRUE = TFHE.asEbool(true);
    // FALSE = TFHE.asEbool(false);

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
