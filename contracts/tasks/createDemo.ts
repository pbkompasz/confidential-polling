import { ethers } from "ethers";
import { task, types } from "hardhat/config";

import { ACCOUNT_NAMES } from "../test/constants";

task("create-demo", "Create demo scenario")
  .addParam("contract", "The contract address")
  .setAction(async ({ contract }, hre) => {
    let result;

    const signers = await hre.ethers.getSigners();

    const alice = signers[0]
    const bob = signers[1]
    const carol = signers[2]

    const ContractFactory = await hre.ethers.getContractFactory("Entrypoint");
    const contractInstance = ContractFactory.attach(contract).connect(alice);
    

    // Register host, user and analyst
    // Create event as Alice
    if (!contractInstance["createPoll"]) {
      console.error(`Method createPoll not found on contract.`);
      return;
    }
    result = await contractInstance["generateDemoEvents"]();

    // Add an onchain form
    const poll = await contractInstance["getEvents"]();

    const PollContractFactory = await hre.ethers.getContractFactory("Poll");
    let pollContractInstance = PollContractFactory.attach(poll[0][1]).connect(bob);

    pollContractInstance = PollContractFactory.attach(poll[0][1]).connect(alice);
    
    // // Register Carol as analyst
    result = await pollContractInstance["registerAnalysts"](carol.address);


    // Create an offchain benchmark

    // Add form

    // Add "submitted data" to offchain benchmark


    console.info("\nDemo scenario created:");
    console.info("================");
  });
