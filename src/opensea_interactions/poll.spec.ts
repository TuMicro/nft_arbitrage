import { BigNumber } from "ethers";
import { ENS_COLLECTION_MAINNET, OPENSEA_SEAPORT_1_1_MAINNET } from "../../test/constants/addresses";
import { ONE_MINUTE_IN_MILLIS } from "../../test/constants/time";
import { Seaport11__factory } from "../../typechain_types";
import { OpenSeaPoller } from "./poll";


describe("OpenSea: poll", () => {
  it("Must get floor price NFTs with listing signatures", async () => {
    const o = new OpenSeaPoller();
    const r = await o.getOpenSeaFloorPriceBuyNowOrders(ENS_COLLECTION_MAINNET);
  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});