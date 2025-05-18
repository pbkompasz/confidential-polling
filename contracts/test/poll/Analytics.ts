import { expect } from "chai";

// import { network } from "hardhat";
import { createInstance } from "../instance";
// import { reencryptEuint64 } from "../reencrypt";
import { getSigners, initSigners } from "../signers";
import { debug } from "../utils";
import { deployAnalyticsContract } from "./Analytics.fixture";
import { deployEntrypointContract } from "./Entrypoint.fixture";
import { deployPollingContract } from "./Poll.fixture";
import { deployStorageContract } from "./Storage.fixture";

describe("Analytics", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
    const contract = await deployAnalyticsContract();
    this.contractAddress = await contract.getAddress();
    this.contract = contract;
    this.contract.connect(this.signers.alice);

    const storage = await deployStorageContract();
    const pollContract = await deployPollingContract(await storage.getAddress());
    // this.contractAddress = await pollContract.getAddress();
    this.pollContract = pollContract;

    const entrypoint = await deployEntrypointContract();

    const FieldStruct = [
      {
        name: "Do you agree",
        encryptedInputType: 2, // ebool
        requirementId: 1,
      },
      {
        name: "Age Group",
        encryptedInputType: 7, // choice8
        requirementId: 2,
      },
    ];

    // // Create form as host
    const tx = await pollContract.createForm(FieldStruct);
    await tx.wait();
  });

  it("should build query string", async function () {
    const form = await this.pollContract.getForm(0);
    const fields = form.fields.map((f: { name: any; encryptedInputType: any; requirementId: any }) => ({
      name: f.name,
      encryptedInputType: f.encryptedInputType,
      requirementId: f.requirementId,
    }));
    const queryConstraint = await this.contract.createQueryConstraint(fields, [0, 1], [1, 7]);

    expect(queryConstraint).to.eq(parseInt("1111", 2));
    // await this.pollContract.submitData(0, )

    const instance = await createInstance();
    // Create encrypted inputs
    const input = instance.createEncryptedInput(this.contractAddress, this.signers.alice.address);
    const inputs = await input.add16(1).add16(7).encrypt();

    // Call the smart contract function with encrypted inputs

    // input.add64(1337);
    // const encryptedInputs = await input.encrypt();
    // const tx = await this.erc20["transfer(address,bytes32,bytes)"](
    //   this.signers.bob,
    //   encryptedTransferAmount.handles[0],
    //   encryptedTransferAmount.inputProof,
    // );
    // const t2 = await tx.wait();

    const tx = await this.contract.createEncryptedQueryConstraint(
      fields,
      [0, 1],
      // inputs.handles[0],
      // inputs.inputProof
      {
        inputs: [inputs.handles[0], inputs.handles[1]],
        inputProof: inputs.inputProof,
      },
    );
    await tx.wait();

    const encryptedConstraint = await this.contract.getEncryptedConstraint();
    const plaintextValue = await debug.decrypt16(encryptedConstraint);

    expect(plaintextValue).to.eq(parseInt("1111", 2));
  });
});
