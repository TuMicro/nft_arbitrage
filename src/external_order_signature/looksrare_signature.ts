import { BigNumber } from 'ethers';
import { addressesByNetwork, SupportedChainId, MakerOrder } from "@looksrare/sdk";

export class LooksRareSignature {
  static async justCreateSellOrder(
    { chainId, signerAddress, nonce, tokenId, tokenAddress, listingPrice, startTime, endTime, marketplaceFee }: {
      chainId: number; signerAddress: string; nonce: BigNumber;
      // NFT:
      tokenId: BigNumber; tokenAddress: string;
      // others
      listingPrice: BigNumber; startTime: BigNumber; endTime: BigNumber; marketplaceFee: BigNumber;
    },
  ) {
    // throw if not in supported chainId
    if (!Object.values(SupportedChainId).includes(chainId)) {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }
    const addresses = addressesByNetwork[chainId as SupportedChainId];
    const makerOrder: MakerOrder = {
      isOrderAsk: true,
      signer: signerAddress,
      collection: tokenAddress,
      price: listingPrice,
      tokenId: tokenId,
      amount: "1", // for ERC721 it must be 1
      strategy: addresses.STRATEGY_STANDARD_SALE,
      currency: addresses.WETH,
      nonce: nonce,
      startTime,
      endTime,
      minPercentageToAsk: BigNumber.from(10_000).sub(marketplaceFee),
      params: [],
    };
    return makerOrder;
  }  
}