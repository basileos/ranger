import { config, deployments, ethers } from "hardhat";
import {Pool} from "../typechain-types";
import { expect } from "chai";
import {transferUSDC} from "./testUtils";
import {Signer, parseUnits} from "ethers";

let pool: Pool;
let signers: Array<Signer>;
let investorUser: Signer;
let investorUserAddress: string;

const setupTest = async () => {
    signers = await ethers.getSigners();
    [investorUser] = signers;
    investorUserAddress = await investorUser.getAddress();
    await deployments.fixture();
    const PoolDeployment = await deployments.get("USDCPool");
    const PoolFactory = await ethers.getContractFactory("Pool");
    pool = await PoolFactory.attach(PoolDeployment.address);
}

describe("Pool", function () {
    before(async function () {
        await setupTest();
        await transferUSDC(investorUserAddress, parseUnits("10000", 18).toString());
    });

    it("Transaction should be reverted with 'BEP20: transfer amount exceeds allowance', if user didn't approve", async function () {
        await expect(
            pool.connect(investorUser).deposit(String(100e18))
        ).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
    });
});
