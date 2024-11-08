import * as hre from "hardhat";
import { deployContract, getWallet } from "./utils";

const mainnet = {
  dkimRegistry: "0x25c67a2313FCE68D741f3ab31C851EBCdFFfBd4C",
  verifier: "0x0679f14d91c9519a1376C1b65Dc731FE25Bd4272",
  emailAuthImpl: "0x2a5F70E28C1bF0d5cBA6EC6d170F9a36f905366F",
  factoryAddress: "0x10959669CF1c92B4cf14D9F925f5F2Df488Ce4C4",
  bytecodeHash:
    "0x010000817949717e7168c684f6dbb83a7051fa4c28e9e2b04784b6a6d4df360a",
  minimumDelay: 0,
  killSwitchAuthorizer: "0x0000000000000000000000000000000000000000" // Please change this to the address of the kill switch authorizer
};

const testnet = {
  dkimRegistry: "0x07284efbc9A44eDE8Cf61daE96298FA16bf5591e",
  verifier: "0xCf619836B8fb82C9cAdF52d81644dd59Ed520DaE",
  emailAuthImpl: "0x398316B211BeEe5238BB34f8a4e565cCbA790ADC",
  factoryAddress: "0x934D44cD16a25C7Ef93583674cDb5F303bC8d393",
  bytecodeHash:
    "0x01000081183d2be3ef5a61113657f87b159436fbccec981e966ffd26816c2c34",
  minimumDelay: 0,
  killSwitchAuthorizer: "0x0000000000000000000000000000000000000000" // Please change this to the address of the kill switch authorizer
};

const VARS = testnet;

export default async function (): Promise<void> {
  const wallet = getWallet(hre);

  const contractArtifactName = "EmailRecoveryCommandHandler";
  const commandHandler = await deployContract(
    hre,
    contractArtifactName,
    undefined,
    {
      wallet,
      silent: false,
    }
  );

  const commandHandlerAddress = await commandHandler.getAddress();
  console.log("Command handler deployed at:", commandHandlerAddress);

  const proxyArtifactName =
    "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy";

  await deployContract(hre, proxyArtifactName, [VARS.emailAuthImpl, "0x"], {
    silent: true,
  });

  const EmailRecoveryModuleArtifactName = "EmailRecoveryModule";
  const emailRecoveryModule = await deployContract(
    hre,
    EmailRecoveryModuleArtifactName,
    [
      VARS.verifier,
      VARS.dkimRegistry,
      VARS.emailAuthImpl,
      commandHandlerAddress,
      VARS.minimumDelay,
      VARS.killSwitchAuthorizer,
      VARS.factoryAddress,
      VARS.bytecodeHash,
    ],
    {
      wallet,
      silent: false,
    }
  );

  const emailRecoveryModuleAddress = await emailRecoveryModule.getAddress();
  console.log("Email recovery module deployed at:", emailRecoveryModuleAddress);
}
