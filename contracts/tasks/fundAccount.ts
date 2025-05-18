import { parseEther } from "ethers";

const { task } = require("hardhat/config");

task("fund", "Send ETH to an address")
  .addParam("to", "The recipient address")
  .addOptionalParam("amount", "Amount of ETH to send (default is 1)", "1")
  .setAction(async ({ to, amount }, hre) => {
    const [sender] = await hre.ethers.getSigners();
    console.log(to, amount)

    const tx = await sender.sendTransaction({
      to,
      value: parseEther(amount),
    });

    console.log(`Sent ${amount} ETH to ${to}`);
    console.log(`Transaction hash: ${tx.hash}`);
  });
