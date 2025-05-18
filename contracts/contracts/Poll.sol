// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IPoll } from "./interfaces/IPoll.sol";
import { IEvent } from "./interfaces/IEvent.sol";
import { IForm } from "./interfaces/IForm.sol";

contract Poll is SepoliaZamaFHEVMConfig, IPoll, IEvent, IForm, Ownable {
    uint256 constant MIN_SUBMISSIONS = 10;
    uint8 constant MAX_FIELDS = 10;

    EvaluationType private evaluationType;
    ValidationType private validationType;
    StorageType private storageType;
    Status private status;

    string private name;
    string private description;

    bool private requiresPassportValdation;
    bool private requiresEmailValdation;

    uint256 private maximumParticipants;
    uint256 private evaluationBatch = 1;
    uint256 private minSubmissions = 0;
    uint256 private lastSubmissionEvaluated;

    Submission[] private submissions;
    address[] analysts;
    Form[] private forms;
    RequirementBytes[] requirementsBytes;
    RequirementAddress[] requirementsAddress;
    RequirementUint[] requirementsEuint;

    // This are confidential constants that have to be defined at runtime
    euint8 ZERO;
    euint8 ONE;
    ebool TRUE;
    ebool FALSE;

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
        maximumParticipants = _maximumParticpants;
        evaluationBatch = _evaulationBatch;
        evaluationType = _evaluationType;
        validationType = _validationType;
        storageType = _storageType;
        status = Status.Planned;
        minSubmissions = _minSubmissions;
        requiresEmailValdation = _requireEmailValidation;
        requiresPassportValdation = _requirePassportValidation;

        // ZERO = TFHE.asEuint8(0);
        // ONE = TFHE.asEuint8(1);
        // TRUE = TFHE.asEbool(true);
        // FALSE = TFHE.asEbool(false);

        // onchainStorage = Storage(_onchainStorageAddress);
        // onchainStorage.createEventEntry();
    }

    function registerAnalysts(address analyst) public onlyOwner {
        analysts.push(analyst);
    }

    /**
     * Create a form that only containst fields w/ boolean and option values
     */
    function createForm(Field[] memory fields) public {
        forms.push();
        for (uint i = 0; i < fields.length; i++) {
            EncryptedInputType inputType = fields[i].encryptedInputType;
            require(
                inputType == EncryptedInputType.Ebool ||
                    inputType == EncryptedInputType.Choice2 ||
                    inputType == EncryptedInputType.Choice4 ||
                    inputType == EncryptedInputType.Choice8
            );
            forms[forms.length - 1].mainField = 0;
            forms[forms.length - 1].fields.push(fields[i]);
        }
    }

    /**
     * Remove a field from a form
     * TODO
     * @param formId Form id
     * @param fieldId Field id
     */
    function removeField(uint256 formId, uint256 fieldId) public onlyOwner {
        require(false);
    }

    /**
     * Start event
     */
    function startEvent() public {
        require(status == Status.Planned);
        status = Status.Live;
    }

    /**
     * Stop event
     */
    function stopEvent() public {
        require(status == Status.Live);
        require(submissions.length > MIN_SUBMISSIONS);
        if (minSubmissions != 0) {
            require(submissions.length > minSubmissions);
        }
        status = Status.Completed;
    }

    /**
     *
     * Submit offchain data's hash
     * @param formId Form id
     * @param dataHash Submitted data hash
     */
    function submitDataOffchain(uint256 formId, bytes32 dataHash) public {
        // Lazy data validity checking
        require(validationType == ValidationType.Lazy);
        // Lazy evaluation
        require(evaluationType == EvaluationType.Lazy);
        // Off-chain storage, we need to append the Merkle tree
        require(storageType == StorageType.Offchain);

        // onchainStorage.insert(form, dataHash);
    }

    /**
     * Submit data in batches
     * @param formId Form id
     * @param formData Form data
     */
    function submitDataOnchain(uint256 formId, FormData calldata formData) public {
        // Off-chain storage, we need to append the Merkle tree
        require(storageType == StorageType.Onchain || storageType == StorageType.Hybrid);
        // Check the batch size meets minimum

        // validateFormData(form, formData);

        // onchainStorage.insert(form, formData);
    }

    /**
     * Validate form data
     * @param form Form
     * @param formData Form data, an array of einputs w/ input proof
     */
    function validateFormData(Form memory form, FormData memory formData) public {
        require(form.fields.length == formData.inputs.length);
        for (uint i = 0; i < form.fields.length; i++) {
            validateField(form.fields[i], formData.inputs[i], formData.inputProof);
        }
    }

    // TODO Move to analytics
    // /**
    //  *
    //  * Mark data as ready to evaluate
    //  * @param form  Form
    //  * @param formData  Form data
    //  */
    // function evaluateFormData(Form memory form, FormData memory formData) private {
    //     bytes memory inputProof = formData.inputProof;
    //     for (uint i = 0; i < form.fields.length; i++) {
    //         einput input = formData.inputs[i];
    //         Field memory field = form.fields[i];
    //         if (field.encryptedInputType == EncryptedInputType.Eaddress) {
    //             eaddress encryptedAddress = TFHE.asEaddress(input, inputProof);
    //         } else if (field.encryptedInputType == EncryptedInputType.Ebool) {
    //             TFHE.asEbool(input, inputProof);
    //         } else if (field.encryptedInputType == EncryptedInputType.Euint64) {
    //             euint64 encryptedEuint = TFHE.asEuint64(input, inputProof);
    //         } else if (field.encryptedInputType == EncryptedInputType.Ebytes64) {
    //             ebytes64 encryptedEbytes = TFHE.asEbytes64(input, inputProof);
    //         }
    //     }
    // }

    /**
     * Validate field based on encrypted data
     * This is done by checking if it can be cast and that it passes the requirements
     * @param field Field
     * @param input Ecnrypted input
     * @param inputProof Input proof
     */
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
    function validateEbytes64(
        uint256 requirementId,
        ebytes64 encrytpedEbytes64
    ) private returns (ebool encryptedPassed, bool passed) {
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

    /**
     * Get role of a user
     * TODO return enum
     * @param userAddress User address
     */
    function getEventUserRole(address userAddress) public view returns (string memory) {
        if (userAddress == owner()) {
            return "HOST";
        }
        for (uint i = 0; i < analysts.length; i++) {
            if (analysts[i] == userAddress) {
                return "ANALYST";
            }
        }
        return "USER";
    }

    /**
     * Get form by id
     */
    function getForm(uint256 formId) public view returns (Form memory _form) {
        return forms[formId];
    }

    /**
     * Get forms
     */
    function getForms() public view returns (Form[] memory _forms) {
        return forms;
    }

    /**
     * Get details
     * @return _name
     * @return _status
     * @return _eventType
     * @return _noParticipants
     * @return _requiresEmailValdation
     * @return _requiresPassportValdation
     */
    function getDetails()
        public
        view
        returns (
            string memory _name,
            Status _status,
            string memory _eventType,
            uint256 _noParticipants,
            bool _requiresEmailValdation,
            bool _requiresPassportValdation
        )
    {
        return (name, status, "POLL", 0, requiresEmailValdation, requiresPassportValdation);
    }

    /**
     * Get all details
     */
    function getDetailsFull() public view returns (EventDetails memory) {
        return
            EventDetails({
                name: name,
                description: description,
                host: owner(),
                maximumParticipants: maximumParticipants,
                evaluationType: evaluationType,
                validationType: validationType,
                storageType: storageType,
                evaluationBatch: evaluationBatch,
                minSubmissions: minSubmissions,
                lastSubmissionEvaluated: lastSubmissionEvaluated,
                eventType: "POLL",
                requiresEmailValdation: requiresEmailValdation,
                requiresPassportValdation: requiresPassportValdation,
                status: status,
                // participationThreshold: participationThreshold,
                participationThreshold: 0,
                // isThresholdMet: isThresholdMet,
                isThresholdMet: true,
                eventAddress: address(this)
            });
    }

    /**
     * Create a field
     * @param _name Name of the field
     * @param encryptedInputType Encrypted input type
     * @param requirementId Requirement id
     * @param values Possible values
     */
    function createField(
        string memory _name,
        EncryptedInputType encryptedInputType,
        uint256 requirementId,
        string[] memory values
    ) private view onlyOwner returns (Field memory) {
        Field memory field = Field(_name, encryptedInputType, requirementId, values);
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
     * Get status of the poll e.g. planned, live, completed
     */
    function getStatus() public view returns (Status) {
        return status;
    }
}
