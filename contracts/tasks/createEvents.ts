import { task, types } from "hardhat/config";

import { ACCOUNT_NAMES } from "../test/constants";
import { ethers } from "ethers";

task("create-events", "Create events")
  .addParam("contract", "The contract address")
  .setAction(async ({ contract }, hre) => {
    const events = [];
    // Completed event

    const [deployer] = await hre.ethers.getSigners();
    const ContractFactory = await hre.ethers.getContractFactory("Entrypoint");
    const contractInstance = ContractFactory.attach(contract).connect(deployer);

    const result = await contractInstance["generateDemoEvents"]({
      gasLimit: 5_000_000, // you can increase this if needed
    });

    // if (!contractInstance["createPoll"]) {
    //   console.error(`Method createPoll not found on contract.`);
    //   return;
    // }

    // // const result = await contractInstance["createPoll"](...["My poll", "Just polling", 100, 20, 0, 0, 0, 10]);
    // const result = await contractInstance["generateDemoEvents"]();
    // console.log("Result:", result);

    events.push({
      address: "",
      type: "",
      status: "",
      index: 0,
    });

    // In-progress event
    events.push({
      address: "",
      type: "",
      status: "",
      index: 1,
    });

    console.info("\nEvents created:");
    console.info("================");
    events.forEach(({ index, address, type, status }) => {
      console.info(`\nType ${index}: (${type})`);
      console.info(`Address:     ${address}`);
      console.info(`Status: ${status}`);
    });
  });
