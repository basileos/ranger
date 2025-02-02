// import Web3 from "web3";
// import { Contract } from "web3-eth-contract";
// import { IRiskStrategy } from "../../common/riskStrategies/types";
// import { BytesLike } from "@ethersproject/bytes";
// import BigNumber from "bignumber.js";
// import { getPricesDebounced } from "../prices/getPricesDebounced";
// import { CHAIN_ASSET } from "../../common/constants";
// import { logger } from "../../logger";
// import { getNonce, waitForTransaction, WaitForTxError } from "../../util/waitForTransaction";
//
// export const startRollover = async (
//   rolloverStarted: boolean,
//   strategyManagerV3: Contract,
//   signer: string,
//   strategy: IRiskStrategy,
//   web3: Web3
// ) => {
//   if (!rolloverStarted) {
//     const nonce = await getNonce(strategy.chainId, signer);
//     const { transactionHash } = await strategyManagerV3.methods.startCycleRollover().send({ from: signer, nonce });
//     await waitForTransaction(+strategy.chainId, web3, transactionHash);
//   }
// };
//
// export const executeRollover = async (
//   web3: Web3,
//   strategyManagerV3: Contract,
//   strategy: IRiskStrategy,
//   cycleSteps: { controllerId: BytesLike; data: BytesLike }[],
//   signer: string
// ) => {
//   const rolloverExecution = {
//     cycleSteps: cycleSteps,
//     complete: false,
//   };
//   const gasEstimate = await strategyManagerV3.methods.executeRollover(rolloverExecution).estimateGas({ from: signer });
//   const gasPrice = await web3.eth.getGasPrice();
//   const transactionFee = new BigNumber(gasEstimate).multipliedBy(gasPrice);
//   const transactionFeeInEther = web3.utils.fromWei(transactionFee.toString(), "ether");
//
//   const prices = await getPricesDebounced([strategy.chainId]);
//   const gasEstimateInUSD = +transactionFeeInEther * +prices[CHAIN_ASSET[strategy.chainId]];
//   logger.debug(`executeRollover: Estimated gas: ${gasEstimate.toString()}`);
//   logger.debug(`executeRollover: Gas price: ${gasPrice}`);
//   logger.debug(`executeRollover: Transaction fee in Ether: ${transactionFeeInEther}`);
//   logger.debug(`executeRollover: Transaction fee in USD: ${gasEstimateInUSD}`);
//   const nonce = await getNonce(strategy.chainId, signer);
//   const { transactionHash } = await strategyManagerV3.methods
//     .executeRollover(rolloverExecution)
//     .send({ from: signer, nonce });
//   await waitForTransaction(+strategy.chainId, web3, transactionHash);
//   logger.debug("executeRollover: Rollover tx confirmed");
// };
//
// export const executeMulticall = async (
//   web3: Web3,
//   strategyManagerV5: Contract,
//   calls: string[],
//   strategy: IRiskStrategy,
//   signer: string
// ) => {
//   const { transactionHash: completeRolloverTxHash } = await strategyManagerV5.methods
//     .multicall(calls)
//     .send({ from: signer });
//   await waitForTransaction(+strategy.chainId, web3, completeRolloverTxHash);
// };
//
// export const executeRolloverWithWaitForWrapper = async (
//   web3: Web3,
//   strategyManagerV3: Contract,
//   strategy: IRiskStrategy,
//   cycleSteps: { controllerId: BytesLike; data: BytesLike }[],
//   signer: string
// ) => {
//   try {
//     await executeRollover(web3, strategyManagerV3, strategy, cycleSteps, signer);
//   } catch (e) {
//     if (e instanceof WaitForTxError) {
//       logger.warn(`rollover transaction failed to execute`, {
//         e,
//       });
//     } else {
//       logger.error("depositAccumulated: Rollover tx failed", { e });
//       throw e;
//     }
//   }
// };
