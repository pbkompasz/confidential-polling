// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Poll.sol";
import { Benchmark } from "./Benchmark.sol";
import { IEvent } from "./interfaces/IEvent.sol";
import { Identity } from "./Identity.sol";
import { IForm } from "./interfaces/IForm.sol";
import { Storage } from "./Storage.sol";
import "hardhat/console.sol";

contract Entrypoint {

    event PollCreated(address indexed sender, address newValue);

    enum EventType {
        Benchmark,
        Poll
    }

    struct _Event {
        EventType eventType;
        address eventAddress;
        address host;
        address admin;
    }

    _Event[] private events;
    Identity private identityRegistry;
    address private identityRegistryAddress;
    Storage private onchainStorage;
    address private onchainStorageAddress;

    constructor(address passportVerifierAddress, address emailVerifierAddress) {
        identityRegistry = new Identity(passportVerifierAddress, emailVerifierAddress);
        identityRegistryAddress = address(identityRegistry);
        // onchainStorage = new Storage();
        // onchainStorageAddress = address(onchainStorage);
    }

    function getIdentityRegistryAddress() public view returns(address) {
        return identityRegistryAddress;
    }

    function createPoll(
        string memory _name,
        string memory _description,
        uint256 _maximumParticpants,
        uint8 _evaluationBatch,
        IEvent.EvaluationType _evaluationType,
        IEvent.ValidationType _validationType,
        IEvent.StorageType _storageType,
        uint256 _minSubmissions,
        bool _requirePassportValidation,
        bool _requireEmailValidation
    ) public returns (address) {
        Poll poll = new Poll(
            _name,
            _description,
            _maximumParticpants,
            _evaluationBatch,
            _evaluationType,
            _validationType,
            _storageType,
            _minSubmissions,
            _requirePassportValidation,
            _requireEmailValidation//,
            // onchainStorageAddress
        );
        _Event memory ev = _Event({
            eventType: EventType.Poll,
            eventAddress: address(poll),
            host: msg.sender,
            admin: msg.sender
        });
        events.push(ev);
        emit PollCreated(msg.sender, address(poll));
        return address(poll);
    }

    function addPoll(address pollAddress) public {
        // TODO Check not added
        _Event memory ev = _Event({
            eventType: EventType.Poll,
            eventAddress: pollAddress,
            host: msg.sender,
            admin: msg.sender
        });
        events.push(ev);
    }

    function createBenchmark() public {
        require(false);
    }

    function getEvents() public view returns (_Event[] memory) {
        return events;
    }

    function getEventsLength() public view returns (uint256) {
        return events.length;
    }

    function generateDemoEvents() public {
        // Partial poll
        address pollAddress = createPoll(
            "My poll",
            "Just polling",
            100,
            20,
            IEvent.EvaluationType.Lazy,
            IEvent.ValidationType.Lazy,
            IEvent.StorageType.Onchain,
            10,
            true,
            true
        );
        IForm.Field[] memory fields = new IForm.Field[](3);
        string[] memory genderValues = new string[](2);
        genderValues[0]  = "Male";
        genderValues[1]  = "Female";
        fields[0] = IForm.Field({
            name: "Gender",
            encryptedInputType: IForm.EncryptedInputType.Choice2,
            requirementId: 0,
            values: genderValues
        });
        string[] memory ageValues = new string[](4);
        ageValues[0]  = "18-29";
        ageValues[1]  = "30-44";
        ageValues[2]  = "45-59";
        ageValues[3]  = "60-75";
        fields[1] = IForm.Field({
            name: "Age",
            encryptedInputType: IForm.EncryptedInputType.Choice4,
            requirementId: 0,
            values: ageValues
        });
        string[] memory opinionValues = new string[](2);
        opinionValues[0]  = "Agree";
        opinionValues[1]  = "Disagree";
        fields[2] = IForm.Field({
            name: "Opinion",
            encryptedInputType: IForm.EncryptedInputType.Ebool,
            requirementId: 0,
            values: opinionValues
        });

        Poll(pollAddress).createForm(fields);
        Poll(pollAddress).startEvent();
    }
}
