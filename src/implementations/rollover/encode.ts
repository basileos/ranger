import { AbiCoder, Interface } from "ethers";
import { ControllerArgs } from "./types";

export const encodeControllerData = (
    contractInterface: Interface,
    functionFragment: string, // "deploy(bytes calldata data)"
    types: string[], // ["address", "uint"]
    values: ControllerArgs // ["0xc21223249CA28397B4B6541dfFaEcC539BfF0c59", "100000000"]
): string => {
  const abiCoder = AbiCoder.defaultAbiCoder(); // Create an instance of AbiCoder
  const deployParams = abiCoder.encode(types, values);

  return contractInterface.encodeFunctionData(functionFragment, deployParams === "0x" ? [] : [deployParams]);
};
