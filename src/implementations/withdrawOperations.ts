// import { TxList, TxListInputState } from "../balancer/interfaces";
// import { RolloverOperation } from "../rollover/types";
// import { getUserInitialToken } from "../../providers/getUserInitialToken";
// import { getTokenById, TokenId } from "../../common/tokens";
// import { getManagerShares } from "../../providers/getManagerShares";
// import { getUserShares } from "../../providers/getUserShares";
// import BigNumber from "bignumber.js";
// import { findRewardSweepController } from "../../common/riskStrategies/constants";
// import { getSwapsList } from "../../providers/getSwapsList";
// import { MAX_AMOUNT } from "../../common/constants";
// import { ACCUMULATOR_ID, LiquiditySwapId, MANAGER_ID } from "../../common/liquidityOperators/types";
// import {
//   filterStrategyMoneyBoxes,
//   filterStrategyWellsByPercent,
//   sortStrategyWellsByAssetsNumber,
// } from "./operationsTools";
// import { getAccumulatorWithdraw } from "../actions/accumulator/balances";
//
// /**
//  * Getting of transactions' list for withdrawal-operations
//  */
// export const getWithdrawTxList = async (inputState: TxListInputState): Promise<TxList> => {
//   const {
//     inputTokenId: targetTokenId,
//     percent = 0,
//     swapToInputToken = true,
//   } = inputState;
//
//   const operations: RolloverOperation[] = [];
//
//   const initialTokenId = "USDC";
//   let percentForWithdraw = new BigNumber(percent);
//
//   const userShares = await getManagerShares(strategy, new BigNumber(percentForWithdraw));
//
//   const outputTokensSums: { [key in TokenId]?: BigNumber } = {};
//
//   const operationWells = sortStrategyWellsByAssetsNumber([
//     ...filterStrategyWellsByPercent(strategy.wells),
//     ...filterStrategyMoneyBoxes(strategy.wells),
//   ]);
//
//   for (const well of operationWells) {
//     const partOfShare = new BigNumber(userShares[well.id].share);
//
//     if (partOfShare.gt(0)) {
//       const v3: any = {};
//       if (well.getPosition) {
//         const { tokenId } = await well.getPosition(strategy);
//         v3.positionTokenId = tokenId;
//       }
//
//       operations.push({
//         from: well.id,
//         to: MANAGER_ID,
//         assets: [
//           {
//             token: well.tokenId,
//             amount: partOfShare.toFixed(0), // for V3 it will be amountLiquidity
//           },
//         ],
//         meta: userShares[well.id].tokens,
//         ...v3, // V3's case only
//         createdBy: getWithdrawTxList.name,
//       });
//
//       for (const token of Object.keys(userShares[well.id].tokens) as TokenId[]) {
//         const partOfToken = new BigNumber(userShares[well.id].tokens[token]);
//
//         if (!outputTokensSums[token]) outputTokensSums[token] = new BigNumber(0);
//         outputTokensSums[token] = outputTokensSums[token]?.plus(partOfToken);
//       }
//     }
//   }
//
//   let targetTokenSum = new BigNumber(0);
//   if (swapToInputToken) {
//     // 4) FORMING OF WITHDRAWAL AMOUNTS LIST
//     for (const tokenId of Object.keys(outputTokensSums) as TokenId[]) {
//       if (tokenId !== targetTokenId) {
//         // SWAP TO TARGET TOKEN
//         const swapProvider = (
//           await getSwapsList({
//             chainId: strategy.chainId,
//             from: tokenId,
//             to: targetTokenId,
//             // @ts-ignore
//             amount: outputTokensSums[tokenId]?.toFixed(0),
//           })
//         )[0];
//
//         if (swapProvider) {
//           operations.push({
//             from: MANAGER_ID,
//             to: swapProvider?.swapId as LiquiditySwapId,
//             path: swapProvider?.path,
//             encodedPath: swapProvider?.encodedPath,
//             routerType: swapProvider?.routerType,
//             assets: [
//               {
//                 token: tokenId as TokenId,
//                 amount: MAX_AMOUNT,
//               },
//               {
//                 token: targetTokenId,
//                 amount: swapProvider?.value as string,
//               },
//             ],
//             swap: true,
//             createdBy: getWithdrawTxList.name,
//           });
//
//           targetTokenSum = targetTokenSum.plus(new BigNumber(swapProvider?.value || 0));
//         }
//       } else {
//         targetTokenSum = targetTokenSum.plus(outputTokensSums[tokenId]!);
//       }
//     }
//   }
//
//   return {
//     txList: operations,
//     outcome: {
//       token: targetTokenId,
//       decimals: getTokenById(targetTokenId, strategy.chainId).decimals,
//       amount: accumulatorWithdraw
//         ? accumulatorWithdraw.accumulator.plus(targetTokenSum).toFixed(0)
//         : targetTokenSum.toFixed(0),
//     },
//   };
// };
