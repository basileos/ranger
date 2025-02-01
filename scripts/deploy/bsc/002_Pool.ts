import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, getOrNull, log, execute, get } = deployments;
    const { deployer } = await getNamedAccounts();

    const pool = await getOrNull("USDCPool");
    if (pool) {
        log(`reusing "USDCPool" at ${pool.address}`);
    } else {
        await deploy("USDCPool", {
            from: deployer,
            contract: "Pool",
            log: true,
            skipIfAlreadyDeployed: true,
        });

        const USDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
        const Manager = await get("Manager");
        await execute(
            "USDCPool",
            { from: deployer, log: true },
            "initialize",
            USDC,
            Manager.address,
            "hpAsset",
            "hydroPumpAsset"
        );
        await execute(
            "Manager",
            { from: deployer, log: true },
            "registerPool",
            (
                await get("USDCPool")
            ).address
        );
    }
};
export default func;
func.tags = ["USDCPool"];
