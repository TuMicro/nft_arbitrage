import { BigNumber, Wallet } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { addressesByNetwork, encodeOrderParams, MakerOrder, MakerOrderWithVRS, SupportedChainId, TakerOrder } from "@looksrare/sdk";

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { WETH_ADDRESS } from "../../test/constants/addresses";
import { MAX_UINT256 } from "../../test/constants/ether";
import { Weth9__factory, LooksRareExchange__factory } from "../../typechain_types";

export async function buy(
  hre: HardhatRuntimeEnvironment,
  makerOrder: MakerOrder & { signature: string }, // example signature: {"isOrderAsk":true,"signer":"...
) {
  const { ethers, getChainId } = hre;
  const chainId = Number(await getChainId());

  /* Parameters */
  const buyer = new Wallet(process.env.PK_ERC721_HOLDER ?? "", ethers.provider);

  /* Execution */

  // getting contracts ready
  if (!Object.values(SupportedChainId).includes(chainId)) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
  const addresses = addressesByNetwork[chainId as SupportedChainId];
  const wethTokenContract = Weth9__factory.connect(WETH_ADDRESS[chainId], ethers.provider);
  const looksrareExchangeContract = LooksRareExchange__factory.connect(addresses.EXCHANGE, ethers.provider);


  // getting the WETH
  const listingPrice = BigNumber.from(makerOrder.price);
  console.log(`Listing price: ${formatEther(listingPrice)}`);
  const wethBalance = await wethTokenContract.balanceOf(buyer.address);
  if (wethBalance.lt(listingPrice)) {
    console.log(`Buying WETH for ${formatEther(listingPrice)} ETH`);
    await wethTokenContract.connect(buyer).deposit({
      value: listingPrice,
    });
  }

  // approve the marketplace contract to spend the buyer's WETH
  if ((await wethTokenContract.allowance(buyer.address,
    addresses.EXCHANGE)).lt(listingPrice)) {
    console.log("Approving the marketplace contract to spend the buyer's WETH...");
    await wethTokenContract.connect(buyer).approve(
      addresses.EXCHANGE,
      MAX_UINT256
    );
  }

  // formatting the maker order
  const { encodedParams } = encodeOrderParams(makerOrder.params);
  const vrs = ethers.utils.splitSignature(makerOrder.signature);

  const askWithoutHash: MakerOrderWithVRS = {
    ...makerOrder,
    ...vrs,
    params: encodedParams,
  };

  const order: TakerOrder = {
    isOrderAsk: false,
    taker: buyer.address,
    price: makerOrder.price,
    tokenId: makerOrder.tokenId,
    minPercentageToAsk: makerOrder.minPercentageToAsk,
    params: encodedParams as any,
  };

  await looksrareExchangeContract.connect(buyer).matchAskWithTakerBid(order, askWithoutHash);


  console.log("Buy successful! 👌");
}