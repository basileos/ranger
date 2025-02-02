import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, getOrNull, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const controller = await getOrNull("PancakeUniswapV3UnboundController");
  if (controller) {
    log(`reusing "PancakeUniswapV3UnboundController" at ${controller.address}`);
  } else {
    const PANCAKE_ROUTER_V3 = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";
    await deploy("PancakeUniswapV3UnboundController", {
      from: deployer,
      contract: "UniswapV3PancakeController",
      args: [PANCAKE_ROUTER_V3],
      log: true,
      skipIfAlreadyDeployed: true,
    });
  }
};
export default func;
func.tags = ["PancakeUniswapV3UnboundController"];
