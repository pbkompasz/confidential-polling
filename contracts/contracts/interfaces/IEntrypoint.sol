// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEntrypoint {
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
}
