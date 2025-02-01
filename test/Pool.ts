import { config, deployments, ethers } from "hardhat";
import {Pool} from "../typechain-types";
import { expect } from "chai";
import {transferUSDC} from "./testUtils";
import {Signer, parseUnits} from "ethers";
import ERC20
    from "../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json";

let pool: Pool;
let signers: Array<Signer>;
let investorUser: Signer;
let investorUserAddress: string;
let USDC: any;

const setupTest = async () => {
    signers = await ethers.getSigners();
    [investorUser] = signers;
    investorUserAddress = await investorUser.getAddress();
    await deployments.fixture();
    const PoolDeployment = await deployments.get("USDCPool");
    const PoolFactory = await ethers.getContractFactory("Pool");
    pool = await PoolFactory.attach(PoolDeployment.address);
    USDC = await ethers.getContractAt(ERC20.abi, "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d");
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

    it("Transaction should be confirmed, if user approved before deposit", async function () {
        const depositAmount = String(100e18);
        const poolAddress = await pool.getAddress();
        await USDC
            .connect(investorUser)
            .approve(poolAddress, depositAmount);
        await pool.connect(investorUser).deposit(depositAmount);
        expect(await pool.balanceOf(investorUserAddress)).to.equal(depositAmount);
    });
});
