// import {
//   ACCUMULATOR_ID,
//   ACCUMULATOR_SEPOLIA_ID,
//   LiquidityOperatorWellId,
//   MANAGER_ID,
//   RESCUE_ALPACA_WELL_ID,
// } from "../../common/liquidityOperators/types";
// import { encodeControllerData } from "./encode";
// import {
//   findLiquidityOperatorControllerById,
//   isLiquidityOperatorControllerId,
// } from "../../common/liquidityOperators/constants";
// import { RolloverOperation } from "./types";
// import { getTokenById } from "../../common/tokens";
// import BigNumber from "bignumber.js";
// import { BALANCER_SLIPPAGE, MAX_AMOUNT } from "../../common/constants";
// import { ChainId } from "../../common/chainId";
// import { getWellById } from "../../common/wells/constants";
// import { errorInfo, ErrorType } from "../../util/errorInfo";
// import { IRiskStrategy } from "../../common/riskStrategies/types";
// import { LPWithdrawInput } from "../../common/liquidityOperators/argsAdapters";
//
// // TODO think about it and move getLPWithdrawAmounts, getSwapAmounts to some additional stage like "amounts specification"
// const getLPWithdrawAmounts = async (operation: RolloverOperation, chainId: ChainId): Promise<LPWithdrawInput> => {
//   const emptyResult = {
//     tokens: [],
//     amounts: [],
//   };
//   if (operation.from === ACCUMULATOR_ID) { // temp fix, TODO remove after refactoring getLPWithdrawAmounts as part of controller
//     return emptyResult;
//   }
//   if (operation.meta) {
//     return {
//       // TODO refactor getUserShares to return array, because order is important
//       tokens: Object.keys(operation.meta).map((key) => getTokenById(key, chainId).address),
//       amounts: Object.values(operation.meta).map((value) =>
//         new BigNumber(<string>value).multipliedBy(BALANCER_SLIPPAGE).toFixed(0)
//       ),
//     };
//   }
//   return emptyResult;
// };
//
// const mapOperationAssetsAmount = async (operation: RolloverOperation, chainId: ChainId): Promise<RolloverOperation> => {
//   if ([ACCUMULATOR_ID, ACCUMULATOR_SEPOLIA_ID, RESCUE_ALPACA_WELL_ID].includes(operation.from)) { // temp fix, TODO remove after refactoring mapOperationAssetsAmount as part of well
//     return operation;
//   }
//   const well = getWellById(operation.from as LiquidityOperatorWellId);
//   if (well.collateralTokenAmount) {
//     return {
//       ...operation,
//       assets: [
//         {
//           token: operation.assets[0].token,
//           amount: await well.collateralTokenAmount(operation, chainId)!,
//         },
//       ],
//     };
//   }
//   return operation;
// };
//
// export const formatOperationsToControllerSteps = async (
//   operations: RolloverOperation[],
//   strategy: IRiskStrategy
// ): Promise<{ controllerId: string; data: string }[]> => {
//   const cycleSteps = [];
//   for (const operation of operations) {
//     const { from, to } = operation;
//     if (to === MANAGER_ID) {
//       if (isLiquidityOperatorControllerId(from)) {
//         const controller = findLiquidityOperatorControllerById(from);
//         const withdrawAmounts = await getLPWithdrawAmounts(operation, controller.chainId);
//         const { amount } = operation.assets[0];
//         const controllerOperation = amount === MAX_AMOUNT ? "withdrawAll" : "withdraw";
//         cycleSteps.push({
//           controllerId: controller.controllerHexId,
//           data: encodeControllerData(
//             controller.interface,
//             controller[controllerOperation]!.function,
//             controller[controllerOperation]!.types,
//             await controller[controllerOperation]!.args(
//               await mapOperationAssetsAmount(operation, strategy.chainId),
//               withdrawAmounts,
//               strategy
//             )
//           ),
//         });
//       } else {
//         throw new Error(
//           errorInfo({
//             type: ErrorType.Config,
//             message: `Invalid balancer operation format. "from": ${from} is not supported`,
//             debug: {
//               module: __filename,
//               method: formatOperationsToControllerSteps.name,
//             },
//           })
//         );
//       }
//     }
//     if (from === MANAGER_ID) {
//       if (isLiquidityOperatorControllerId(to)) {
//         const controller = findLiquidityOperatorControllerById(to);
//         const { amount } = operation.assets[0];
//         const controllerOperation = amount === MAX_AMOUNT ? "deployAll" : "deploy";
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const args = await controller[controllerOperation]!.args(operation, strategy);
//         cycleSteps.push({
//           controllerId: controller.controllerHexId,
//           data: encodeControllerData(
//             controller.interface,
//             controller[controllerOperation]!.function,
//             controller[controllerOperation]!.types,
//             args
//           ),
//         });
//       } else {
//         throw new Error(
//           errorInfo({
//             type: ErrorType.Config,
//             message: `Invalid balancer operation format. "to": ${to} is not supported`,
//             debug: {
//               module: __filename,
//               method: formatOperationsToControllerSteps.name,
//             },
//           })
//         );
//       }
//     }
//   }
//   return cycleSteps;
// };
