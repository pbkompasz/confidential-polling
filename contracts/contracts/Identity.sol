// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IZKPassportVerifier, ProofVerificationParams } from "./interfaces/IIdentity.sol";

contract Identity {
    IZKPassportVerifier public zkPassportVerifier;

    // Map users to their verified unique identifiers
    mapping(address => bytes32) public userIdentifiers;

    constructor(address _verifierAddress, address emailVerifierAddress) {
        zkPassportVerifier = IZKPassportVerifier(_verifierAddress);
        // zkEmailVerifier = IZKEmailVerifier(_verifierAddress);
    }

    function registerPassport(ProofVerificationParams calldata params, bool isIDCard) public returns (bytes32) {
        // Verify the proof
        (bool verified, bytes32 uniqueIdentifier) = zkPassportVerifier.verifyProof(params);
        require(verified, "Proof is invalid");

        // Check the proof was generated using your domain name (scope) and the subscope
        // you specified
        require(zkPassportVerifier.verifyScopes(params.publicInputs, "your-domain.com", "my-scope"), "Invalid scope");

        // Get the age condition checked in the proof
        (uint256 currentDate, uint8 minAge, uint8 maxAge) = zkPassportVerifier.getAgeProofInputs(
            params.committedInputs,
            params.committedInputCounts
        );
        // Make sure the date used for the proof makes sense
        require(block.timestamp >= currentDate, "Date used in proof is in the future");
        // This is the condition for checking the age is 18 or above
        // Max age is set to 0 and therefore ignored in the proof, so it's equivalent to no upper limit
        // Min age is set to 18, so the user needs to be at least 18 years old
        require(minAge == 18 && maxAge == 0, "User needs to be above 18");

        // Get the disclosed bytes of data from the proof
        (, bytes memory disclosedBytes) = zkPassportVerifier.getDiscloseProofInputs(
            params.committedInputs,
            params.committedInputCounts
        );
        // Get the nationality from the disclosed data and ignore the rest
        // Passing the disclosed bytes returned by the previous function
        // this function will format it for you so you can use the data you need
        (, , string memory nationality, , , , , ) = zkPassportVerifier.getDisclosedData(disclosedBytes, isIDCard);

        // Store the unique identifier
        // Warning: the resulting transaction could be caught by someone else
        // in the mempool, essentially allowing someone else than intended to register
        // with the proof. We will soon provide a way to commit to custom data, so you can
        // bind the proof to the intended sender to prevent this.
        userIdentifiers[msg.sender] = uniqueIdentifier;

        return uniqueIdentifier;
    }

    function registerEmail() public {}
}
