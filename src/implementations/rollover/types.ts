// import { Interface } from "ethers";
// import { LiquidityOperatorId, LiquiditySwapId } from "../../common/liquidityOperators/types";
// import { TokenId } from "../tokens";
// import { ChainId } from "../chainId";
// import { SwapRouterType } from "../../common/swaps/constants";
// import { IRiskStrategy } from "../../common/riskStrategies/types";
// import { LPWithdrawInput } from "../../common/liquidityOperators/argsAdapters";
//
// export interface ExternalContract {
//   readonly address: string;
//   readonly abi: any[];
// }
//
// export interface PoolTransferData {
//   pool: string;
//   amount: string;
// }
//
// export interface ControllerTransferData {
//   controllerId: Uint8Array; // controller to target
//   data: string;
// }
//
// export interface RolloverExecution {
//   poolData: PoolTransferData[];
//   cycleSteps: ControllerTransferData[];
//   poolsForWithdraw: string[];
//   complete: boolean;
//   rewardsIpfsHash: string;
// }
//
// export interface RolloverOperationTransfer {
//   amount: string;
//   token: TokenId;
// }
//
// export type ControllerArgs = (string | boolean | string[] | string[][])[];
//
// export interface RolloverOperation<T = any> {
//   from: LiquidityOperatorId;
//   to: LiquidityOperatorId;
//   path?: string | string[];
//   encodedPath?: string;
//   routerType?: SwapRouterType;
//   assets: RolloverOperationTransfer[];
//   meta?: T; // Used to avoid double calling of tokensAmountsOutput
//   swap?: boolean;
//   status?: string; // TODO check and remove it if it's not used
//   createdBy?: string;
//   swapId?: LiquiditySwapId;
//   mint?: boolean;
//   positionTokenId?: string;
//   tickLower?: string;
//   tickUpper?: string;
// }
//
// export type LiquidityOperatorController = {
//   id: LiquidityOperatorId;
//   chainId: ChainId;
//   description?: string;
//   address: string;
//   controllerId: Uint8Array;
//   controllerHexId: string;
//   balanceKey: string | Uint8Array; // actually it's address or controllerId, it depends on strategy contract
//   interface: Interface;
//   deploy: {
//     function: string;
//     types: string[];
//     args: (operation: RolloverOperation, strategy: IRiskStrategy) => Promise<ControllerArgs> | ControllerArgs;
//   };
//   deployAll?: {
//     function: string;
//     types: string[];
//     args: (operation: RolloverOperation, strategy: IRiskStrategy) => Promise<ControllerArgs>;
//   };
//   withdraw: {
//     function: string;
//     types: string[];
//     args: (
//       operation: RolloverOperation,
//       lpWithdraw: LPWithdrawInput,
//       strategy: IRiskStrategy
//     ) => Promise<ControllerArgs> | string[];
//   };
//   withdrawAll?: {
//     function: string;
//     types: string[];
//     args: (operation: RolloverOperation, lpWithdraw: LPWithdrawInput, strategy: IRiskStrategy) => Promise<string[]>;
//   };
//   destination: ExternalContract;
// };
//
// export enum TxListType {
//   Deposit = "deposit",
//   Withdraw = "withdraw",
//   Rebalance = "rebalance",
//   RebalanceV3Wells = "rebalanceV3Wells",
// }
