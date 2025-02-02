import { ethers } from "hardhat";
import Web3, {AbiItem} from "web3";
import {Contract, keccak256, toUtf8Bytes} from "ethers";
import {waitForTransaction, WaitForTxError} from "../utils/waitForTransaction";
import { ERC20 } from "../abis/ERC20.json";
// import {getDepositTxList} from "./depositOperations";
import {POOLS, USDC_RANGER_POOL_ID} from "../constants";

export const checkRole = async (
    manager: Contract,
    role:
        | "ADMIN_ROLE"
        | "ROLLOVER_ROLE"
        | "MID_CYCLE_ROLE"
        | "START_ROLLOVER_ROLE"
) => {
  const signers = await ethers.getSigners();
  const isAdmin = await manager.hasRole(
      keccak256(toUtf8Bytes(role)),
      signers[0].address
  );
  console.log(`Current signer has Manager contract's ${role} role:`, isAdmin);
  if (!isAdmin) {
    console.log("Exit");
    // eslint-disable-next-line no-process-exit
    process.exit();
  }
};

// struct PoolTransferData {
//   address pool; // pool to target
//   uint256 amount; // amount to transfer
// }

// struct ControllerTransferData {
//   bytes32 controllerId; // controller to target
//   bytes data; // data the controller will pass
// }
//
// struct RolloverExecution {
//   PoolTransferData[] poolData;
//   ControllerTransferData[] cycleSteps;
//   address[] poolsForWithdraw; //Pools to target for manager -> pool transfer
//   bool complete; //Whether to mark the rollover complete
//   string rewardsIpfsHash;
// }

const NODE_URL = "https://rpc.ankr.com/bsc";
const USDC = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";

const getRebalanceTxList = async (managerAddress: string, poolAddress: string, action: "deposit" | "withdraw") => {
    // TODO implement

  const web3 = new Web3(NODE_URL);
  const abi = ERC20.abi;
  const UsdcContract = new web3.eth.Contract(abi as AbiItem[], USDC);
  const poolBalance = await UsdcContract.methods.balanceOf(managerAddress).call();
  // const operations = await getDepositTxList({
  //   pool: POOLS[USDC_RANGER_POOL_ID],
  //   inputTokenId: "USDC",
  //   amount: poolBalance,
  //   isV3PairRebalance: true,
  // });
  const operations: any[] = [];
  const cycleSteps = await formatOperationsToControllerSteps(operations);
  return action === "deposit" ? {
    poolData: [
      {
        pool: poolAddress,
        amount: poolBalance,
      },
    ],
    cycleSteps,
    poolsForWithdraw: [], // TODO handle when withdrawing is needed
    complete: true,
    rewardsIpfsHash: "",
  } : {};
};

const formatOperationsToControllerSteps = async (txs: any[]) => {
  // TODO implement
  return [];
}

export async function executeRollover(managerAddress: string, poolAddress: string) {
  const web3 = new Web3(NODE_URL);
  // load Manager
  const strategyManagerV3Factory = await ethers.getContractFactory(
    "Manager"
  );
  const managerContract = await strategyManagerV3Factory.attach(
      managerAddress
  );
  await checkRole(managerContract, "ADMIN_ROLE");
  const rolloverStarted = await managerContract.rolloverStarted();

  const rolloverExecution = await getRebalanceTxList(managerAddress, poolAddress, "deposit");
  try {
    if (!rolloverStarted) {
      const startTx = await managerContract.startCycleRollover();
      await waitForTransaction(
        NODE_URL,
        new Web3(NODE_URL),
        startTx.hash
      );
    }
    const gasEstimate = await managerContract.estimateGas.executeRollover(
      rolloverExecution
    );
    console.log(
      "Main rollover transaction gas estimate",
      gasEstimate.toString()
    );
    const rolloverTx = await managerContract.executeRollover(
      rolloverExecution
    );
    await waitForTransaction(NODE_URL, web3, rolloverTx.hash);
    // TODO update user shares
    console.log("rollover transactions are done");
  } catch (e) {
    if (e instanceof WaitForTxError) {
      console.warn("rollover transactions failed to execute");
    } else {
      throw e;
    }
  }
}
