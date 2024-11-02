/**
 * Copyright Clave - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import "@matterlabs/hardhat-zksync";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";

import "./tasks/deploy";

const mainnet = {
  DecimalUtils: "0x64c7C15d135C77A4A5f1D8bB8371f21e94782C06",
  CommandUtils: "0x8B0ee5573f93706D7a3f2eC10B4670BF6d295B7c",
  StringUtils: "0xbB924a1116b9EBCff19A6C83B97B06B8Aa3BF918",
};

const testnet = {
  DecimalUtils: "0x0b5900C91Cb1683182c6d279C22706e6a6C65Bfb",
  CommandUtils: "0x9821b97F3b585738648cfB50F3EfF9c5DB490Cc2",
  StringUtils: "0x86E65d11ef3C99ABb34a8C903552906E906661FE",
};

const VARS = testnet;

dotenv.config();

const zkSyncMainnet: NetworkUserConfig = {
  url: "https://mainnet.era.zksync.io",
  ethNetwork: "mainnet",
  zksync: true,
  verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
  chainId: 324,
};

const zkSyncSepolia: NetworkUserConfig = {
  url: "https://sepolia.era.zksync.dev",
  ethNetwork: "sepolia",
  zksync: true,
  verifyURL: "https://explorer.sepolia.era.zksync.dev/contract_verification",
  chainId: 300,
};

const inMemoryNode: NetworkUserConfig = {
  url: "http://127.0.0.1:8011",
  ethNetwork: "", // in-memory node doesn't support eth node; removing this line will cause an error
  zksync: true,
  chainId: 260,
};

const dockerizedNode: NetworkUserConfig = {
  url: "http://localhost:3050",
  ethNetwork: "http://localhost:8545",
  zksync: true,
  chainId: 270,
};

const config: HardhatUserConfig = {
  zksolc: {
    version: "latest",
    settings: {
      enableEraVMExtensions: true,
      optimizer: process.env.TEST
        ? {
            mode: "z",
          }
        : undefined,
      libraries: {
        "@zk-email/ether-email-auth-contracts/src/libraries/StringUtils.sol": {
          StringUtils: VARS.StringUtils,
        },
        "@zk-email/ether-email-auth-contracts/src/libraries/DecimalUtils.sol": {
          DecimalUtils: VARS.DecimalUtils,
        },
        "@zk-email/ether-email-auth-contracts/src/libraries/CommandUtils.sol": {
          CommandUtils: VARS.CommandUtils,
        },
      },
    },
  },
  defaultNetwork: "zkSyncSepolia",
  networks: {
    hardhat: {
      zksync: true,
    },
    zkSyncSepolia,
    zkSyncMainnet,
    inMemoryNode,
    dockerizedNode,
  },
  solidity: {
    version: "0.8.26",
  },
};

export default config;
