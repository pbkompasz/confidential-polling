// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";

contract MyContract is SepoliaZamaFHEVMConfig {
  constructor() {
    console.log("helo");
  }
}