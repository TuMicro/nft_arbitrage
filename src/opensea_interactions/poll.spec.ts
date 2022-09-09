import { ENS_COLLECTION_MAINNET } from "../../test/constants/addresses";
import { ONE_MINUTE_IN_MILLIS } from "../../test/constants/time";
import { OpenSeaPoller } from "./poll";


describe("OpenSea: poll", () => {
  it("Must get floor price NFTs with listing signatures", async () => {
    const o = new OpenSeaPoller();
    const r = await o.getOpenSeaFloorPriceBuyNowOrders(ENS_COLLECTION_MAINNET);
  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});