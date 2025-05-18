import { expect } from "chai";

// import { network } from "hardhat";
import { createInstance } from "../instance";
// import { reencryptEuint64 } from "../reencrypt";
import { getSigners, initSigners } from "../signers";
import { deployEntrypointContract } from "./Entrypoint.fixture";
// import { debug } from "../utils";
import { deployPollingContract } from "./Poll.fixture";
import { deployStorageContract } from "./Storage.fixture";

describe("Poll", function () {
  before(async function () {
    await initSigners();
    this.signers = await getSigners();
    const contract = await deployPollingContract();
    this.contractAddress = await contract.getAddress();
    this.pollContract = contract;
    this.fhevm = await createInstance();
  });

  it("should try every poll operation(start, stop, edit)", async function () {
    const status = await this.pollContract.getStatus();
    expect(status).to.equal(0);

    await this.pollContract.initPoll();

    await this.pollContract.startPoll();
    await this.polling.stopPoll();
  });

  it("should add new form, submit data, validate and evaluate data", async function () {
    // Create requirements

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

    // Cannot create form w/ eaddress, uint or bytes
    const wrongFormField = [
      {
        name: "Some value",
        encryptedInputType: 0, // choice4
        requirementId: 2,
      },
    ];

    // Create form as host
    const tx = await this.pollContract.createForm(FieldStruct);
    await tx.wait();
  });

  it("should submit data w/ eager validation, eager evaluation", async () => {});

  it("should submit data w/ eager validation, lazy evaluation", async () => {});

  it("should submit data w/ lazy validation, lazy evaluation(ongoing, batched)", async () => {});

  it("should request data as analyst", async () => {});
});
