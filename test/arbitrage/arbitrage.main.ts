import { ethers } from "hardhat";
import { ONE_MINUTE_IN_MILLIS } from "../constants/time";
import { arbitrage_first_demo } from "./arbitrage";


describe.only("Arbitrage Transactions", () => {
  it("Must be able to buy from OpenSea and sell to LooksRare", async () => {
    
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`blockNumber`, blockNumber);

    await arbitrage_first_demo();

  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});

