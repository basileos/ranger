// import BigNumber from "bignumber.js";
// import { TokenId, getTokenById } from "./tokens";
// import { ChainId } from "./chainId";
// import { RolloverOperation, RolloverOperationTransfer } from "./rollover/types";
//
// const getOutcomeSums = async (
//   from: TokenId,
//   txListWithoutSwaps: { [key in string]: any[] },
//   chainId: ChainId
// ): Promise<BigNumber> => {
//   const prices = await getPricesDebounced([chainId]);
//   let res = new BigNumber(0);
//   for (const assets of Object.values(txListWithoutSwaps)) {
//     for (const asset of assets) {
//       res = res.plus(
//         new BigNumber(asset.amount)
//           .div(10 ** getTokenById(asset.token, chainId).decimals)
//           .times(prices[asset.token])
//           .div(prices[from])
//           .times(10 ** getTokenById(from, chainId).decimals)
//           .integerValue()
//       );
//     }
//   }
//
//   return res;
// };
//
// const createTokenAmountDistributions = async (
//   // strategy: IRiskStrategy,
//   inputTokenId: TokenId,
//   wells: any[],
//   inputTokenFractionsByWells: { [key: string]: string }
// ): Promise<{
//   forSwap: { [key in TokenId]?: BigNumber };
//   tokensPartsByWell: { [key in string]: any };
//   assetsByWell: { [key in string]: any[] };
//   assetsByWellForOutcome: { [key in string]: any[] }; // TODO remove this and use assetsByWell
// }> => {
//   const forSwap: { [key in TokenId]?: BigNumber } = {};
//   const tokensPartsByWell: { [key in string]: any } = {};
//   const assetsByWell: { [key in string]: any[] } = {};
//   const assetsByWellForOutcome: { [key in string]: any[] } = {};
//
//   for (const well of wells) {
//     const wellFractionOfInitialAmount = new BigNumber(inputTokenFractionsByWells[well.id]);
//     assetsByWell[well.id] = [];
//     assetsByWellForOutcome[well.id] = [];
//
//     const tokensAmountsOutput = well.assets.reduce((res: any, tokenId: string | number) => {
//       if (well.tokensOutput?.length) {
//         if (well.tokensOutput.includes(tokenId)) {
//           res[tokenId] = new BigNumber(wellFractionOfInitialAmount.dividedBy(well.tokensOutput.length).toFixed(0));
//         } else {
//           res[tokenId] = new BigNumber(0);
//         }
//       } else {
//         res[tokenId] = new BigNumber(wellFractionOfInitialAmount.dividedBy(well.assets.length).toFixed(0));
//       }
//
//       return res;
//     }, {});
//
//     const tokenPartsList = adjustTokenAmounts(
//       well.getPosition ? await getV3TokensPartsList(strategy, well, wellFractionOfInitialAmount) : tokensAmountsOutput,
//       wellFractionOfInitialAmount
//     );
//     for (const asset of well.assets) {
//       if (asset !== inputTokenId) {
//         if (!forSwap[asset]) forSwap[asset] = new BigNumber(0);
//         forSwap[asset] = forSwap[asset]?.plus(tokenPartsList[asset]);
//
//         if (!tokensPartsByWell[well.id]) tokensPartsByWell[well.id] = {};
//         if (!tokensPartsByWell[well.id][asset]) tokensPartsByWell[well.id][asset] = tokenPartsList[asset];
//       } else {
//         assetsByWell[well.id].push({
//           token: inputTokenId,
//           amount:
//             hideDepositSumsForSingle && well.isMaxDepositAmount
//               ? MAX_AMOUNT // TODO: need to check the possibility of using this flag for V3-cases
//               : tokenPartsList[asset].toFixed(0),
//         });
//         // TODO refactor assetsByWellForOutcome is spread all across the code
//         assetsByWellForOutcome[well.id].push({
//           token: inputTokenId as TokenId,
//           amount: tokenPartsList[asset].toFixed(0),
//         });
//       }
//     }
//   }
//
//   const forSwapFiltered = Object.fromEntries(Object.entries(forSwap).filter(([, amount]) => amount.gt(0)));
//
//   return {
//     forSwap: forSwapFiltered,
//     tokensPartsByWell,
//     assetsByWell,
//     assetsByWellForOutcome,
//   };
// };
//
// export interface TxListInputState {
//     pool: any;
//     inputTokenId: TokenId;
//     amount: string;
//     isV3PairRebalance: boolean;
// }
//
// export interface TxListOutcome {
//   token: TokenId;
//   decimals: number;
//   amount: string;
// }
//
// export interface OperationsCalculation {
//   txList: RolloverOperation[]; // TODO may be opList
//   input?: TxListOutcome;
//   outcome: TxListOutcome;
// }
//
// /**
//  * Getting of transactions' list for deposit-operations
//  */
// export const getDepositTxList = async (inputState: TxListInputState): Promise<OperationsCalculation> => {
//   const {
//     pool,
//     inputTokenId,
//     amount = "0", // weis
//     isV3PairRebalance = false,
//   } = inputState;
//
//   if (new BigNumber(amount).eq(0)) {
//     return {
//       txList: [],
//       outcome: {
//         token: inputTokenId,
//         decimals: getTokenById(inputTokenId, pool.chainId).decimals,
//         amount: "0",
//       },
//     };
//   }
//
//   const operations: RolloverOperation[] = [];
//   const depositOperations: RolloverOperation[] = [];
//   const swapOperations: RolloverOperation[] = [];
//
//   const operationWells = [...pool.targets];
//
//   // Distributing input token amount by wells without reminders
//   const inputTokenFractionsByWells: { [key: string]: string } = {};
//   let inputTokenFractionSum = new BigNumber(0);
//   for (const well of operationWells) {
//     inputTokenFractionsByWells[well.id] = new BigNumber(amount).times(well.percent).div(100).toFixed(0);
//     inputTokenFractionSum = inputTokenFractionSum.plus(inputTokenFractionsByWells[well.id]);
//   }
//   const diff = new BigNumber(amount).minus(inputTokenFractionSum);
//   if (diff.gt(0)) {
//     const biggestWell = operationWells.slice().sort((a, b) => b.percent - a.percent)[0];
//     inputTokenFractionsByWells[biggestWell.id] = new BigNumber(inputTokenFractionsByWells[biggestWell.id])
//       .plus(diff)
//       .toFixed(0);
//   }
//   logger.debug("getDepositTxList :: inputTokenFractionsByWells", inputTokenFractionsByWells);
//   const {
//     // summarized tokens(which we don't have and need to make swaps to get them) and their amounts
//     forSwap,
//     // tokens and amounts split by well
//     tokensPartsByWell,
//     // final structure, e.g. { "wellId": [{token: "USDC", amount: 100}, {token: "USDT", amount: 50}]}
//     assetsByWell,
//     assetsByWellForOutcome,
//   } = await createTokenAmountDistributions(
//     // strategy,
//     inputTokenId,
//     operationWells,
//     inputTokenFractionsByWells
//   );
//
//   const swapsResult: KeyValueBN = {};
//   logger.debug("getDepositTxList :: forSwap", { forSwap });
//   for (const tokenId of Object.keys(forSwap) as TokenId[]) {
//     if (tokenId !== inputTokenId) {
//       // SWAP TO TARGET ASSET IF NEED
//       const swapProvider = (
//         await getSwapsList({
//           chainId: pool.chainId,
//           from: inputTokenId,
//           to: tokenId,
//           amount: forSwap[tokenId]!.toFixed(0),
//         })
//       )[0];
//
//       if (!swapProvider) {
//         throw new Error(
//           `getDepositTxList :: swapProvider not found for inputTokenId: ${inputTokenId} and tokenId: ${tokenId}`
//         );
//       }
//       swapOperations.push({
//         from: MANAGER_ID,
//         to: swapProvider.swapId as LiquiditySwapId,
//         path: swapProvider?.path,
//         encodedPath: swapProvider?.encodedPath,
//         routerType: swapProvider?.routerType,
//         meta: { swapProvider },
//         assets: [
//           {
//             token: inputTokenId,
//             amount: forSwap[tokenId]!.toFixed(0),
//           },
//           {
//             token: tokenId,
//             amount: swapProvider?.value as string,
//           },
//         ],
//         swap: true,
//         createdBy: getDepositTxList.name,
//       });
//       if (!swapsResult[tokenId]) swapsResult[tokenId] = new BigNumber(0);
//       swapsResult[tokenId] = new BigNumber(swapProvider?.value || 0);
//     }
//   }
//
//   for (const well of operationWells) {
//     for (const asset of well.assets) {
//       if (asset !== inputTokenId && swapsResult[asset]) {
//         const tokenPart = swapsResult[asset].times(tokensPartsByWell[well.id][asset]).div(forSwap[asset]!);
//
//         logger.debug("getDepositTxList :: tokenPart", {
//           wellId: well.id,
//           asset,
//           tokenPart,
//           swapResult: swapsResult[asset],
//           tokensPartsByWell: tokensPartsByWell[well.id][asset],
//           forSwap: forSwap[asset],
//         });
//         assetsByWell[well.id].push({
//           token: asset,
//           amount: tokenPart.toFixed(0),
//         });
//         assetsByWellForOutcome[well.id].push({
//           token: asset,
//           amount: tokenPart.toFixed(0),
//         });
//       }
//     }
//
//     // TODO move this out to well as well specific metadata
//     // V3 mint-mode defining
//     const v3: any = {};
//     if (well.getPosition) {
//       if (isV3PairRebalance) {
//         // TODO implement this
//         // const poolInfo = await getV3PoolInfo(well.id as LiquidityOperatorWellId, strategy.chainId);
//         // const { tickLower, tickUpper } = await calculateTicks(
//         //   poolInfo,
//         //   strategy.chainId,
//         //   well.id as LiquidityOperatorWellId
//         // );
//         // const existingNotActivePosition =
//         //   await UniswapV3PositionRepository.fetchOneNotActiveByWellIdAndStrategyIdAndTicks(
//         //     strategy.id,
//         //     well.id,
//         //     tickLower.toString(),
//         //     tickUpper.toString()
//         //   );
//         // v3.mint = !existingNotActivePosition;
//         // if (existingNotActivePosition) {
//         //   Object.assign(v3, {
//         //     ...existingNotActivePosition,
//         //     positionTokenId: existingNotActivePosition.tokenId,
//         //   });
//         // }
//       } else {
//         v3.mint = true;
//       }
//       // TODO implement this
//       // const position = !v3.mint && !v3.positionTokenId && (await well.getPosition(strategy));
//       // if (position) {
//       //   Object.assign(v3, { ...position, positionTokenId: position.tokenId });
//       // }
//     }
//     depositOperations.push({
//       from: MANAGER_ID,
//       to: well.id,
//       assets: assetsByWell[well.id],
//       ...v3,
//       createdBy: getDepositTxList.name,
//     });
//   }
//   operations.push(...swapOperations, ...depositOperations);
//   const outcomeSumsInInputToken = await getOutcomeSums(inputTokenId, assetsByWellForOutcome, pool.chainId);
//
//   return {
//     txList: operations,
//     outcome: {
//       token: inputTokenId,
//       decimals: getTokenById(inputTokenId, pool.chainId).decimals,
//       amount: outcomeSumsInInputToken.toFixed(0),
//     },
//   };
// };
//
// export const getDepositTxListForV3Rebalance = async (inputState: TxListV3RebalanceInputState): Promise<TxList> => {
//   const {
//     strategy,
//     inputTokenId,
//     uniswapV3WellId,
//     hideDepositSumsForSingle = true,
//     priceLower,
//     priceUpper,
//   } = inputState;
//
//   const operations: RolloverOperation[] = [];
//   const depositOperations: RolloverOperation[] = [];
//   const swapOperations: RolloverOperation[] = [];
//
//   const operationWells = strategy.wells.filter((well) => !well.isMoneyBox);
//   const uniswapV3Well = operationWells.find((well) => well.id === uniswapV3WellId);
//   if (!uniswapV3Well) {
//     throw new Error(`getDepositTxListForV3Rebalance :: Well with id ${uniswapV3WellId} not found`);
//   }
//   const operationDrafts = await getV3TokensPartsListV2(strategy, uniswapV3Well, priceLower, priceUpper);
//   logger.debug("getDepositTxListForV3Rebalance", { operationDrafts });
//
//   const swapsResult: KeyValueBN = {};
//   for (const operationDraft of operationDrafts.filter((item: { swap: any }) => item.swap)) {
//     const [swap] = await getSwapsList({
//       chainId: strategy.chainId,
//       from: operationDraft.assets[0].token,
//       to: operationDraft.assets[1].token,
//       amount: operationDraft.assets[0].amount,
//     });
//     if (!swap) {
//       throw new Error(
//         `getDepositTxListForV3Rebalance :: swapProvider not found for inputTokenId: ${operationDraft.assets[0].token} and tokenId: ${operationDraft.assets[1].token}`
//       );
//     }
//     swapOperations.push({
//       from: MANAGER_ID,
//       to: swap.swapId as LiquiditySwapId,
//       path: swap?.path,
//       encodedPath: swap?.encodedPath,
//       routerType: swap?.routerType,
//       meta: { swap },
//       assets: [
//         {
//           token: operationDraft.assets[0].token,
//           amount: operationDraft.assets[0].amount,
//         },
//         {
//           token: operationDraft.assets[1].token,
//           amount: swap?.value as string,
//         },
//       ],
//       swap: true,
//       createdBy: getDepositTxListForV3Rebalance.name,
//     });
//     if (!swapsResult[operationDraft.assets[1].token]) swapsResult[operationDraft.assets[1].token] = new BigNumber(0);
//     swapsResult[operationDraft.assets[1].token] = new BigNumber(swap?.value || 0);
//   }
//
//   const assetsByWell: { [key in string]: any[] } = {};
//   const assetsByWellForOutcome: { [key in string]: any[] } = {};
//   const depositOperationDraft = operationDrafts.find((item: { swap: any }) => !item.swap);
//
//   for (const well of operationWells) {
//     assetsByWell[well.id] = [];
//     assetsByWellForOutcome[well.id] = [];
//     for (const asset of well.assets) {
//       const tokenPart = depositOperationDraft.assets.find((item: any) => item.token === asset).amount;
//       assetsByWell[well.id].push({
//         token: asset,
//         amount:
//           hideDepositSumsForSingle && well.isMaxDepositAmount
//             ? MAX_AMOUNT
//             : BigNumber.isBigNumber(tokenPart)
//             ? tokenPart.toFixed(0)
//             : tokenPart,
//       });
//       assetsByWellForOutcome[well.id].push({
//         token: asset,
//         amount: BigNumber.isBigNumber(tokenPart) ? tokenPart.toFixed(0) : tokenPart,
//       });
//     }
//     logger.debug("getDepositTxListForV3Rebalance :: assetsByWell", { assetsByWell });
//
//     // V3 mint-mode defining
//     const v3: any = {};
//     if (well.getPosition) {
//       // const { tickLower, tickUpper } = operationDrafts[1];
//       const { tickLower, tickUpper } = depositOperationDraft;
//       const existingNotActivePosition =
//         await UniswapV3PositionRepository.fetchOneNotActiveByWellIdAndStrategyIdAndTicks(
//           strategy.id,
//           well.id,
//           tickLower.toString(),
//           tickUpper.toString()
//         );
//       v3.mint = !existingNotActivePosition;
//       if (existingNotActivePosition) {
//         Object.assign(v3, {
//           ...existingNotActivePosition,
//           positionTokenId: existingNotActivePosition.tokenId,
//         });
//       }
//       const activePosition = !v3.mint && !v3.positionTokenId && (await well.getPosition(strategy));
//       if (activePosition) {
//         Object.assign(v3, { ...activePosition, positionTokenId: activePosition.tokenId });
//       }
//       if (tickLower && tickUpper) {
//         Object.assign(v3, { tickLower, tickUpper });
//       }
//     }
//     depositOperations.push({
//       from: MANAGER_ID,
//       to: well.id,
//       assets: assetsByWell[well.id],
//       ...v3,
//       createdBy: getDepositTxListForV3Rebalance.name,
//     });
//   }
//   operations.push(...swapOperations, ...depositOperations, ...getMoneyBoxOperations(strategy));
//
//   const outcomeSumsInInputToken = await getOutcomeSums(inputTokenId, assetsByWellForOutcome, strategy.chainId);
//
//   return {
//     txList: operations,
//     outcome: {
//       token: inputTokenId,
//       decimals: getTokenById(inputTokenId, strategy.chainId).decimals,
//       amount: outcomeSumsInInputToken.toFixed(0),
//     },
//   };
// };
