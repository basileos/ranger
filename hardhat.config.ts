import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-ledger";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true,
        }
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true
        }
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
    bsc: {
        url: "https://bsc-dataseed.binance.org",
        ledgerAccounts: [
          "0x758b16C496110295A953F8B4ed4dE90237bDCcb0", // Ethereum Experiments
        ],
        deploy: ["./scripts/deploy/bsc/"],
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    deploy: "./scripts/deploy/bsc/",
  },
};

export default config;
