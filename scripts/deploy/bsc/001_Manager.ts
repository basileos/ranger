import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, getOrNull, log, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const manager = await getOrNull("Manager");
  if (manager) {
    log(`reusing "Manager" at ${manager.address}`);
  } else {
    await deploy("Manager", {
      from: deployer,
      log: true,
      skipIfAlreadyDeployed: true,
    });
    const cycleDuration = 3600 * 3; // TODO increase for production
    const nextCycleStartTime =
      Math.floor(new Date().getTime() / 1000) + cycleDuration;
    await execute(
      "Manager",
      { from: deployer, log: true },
      "initialize",
      cycleDuration,
      nextCycleStartTime
    );
  }
};
export default func;
func.tags = ["Manager"];
