import { addressesByNetwork, SupportedChainId } from "@looksrare/sdk";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ethers, getChainId, network } from "hardhat";
import { LooksRareApiClient } from "../../src/external_order_signature/api/looksrare_api";
import { Order } from "../../src/external_order_signature/model/looksrare_model";
import { LooksRareTxnUtils, LOOKSRARE_ERC721_TRANSFER_MANAGER_CONTRACT_ETHEREUM } from "../../src/looksrare_interactions/looksrare_txns_utils";
import { ERC721__factory, LooksRareExchange__factory, Weth9__factory } from "../../typechain_types";
import { BAYC_COLLECTION_MAINNET, WETH_ADDRESS } from "../constants/addresses";
import { ONE_MINUTE_IN_MILLIS } from "../constants/time";

describe.only("LooksRare Sell Transactions", () => {
  it("Must be able to sell an NFT", async () => {
    const chainId = Number(await getChainId());
    
    // NOTE: make sure to set hardhat fork to a recent mainnet block (not old)
    // so signatures can work without problems
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("blockNumber", blockNumber);
    
    const lrc = new LooksRareApiClient(chainId);

    const bayc_holder = '0xCCC03c44a8A4176FB32a5f58C47e936924580B7c';
    const token_id = '5896';

    const spreadInfo = await lrc.getSpreadsOfNfts(BAYC_COLLECTION_MAINNET, [Number(token_id)], false);

    const allBids = spreadInfo.results[0].bidsAsks.allBids;

    const wethTokenContract = Weth9__factory.connect(WETH_ADDRESS[chainId], ethers.provider);

    console.log("bids:", allBids.length);
    let i = 0;
    let bestBid: Order | null = null;
    while (i < allBids.length) {
      const bid = allBids[i];
      const bidderBalance = await wethTokenContract.balanceOf(bid.signer!);
      console.log(`Bid of ${bid.signer!} of price ${formatEther(bid.price!)} has balance ${formatEther(bidderBalance)}`);
      i++;
      if (bidderBalance.gte(bid.price!)) {
        bestBid = bid;
        break;
      }
    }

    if (bestBid == null) {
      throw new Error(`No valid bids found for tokenId ${token_id}`);
    }


    // [hardhat required] impersonating
    await network.provider.request({ // network from hardhat
      method: "hardhat_impersonateAccount",
      params: [bayc_holder],
    });
    const externalAccount = await ethers.getSigner(bayc_holder);

    const erc721Contract = ERC721__factory.connect(BAYC_COLLECTION_MAINNET,
      ethers.provider);

    
    //await erc721Contract.connect(externalAccount).approve(looksRareExchangeContract.address,
    //  tokenId);
    if (await erc721Contract.connect(externalAccount).isApprovedForAll(bayc_holder, LOOKSRARE_ERC721_TRANSFER_MANAGER_CONTRACT_ETHEREUM) === false) {
      console.log("approving looksrare to move our NFTs");
      await erc721Contract.connect(externalAccount).setApprovalForAll(
        LOOKSRARE_ERC721_TRANSFER_MANAGER_CONTRACT_ETHEREUM,
        true
      );
    }

    
    const n_nfts = await erc721Contract.balanceOf(externalAccount.address);
    
    console.log("sending the sell txn");
    const sellingFeesOver10k = BigNumber.from(200).add(750); // fees + royalties
    const addresses = addressesByNetwork[chainId as SupportedChainId];
    const looksrareExchangeContract = LooksRareExchange__factory.connect(addresses.EXCHANGE, ethers.provider);
    const pst = await LooksRareTxnUtils.prepareSellNftTransaction(
      looksrareExchangeContract,
      token_id.toString(),
      bestBid,
      BigNumber.from(10_000).sub(sellingFeesOver10k), // 1 - slippage
      externalAccount.address, // must be msg.sender
    );
    await externalAccount.sendTransaction({
      to: pst.target,
      data: pst.payload,
    });

    const n_nfts_2 = await erc721Contract.balanceOf(externalAccount.address);

    if (!n_nfts.sub(n_nfts_2).eq(1)) {
      throw new Error(`sell txn failed`);
    }

    console.log("Sell successful! 👌");

  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});

