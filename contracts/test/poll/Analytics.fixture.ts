import { ethers } from "hardhat";

import type { Analytics, AnalyticsV2 } from "../../types";
import { getSigners } from "../signers";

export async function deployAnalyticsContract(): Promise<Analytics> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("Analytics");
  const contract = await contractFactory
    // @ts-expect-error Expected error
    .connect(signers.alice)
    .deploy();

  await contract.waitForDeployment();

  return contract;
}

export async function deployAnalyticsContractV2(): Promise<AnalyticsV2> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("AnalyticsV2");
  const contract = await contractFactory
    // @ts-expect-error Expected error
    .connect(signers.alice)
    .deploy();

  await contract.waitForDeployment();

  return contract;
}
