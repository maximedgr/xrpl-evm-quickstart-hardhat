# XRPL EVM Sidechain - Getting Started with Hardhat 👷

The goal of this repository is to provide you with all the necessary tools to get started with Hardhat and deploy your first contract on the XRPL EVM sidechain.

## Prerequisites

Before getting started, you will need to generate a test wallet and fund it with test tokens. To do this, download the MetaMask extension from [https://metamask.io/](https://metamask.io/).

Once your new test wallet is generated, visit the XRPL EVM Sidechain faucet to fund your wallet with XRP: [https://bridge.xrplevm.org/](https://bridge.xrplevm.org/).

For a more detailed guide, refer to the official documentation: [https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/](https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/).

## Installation

1. Clone the repository
2. Run `npm i` to install the necessary dependencies

## Configuration

Create a `.env` file at the root of the project and add the following line: `DEV_PRIVATE_KEY=your_dev_private_key`.  
To obtain this private key, simply export it from your MetaMask wallet.  

The `hardhat.config.ts` file contains all Hardhat configuration settings. This is where you can add additional networks, plugins, change the Solidity compiler version, set optimization settings, and more. For more details, you can refer to the Hardhat documentation: [https://hardhat.org/hardhat-runner/docs/config](https://hardhat.org/hardhat-runner/docs/config).

For our project, here is the configuration code:

```typescript
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
          apiURL: "https://evm-sidechain.xrpl.org/api",
          browserURL: "https://explorer.xrplevm.org/",
        }
      }
    ]
  }
};

export default config;
```

Explanation of the Current Configuration:
- Solidity Compiler: The configuration specifies Solidity version 0.8.24 and enables the optimizer with 200 runs for better performance (But this will increase the contract size at deployment).  

- Networks: Defines a network configuration for XRPL_EVM_Sidechain_Devnet. The url points to the RPC endpoint of the XRPL EVM Sidechain, and the private key for deployment is retrieved from environment variables (DEV_PRIVATE_KEY).

- Etherscan: Configures the Etherscan API for verifying contracts on the XRPL EVM Sidechain. Although the apiKey is set to "void", you would typically replace this with your actual API key. **Note**: The XRPL explorer is not Etherscan but uses the [Blockscout stack](https://docs.blockscout.com/developer-support/verifying-a-smart-contract/hardhat-verification-plugin). The `etherscan` keyword is a Hardhat-specific parameter used to define block explorer listings.


## Get Started

In this example, we are working with a simple `Lock.sol` contract, which is located in the `contracts` folder. The purpose of this contract is to lock a certain value for a period of time and unlock it once the time has elapsed. Only the owner (deployer in our context) is able to withdraw the unlocked amount.

## Compile the Contract

With Hardhat, you first need to compile your Solidity contract using the command: `npx hardhat compile`.  

This command will generate a new `artifacts` folder where you will find a subfolder `contracts/Lock.sol` containing a `Lock.json` file. This file includes the ABI of your contract and is essential for interacting with it.

## Contract Testing

A good practice before deploying your contracts is to perform tests. You can create your test files in the `test` folder and then run the following command: `npx hardhat test`  

This command will execute your test cases and help ensure that your contracts function as expected before deployment.

## Deploy Contracts

In this tutorial, I will present two methods for deploying your contract with Hardhat.

### Classic Method

The classic method involves creating a deployment script in the `scripts` folder and running the following command: `npx hardhat run scripts/deploy.ts --network XRPL_EVM_Sidechain_Devnet`  


It is considered a best practice to have one deployment script per contract.

### Hardhat Ignition

The second method uses the `hardhat-ignition` plugin. Each contract you wish to deploy should have its own configuration in the `ignition/modules` folder.

Once the configuration is ready, run the following command: `npx hardhat ignition deploy ignition/modules/Lock.ts --network XRPL_EVM_Sidechain_Devnet`    

You will be prompted to confirm the deployment in the terminal. Once the deployment is complete, you will find several files in the `ignition/deployments/chain-1440002` folder, including the ABI, deployment address, and transaction-related information.

This version and the use of this plugin are currently recommended by Hardhat and provide you with detailed information related to your deployment.


## Verify Contract

The final step is an important practice: verifying your contracts. 
1. Hardhat offers contract verification via the `hardhat-verify` plugin. You can verify your contract by running the following command: `npx hardhat verify --network XRPL_EVM_Sidechain_Devnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"`  


2. Another alternative is to use the `hardhat-ignition` plugin for verification. For more details, refer to the Hardhat documentation: [https://hardhat.org/hardhat-runner/docs/guides/verifying](https://hardhat.org/hardhat-runner/docs/guides/verifying).

3. The final option is to verify your contract directly through the block explorer by manually entering the information once you search for your contract by address: [https://explorer.xrplevm.org/](https://explorer.xrplevm.org/). You will need to provide a flattened version of your contract, which you can obtain using the following command: `npx hardhat flatten contracts/Lock.sol > Flattened.sol`  

⚠️**Note**: Currently, the explorer does not offer an API route for contract verification via CLI. You will need to use its UI and follow the steps outlined in the third option provided.

## Interact with Your Deployed Contract

You can interact with your deployed contract and withdraw the locked funds once the lock time has passed by running the following command:

### Withdraw Funds

1. **Update the Script**

   Make sure to update the `withdraw.ts` script with the address of your deployed contract. Replace `"0xYourLockContractAddressHere"` with your actual contract address.

2. **Run the Script**

   Execute the script using Hardhat to withdraw the funds:

   ```bash
   npx hardhat run scripts/withdraw.ts --network XRPL_EVM_Sidechain_Devnet
   ```  


## Going Further

To go further, I encourage you to explore the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.26/) to learn more about the language specifications and all the programming capabilities available. Smart contracts are programs that execute on-chain, and each operation consumes gas, so it's important to optimize them.

I recommend using OpenZeppelin libraries, which are a reference for EVM smart contract development. You can find them at [https://www.openzeppelin.com/contracts](https://www.openzeppelin.com/contracts).

## More XRPL EVM Sidechain Tutorials

| Repo                | Link                                                    |
|---------------------|---------------------------------------------------------|
| Play with ZK on the XRPL EVM Sidechain ✨ | [GitHub Repository](https://github.com/maximedgr/zk-xrpl-evm-workshop) |
| Next.js x Rainbowkit Wallet configured for the XRPL EVM Sidechain 🌈 | [GitHub Repository](https://github.com/maximedgr/xrpl-evm-quickstart-rainbowkit) |



### Additional Resources
|Resources|Link|
|---|---|
|Docs|https://docs.xrplevm.org/docs/evm-sidechain/intro-to-evm-sidechain/|
|Bridge & Faucet|https://bridge.xrplevm.org/|
|MetaMask|https://metamask.io/|
|Solidity|https://docs.soliditylang.org/en/v0.8.26/|
|Hardhat|https://hardhat.org/|
|Remix IDE|https://remix.ethereum.org/|
|Grants|https://xrplgrants.org/|
|Accelerator|https://xrplaccelerator.org/|

