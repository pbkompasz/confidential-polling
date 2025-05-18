import { ethers } from "hardhat";

import type { Entrypoint } from "../../types";
import { getSigners } from "../signers";

export async function deployEntrypointContract(): Promise<Entrypoint> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("Entrypoint");
  const contract = await contractFactory
    // @ts-expect-error Expected error
    .connect(signers.alice)
    .deploy("0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");

  await contract.waitForDeployment();

  return contract;
}
