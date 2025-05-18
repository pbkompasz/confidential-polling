import { ethers } from "hardhat";

import type { Storage } from "../../types";
import { getSigners } from "../signers";

export async function deployStorageContract(): Promise<Storage> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("Storage");
  const contract = await contractFactory
    // @ts-expect-error Expected error
    .connect(signers.alice)
    .deploy();

  await contract.waitForDeployment();

  return contract;
}
