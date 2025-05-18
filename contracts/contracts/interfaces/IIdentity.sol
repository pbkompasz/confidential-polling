// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
enum ProofType {
    DISCLOSE,
    AGE,
    BIRTHDATE,
    EXPIRY_DATE,
    NATIONALITY_INCLUSION,
    NATIONALITY_EXCLUSION,
    ISSUING_COUNTRY_INCLUSION,
    ISSUING_COUNTRY_EXCLUSION
}

struct ProofVerificationParams {
    bytes32 vkeyHash;
    bytes proof;
    bytes32[] publicInputs;
    bytes committedInputs;
    uint256[] committedInputCounts;
    uint256 validityPeriodInDays;
    string scope;
    string subscope;
    bool devMode;
}

struct Profiles {
    bytes emailProof;
    bytes passportProof;
}

interface IZKPassportVerifier {
    // Verify the proof
    function verifyProof(
        ProofVerificationParams calldata params
    ) external returns (bool verified, bytes32 uniqueIdentifier);

    // Get the inputs for the age proof
    function getAgeProofInputs(
        bytes calldata committedInputs,
        uint256[] calldata committedInputCounts
    ) external view returns (uint256 currentDate, uint8 minAge, uint8 maxAge);

    // Get the inputs for the disclose proof
    function getDiscloseProofInputs(
        bytes calldata committedInputs,
        uint256[] calldata committedInputCounts
    ) external pure returns (bytes memory discloseMask, bytes memory discloseBytes);

    // Get the disclosed data from the proof
    function getDisclosedData(
        bytes calldata discloseBytes,
        bool isIDCard
    )
        external
        view
        returns (
            string memory name,
            string memory issuingCountry,
            string memory nationality,
            string memory gender,
            string memory birthDate,
            string memory expiryDate,
            string memory documentNumber,
            string memory documentType
        );

    // Get the inputs for the nationality/issuing country inclusion and exclusion proofs
    function getCountryProofInputs(
        bytes calldata committedInputs,
        uint256[] calldata committedInputCounts,
        ProofType proofType
    ) external pure returns (string[] memory countryList);

    // Get the inputs for the birthdate and expiry date proofs
    function getDateProofInputs(
        bytes calldata committedInputs,
        uint256[] calldata committedInputCounts,
        ProofType proofType
    ) external pure returns (uint256 currentDate, uint256 minDate, uint256 maxDate);

    // Verify the scope of the proof
    function verifyScopes(
        bytes32[] calldata publicInputs,
        string calldata domain,
        string calldata scope
    ) external view returns (bool);
}
