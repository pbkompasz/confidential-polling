// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Poll } from "./Poll.sol";
import { Benchmark } from "./Benchmark.sol";
import { IEvent } from "./interfaces/IEvent.sol";
import { Identity } from "./Identity.sol";
import { IForm } from "./interfaces/IForm.sol";

contract Entrypoint {
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

    constructor(address passportVerifierAddress, address emailVerifierAddress) {
        // Create identity registry
        identityRegistry = new Identity(passportVerifierAddress, emailVerifierAddress);
    }

    function createPoll(
        string memory _name,
        string memory _description,
        uint256 _maximumParticpants,
        uint8 _evaulationBatch,
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
            _evaulationBatch,
            _evaluationType,
            _validationType,
            _storageType,
            _minSubmissions,
            _requirePassportValidation,
            _requireEmailValidation
        );
        _Event memory ev = _Event({
            eventType: EventType.Poll,
            eventAddress: address(poll),
            host: msg.sender,
            admin: msg.sender
        });
        events.push(ev);

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
        fields[0] = IForm.Field({
            name: "Gender",
            encryptedInputType: IForm.EncryptedInputType.Choice2,
            requirementId: 0
        });
        fields[1] = IForm.Field({
            name: "Age",
            encryptedInputType: IForm.EncryptedInputType.Choice4,
            requirementId: 0
        });
        fields[2] = IForm.Field({
            name: "Opinion",
            encryptedInputType: IForm.EncryptedInputType.Ebool,
            requirementId: 0
        });

        Poll(pollAddress).createForm(fields);
    }
}
