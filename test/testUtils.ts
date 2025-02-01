import { ethers, network } from "hardhat";
import ERC20 from "../artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol/IERC20Upgradeable.json";
const USDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"; // USDC on BSC
const USDC_WHALE = "0xf89d7b9c864f589bbF53a82105107622B35EaA40";
import {parseEther} from "ethers";

export const transferToken = async (receiver: string, source: string, tokenAddress: string, amount: string) => {
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [source],
    });

    const whale = await ethers.getSigner(source);
    const usdc = await ethers.getContractAt(ERC20.abi, tokenAddress);

    const accounts = await ethers.getSigners();
    await accounts[0].sendTransaction({
        to: whale.address,
        value: parseEther("50.0"), // Sends exactly 50.0 ether
    });

    await usdc.connect(whale).transfer(receiver, amount);
};

export const transferUSDC = async (receiver: string, amount: string) => transferToken(receiver, USDC_WHALE, USDC, amount);
