import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { zeroPadValue, toUtf8Bytes } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, getOrNull, log, execute, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const pancakeController = await getOrNull("PancakeMasterChefV3Controller");
  if (pancakeController) {
    log(`reusing "PancakeMasterChefV3Controller" at ${pancakeController.address}`);
  } else {
    const NFT_MANAGER = "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364";
    const MASTERCHEF_V3 = "0x556B9306565093C855AEA9AE92A594704c2Cd59e";
    await deploy("PancakeMasterChefV3Controller", {
      from: deployer,
      contract: "PancakeV3MasterChefController",
      args: [NFT_MANAGER, MASTERCHEF_V3],
      log: true,
      skipIfAlreadyDeployed: true,
    });
    const controllerId = zeroPadValue(
      toUtf8Bytes("pancake-USDC-WBNB"),
      32
    );
    await execute(
      "Manager",
      { from: deployer, log: true },
      "registerController",
      controllerId,
      (
        await get("PancakeMasterChefV3Controller")
      ).address
    );
  }
};
export default func;
func.tags = ["PancakeMasterChefV3Controller"];
