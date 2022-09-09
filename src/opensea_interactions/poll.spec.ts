import { ONE_MINUTE_IN_MILLIS } from "../../test/constants/time";
import { OpenSeaPoller } from "./poll";

describe.only("OpenSea: poll", () => {
  it("Must get floor price NFTs with listing signatures", async () => {
    const o = new OpenSeaPoller();
    const r = await o.getOpenSeaFloorPriceBuyNowOrders("0x06012c8cf97bead5deae237070f9587f8e7a266d");

  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});