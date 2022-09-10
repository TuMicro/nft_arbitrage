import { network, ethers } from "hardhat";
import { ONE_MINUTE_IN_MILLIS } from "../constants/time";
import { expect } from "chai";
import { block, sample_protocol_data } from "../constants/opensea_signature_testing";
import { buy } from "./buy";

describe("OpenSea Buy Transactions", () => {
  it("Must be able to buy an NFT", async () => {
    
    const blockNumber = await ethers.provider.getBlockNumber();
    expect(blockNumber).eq(block);

    // [hardhat required] impersonating
    await network.provider.request({ // network from hardhat
      method: "hardhat_impersonateAccount",
      params: ["0xfBf8de425f5CEC239908Fda8f9De2D94D9718094"],
    });
    const externalAccount = await ethers.getSigner("0xfBf8de425f5CEC239908Fda8f9De2D94D9718094");

    await buy(sample_protocol_data, externalAccount);

  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});

