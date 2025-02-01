import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
      },
      {
        version: "0.8.2",
      },
      {
        version: "0.8.28",
      },
    ]
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      deploy: ["./scripts/deploy/bsc/"],
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    deploy: "./scripts/deploy/bsc/",
  },
};

export default config;
