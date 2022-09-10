import { ethers, getChainId, network } from "hardhat";
import { BAYC_COLLECTION_MAINNET } from "../constants/addresses";
import { ONE_MINUTE_IN_MILLIS } from "../constants/time";
import { sell } from "./sell";

describe("LooksRare Sell Transactions", () => {
  it("Must be able to sell an NFT", async () => {
    const chainId = Number(await getChainId());
    
    // NOTE: make sure to set hardhat fork to a recent mainnet block (not old)
    // so signatures can work without problems
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("blockNumber", blockNumber);

    
    const bayc_holder = '0xCCC03c44a8A4176FB32a5f58C47e936924580B7c';
    const token_id = '5896';
    
    // [hardhat required] impersonating
    await network.provider.request({ // network from hardhat
      method: "hardhat_impersonateAccount",
      params: [bayc_holder],
    });
    const externalAccount = await ethers.getSigner(bayc_holder);

    await sell(chainId, BAYC_COLLECTION_MAINNET, token_id, externalAccount);

  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});