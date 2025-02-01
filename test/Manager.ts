import { config, deployments, ethers } from "hardhat";
import {Manager} from "../typechain-types";
import { expect } from "chai";

let manager: Manager;

const setupTest = async () => {
    await deployments.fixture();
    const ManagerDeployment = await deployments.get("Manager");
    const ManagerFactory = await ethers.getContractFactory("Manager");
    manager = await ManagerFactory.attach(ManagerDeployment.address);
}

describe("Manager", function () {
    before(async function () {
        await setupTest();
    });

    it("Manager should have registered pool", async function () {
        const pools = await manager.getPools();
        expect(pools.length).to.equal(1);
    });
});
