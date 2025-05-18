import { ethers } from "hardhat";

import type { Poll } from "../../types";
import { getSigners } from "../signers";

export async function deployPollingContract(
  //address: string
  ): Promise<Poll> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("Poll");
  const contract = await contractFactory
    // @ts-expect-error Expected error
    .connect(signers.alice)
    // .deploy("My poll", "Just polling", 100, 20, 0, 0, 0, 10, true, true, address);
    .deploy("My poll", "Just polling", 100, 20, 0, 0, 0, 10, true, true);

  await contract.waitForDeployment();

  return contract;
}
