import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const leanIMT = await deploy("LeanIMT", {
  //   from: deployer,
  //   log: true,
  // });

  const deployed = await deploy("Entrypoint", {
    from: deployer,
    args: ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"],
    log: true,
    // libraries: {
    //   "contracts/lean-imt/LeanIMT.sol:LeanIMT": leanIMT.address,
    // },
  });
  const deployedPoll = await deploy("Poll", {
    from: deployer,
    args: ["My poll", "Just polling", 100, 20, 0, 0, 0, 10, true, true],
    log: true,
    gasLimit: 3_000_000,
    // libraries: {
    //   "contracts/lean-imt/LeanIMT.sol:LeanIMT": leanIMT.address,
    // },
  });

  console.log(`Entrypoint contract: `, deployed.address);
};
export default func;
func.id = "deploy_entrypoint"; // id required to prevent reexecution
func.tags = ["Entrypoint"];
