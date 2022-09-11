import { FlashbotsBundleProvider, FlashbotsBundleResolution } from "@turuta/ethers-provider-bundle";
import { ethers, providers } from "ethers";
import { getEnumKeyByEnumValue, sleep } from "../utils";
import { flashbotsRelaySigningWallet } from "./config";

export class Flashbots {
  public readonly provider: providers.JsonRpcProvider;
  public readonly flashbotsProviderPromise: Promise<FlashbotsBundleProvider>;

  constructor(provider: providers.JsonRpcProvider) {
    this.provider = provider;
    this.flashbotsProviderPromise = FlashbotsBundleProvider.create(provider, flashbotsRelaySigningWallet);
    console.log("Flashbots Relay Signing Wallet Address: " + flashbotsRelaySigningWallet.address);
  }

  async getConflictingBundlesWithRetry(signedBundle: string[], targetBlock: number) {
    const flashbotsProvider = await this.flashbotsProviderPromise;
    let conflictingBundle = null;
    let retryCount = 0;
    while (conflictingBundle === null) {
      await sleep(80 * 1000); // more than the observed delay of ~5 blocks comparing with etherscan (~70 seconds on average)
      retryCount++;
      try {
        conflictingBundle = await flashbotsProvider.getConflictingBundle(
          signedBundle,
          targetBlock,
        );
      } catch (e) {
        const errorMessage = (e as any).message;
        if (errorMessage?.includes("Blocks-api")) {
          if (retryCount >= 4) {
            console.log("error getting fl conflicting bundle");
            console.error(e);
            return {
              errorMessage
            };
          }
          console.log("Blocks-api error, retrying...");
        } else {
          console.log("error getting fl conflicting bundle");
          console.error(e);
          return {
            errorMessage
          };
        }
      }
    }
    return conflictingBundle;
  }

  async sendRegularTxn(
    transactionForEstimation: ethers.PopulatedTransaction,
    executorWallet: ethers.Wallet, // arbitrage signing wallet
    gasLimit: ethers.BigNumber,
    priorityFee: ethers.BigNumber,
    n_blocks_to_target = 6,
  ) {

    const blockNumber = await this.provider.getBlockNumber();
    const block = await this.provider.getBlock(blockNumber);
    const flashbotsProvider = await this.flashbotsProviderPromise;
    transactionForEstimation.chainId = (await this.provider.getNetwork())?.chainId;
    transactionForEstimation.nonce = (await this.provider.getTransactionCount(
      executorWallet.address));
    const txnsToSign = [];
    const targetBlocks: number[] = [];

    for (let targetBlock = blockNumber + 1; targetBlock <= blockNumber + n_blocks_to_target; targetBlock++) {
      const blocksInTheFuture = targetBlock - blockNumber;
      // factors 1.125 for each future block:
      const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas!,
        blocksInTheFuture);
      const eip1559Transaction = {
        to: transactionForEstimation.to,
        type: 2,
        maxFeePerGas: priorityFee.add(maxBaseFeeInFutureBlock),
        maxPriorityFeePerGas: priorityFee,
        gasLimit: gasLimit,
        data: transactionForEstimation.data!,
        chainId: transactionForEstimation.chainId,
        nonce: transactionForEstimation.nonce,
      };
      console.log(eip1559Transaction);
      txnsToSign.push(eip1559Transaction);
      targetBlocks.push(targetBlock);
    }

    const signedBundles = await Promise.all(txnsToSign.map(txn => {
      return flashbotsProvider.signBundle([
        {
          signer: executorWallet,
          transaction: txn,
        }
      ]);
    }));


    const bundleResponses = await Promise.all(signedBundles.map(async (signedBundle, idx) => {
      const targetBlock = targetBlocks[idx];
      const toRet: { [key: string]: any } = {
        targetBlock,
      }
      const bundleSubmission = await flashbotsProvider.sendRawBundle(
        signedBundle,
        targetBlock,
      );
      if ('error' in bundleSubmission) {
        console.log(bundleSubmission.error.message);
        console.error(bundleSubmission.error);
        toRet.error = "bundle_submission_error";
        return toRet;
      }
      toRet.bundleHash = bundleSubmission.bundleHash;

      const waitResponse = await bundleSubmission.wait();
      if (waitResponse == null) {
        toRet.error = "wait_response_null";
        return toRet;
      }

      console.log(`Wait Response: ${getEnumKeyByEnumValue(FlashbotsBundleResolution, waitResponse)} ` +
        `for block ${blockNumber.toString()}, for target ${targetBlocks[idx]}`);
      toRet.waitResponse = waitResponse;
      return toRet;
    }));

    const flashbotsStatsJson: any = {
      bundleResponses,
      blockNumber,
    };

    // any response was succesful
    if (bundleResponses.some(r => r?.waitResponse === FlashbotsBundleResolution.BundleIncluded)) {
      console.log('successful!!!');
    } else {
      // get bundles stats:
      const bs = await Promise.all(bundleResponses.map(async (br, idx) => {
        const targetBlock = targetBlocks[idx];
        if (br == null) {
          return {
            nullMessage: "Response was null",
          };
        }
        const bundleStats = await flashbotsProvider.getBundleStats(br.bundleHash, targetBlock);
        // get conflicting bundle:
        const signedBundle = signedBundles[idx];
        const conflictingBundle = await this.getConflictingBundlesWithRetry(
          signedBundle,
          targetBlock,
        );
        return {

          bundleStats,
          targetBlock,
          conflictingBundle,
        }
      }));

      // adding stats to flashbotsStatsJson:
      flashbotsStatsJson.bundleStats = bs;
      flashbotsStatsJson.userStats = await flashbotsProvider.getUserStats();
    }
    console.log(JSON.stringify(flashbotsStatsJson));
  }
}