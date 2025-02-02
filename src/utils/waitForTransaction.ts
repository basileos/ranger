import Web3, {TransactionReceipt} from "web3";
import { ethers } from "ethers";
// eslint-disable-next-line node/no-extraneous-import
// import { TransactionReceipt } from "web3-core";

const { TRANSACTION_DEADLINE = 180, DEFAULT_BLOCKS_TO_WAIT = 4 } = process.env;

export class WaitForTxError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const waitForTransaction = async (
  nodeUrl: string,
  web3: Web3,
  txnHash: string,
  options: {
    interval?: number;
    blocksToWait?: number;
    ensureNotUncle?: boolean;
  } = {}
): Promise<TransactionReceipt | null> => {
  const interval =
    options && options.interval
      ? options.interval
      : +TRANSACTION_DEADLINE * 1000;
  const blocksToWait =
    options && options.blocksToWait
      ? options.blocksToWait
      : options && options.ensureNotUncle
      ? 12
      : DEFAULT_BLOCKS_TO_WAIT;
  try {
    // const nodeUrl = await getAliveNodeUrlDebounced(chainId?.toString() as ChainId);

    await ethers
      .getDefaultProvider(nodeUrl, {
        etherscan: process.env.ETHERSCAN_API_KEY,
      })
      .waitForTransaction(txnHash, +blocksToWait, +interval);
    return await web3.eth.getTransactionReceipt(txnHash);
  } catch (e) {
    console.warn("transaction error", e);
    throw new WaitForTxError((e as Error).message);
  }
};

// export const getNonce = async (chainId: ChainId, address: string) => {
//   const nodeUrl = await getAliveNodeUrlDebounced(chainId);
//   return ethers.getDefaultProvider(nodeUrl).getTransactionCount(address);
// };
