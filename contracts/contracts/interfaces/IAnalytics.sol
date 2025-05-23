// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

interface IAnalytics {
    function evaluateData(einput[] memory inputs, bytes memory inputProof) external;
}
