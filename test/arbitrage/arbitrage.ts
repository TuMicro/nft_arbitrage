import { formatEther } from "ethers/lib/utils";
import { ethers, getChainId, network } from "hardhat";
import { OpenSeaPoller } from "../../src/opensea_interactions/poll";
import { getEthTotalPriceFromOrder } from "../../src/opensea_interactions/util";
import { BAYC_COLLECTION_MAINNET, ZERO_ADDRESS } from "../constants/addresses";
import { sell } from "../looksrare/sell";
import { buy } from "../opensea/buy";

export const ETH_HOLDER = '0x02A522D98EC2D2c3bBe91AcC29ee7fD32ab880ab'; // has more than 72 ETH at block 15505947

export async function arbitrage_first_demo() {
  
  const collection_address = BAYC_COLLECTION_MAINNET;

  const osp = new OpenSeaPoller();
  const orders = await osp.getOpenSeaFloorPriceBuyNowOrders(collection_address);

  // filter only listings with ETH currency
  const ethListings = orders.orders?.filter((item) => {
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

  const token_id = cheapestListing.protocol_data.parameters.offer?.[0].identifierOrCriteria ?? "";
  const price = getEthTotalPriceFromOrder(cheapestListing.protocol_data.parameters);
  console.log(`🛒 Buying ${token_id} from the collection ${collection_address} for ${formatEther(price)} ETH...`);

  await buy(cheapestListing.protocol_data, externalAccount);

  const chainId = Number(await getChainId());

  const received = await sell(chainId, collection_address,
    token_id,
    externalAccount);

  if (received.gt(price)) {
    console.log(`💰 Arbitrage success! We made ${formatEther(received.sub(price))} ETH`);
  } else {
    console.log(`💸 Arbitrage failure! We lost ${formatEther(price.sub(received))} ETH`);
  }
}