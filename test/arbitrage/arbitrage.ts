import { formatEther } from "ethers/lib/utils";
import { ethers, getChainId, network } from "hardhat";
import { OpenSeaPoller } from "../../src/opensea_interactions/poll";
import { BAYC_COLLECTION_MAINNET, ZERO_ADDRESS } from "../constants/addresses";
import { sell } from "../looksrare/sell";
import { buy } from "../opensea/buy";

export const ETH_HOLDER = '0x02A522D98EC2D2c3bBe91AcC29ee7fD32ab880ab'; // has more than 72 ETH at that block

export async function arbitrage_first_demo() {

  const o = new OpenSeaPoller();
  const oso = await o.getOpenSeaFloorPriceBuyNowOrders(BAYC_COLLECTION_MAINNET);

  // filter only listings with ETH currency
  const ethListings = oso.orders?.filter((item) => {
    return item.protocol_data.parameters.consideration?.[0]?.token === ZERO_ADDRESS;
  });

  if (ethListings == null || ethListings.length === 0) {
    throw new Error("No ETH listings found");
  }

  const cheapestListing = ethListings[0];

  // [hardhat required] impersonating
  await network.provider.request({ // network from hardhat
    method: "hardhat_impersonateAccount",
    params: [ETH_HOLDER],
  });
  const externalAccount = await ethers.getSigner(ETH_HOLDER);

  const balance = await externalAccount.getBalance();
  console.log("ETH balance: ", formatEther(balance));

  await buy(cheapestListing.protocol_data, externalAccount);

  const chainId = Number(await getChainId());

  const token_id = cheapestListing.protocol_data.parameters.offer?.[0].identifierOrCriteria ?? "";

  await sell(chainId, BAYC_COLLECTION_MAINNET,
    token_id,
    externalAccount);
}