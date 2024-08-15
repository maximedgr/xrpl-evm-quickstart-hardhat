import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    XRPL_EVM_Sidechain_Devnet: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: [process.env.DEV_PRIVATE_KEY || ''],
    },
  },
  etherscan: {
    apiKey: {
      'XRPL_EVM_Sidechain_Devnet': "void"
    },
    customChains: [
      {
        network: "XRPL_EVM_Sidechain_Devnet",
        chainId: 1440002,
        urls: {
          apiURL: "https://evm-sidechain.xrpl.org/api", // not the right endpoint, see readme
          browserURL: "https://explorer.xrplevm.org/",
        }
      }
    ]
  }
};

export default config;
