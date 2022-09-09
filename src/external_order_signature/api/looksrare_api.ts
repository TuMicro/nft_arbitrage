import fetch from "node-fetch";
// import * as fetch from "node-fetch";
// const fetch = require('node-fetch');
import { BigNumber } from 'ethers';
import { formatEther } from "ethers/lib/utils";
import { readFileSync, writeFileSync } from "node:fs";
import { Order } from "../model/looksrare_model";
import { sleep } from "../../utils";
import { addressesByNetwork, SupportedChainId } from "@looksrare/sdk";

const LOOKS_RARE_LAUNCH_DATE_TIMESTAMP_SECONDS = 1641772800; // ~10/01/2022
const DEBUG = false;

export interface SpreadsResult {
  collectionAddress: string;
  collectionLevelBids: Order[];
  results: {
    tokenId: number;
    spreadInfo: {
      spread: BigNumber;
      bestBid: Order;
      bestAsk: Order;
    } | null;
    bidsAsks: {
      bids: Order[];
      asks: Order[];
      allBids?: Order[];
    };
  }[];
}

export class LooksRareApiClient {
  
  public readonly StrategyStandardSaleForFixedPrice: string;
  public readonly StrategyAnyItemFromCollectionForFixedPrice: string;
  public readonly StrategyPrivateSale: string;
  public readonly WETH: string;
  public readonly BASE_URL: string;

  constructor(
    public readonly chainId : number,
  ) {
    // find chainId in SupportedChainId
    if (!Object.values(SupportedChainId).includes(chainId)) {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }

    const addresses = addressesByNetwork[chainId as SupportedChainId];
    
    this.StrategyStandardSaleForFixedPrice = addresses.STRATEGY_STANDARD_SALE;
    this.StrategyAnyItemFromCollectionForFixedPrice = addresses.STRATEGY_COLLECTION_SALE;
    this.StrategyPrivateSale = addresses.STRATEGY_PRIVATE_SALE;
    this.WETH = addresses.WETH;
    this.BASE_URL = chainId === 1 ? 'https://api.looksrare.org' : 'https://api-rinkeby.looksrare.org';
  }

  // not tested:
  async queryTokenBidsFrom(collectionAddress: string, tokenId: number) {
    const URL = "https://api.looksrare.org/graphql";
    const body = {
      "query": "\n    query TokenBids(\n      $collection: Address!\n      $tokenId: String!\n      $pagination: PaginationInput\n      $filter: OrderFilterInput\n      $sort: OrderSortInput\n    ) {\n      token(collection: $collection, tokenId: $tokenId) {\n        bids(pagination: $pagination, filter: $filter, sort: $sort) {\n          ...OrderFragment\n        }\n      }\n    }\n    \n  fragment OrderFragment on Order {\n    isOrderAsk\n    signer\n    collection {\n      address\n    }\n    price\n    amount\n    strategy\n    currency\n    nonce\n    startTime\n    endTime\n    minPercentageToAsk\n    params\n    signature\n    token {\n      tokenId\n    }\n    hash\n  }\n\n  ",
      "variables": {
        "collection": collectionAddress, // originally with uppercasing
        "tokenId": tokenId.toString(),
        "pagination":
        {
          "first": 10,
        }, "sort": "PRICE_DESC"
      },
    };
    const res = await fetch(
      URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const responseData = (await res.json()) as { data?: Order[] };
    return responseData;
  }

  async getOrderForSpread(collectionAddress: string,
    tokenId: number | null,
    isOrderAsk: "true" | "false",
    sortBy: "EXPIRING_SOON" | "NEWEST" | "PRICE_ASC" | "PRICE_DESC",
    strategy: string | null = null,
    currency: string = this.WETH,
    number_of_results = "3",
  ) {
    const url = new URL(this.BASE_URL + '/api/v1/orders');

    url.searchParams.append('isOrderAsk', isOrderAsk);
    url.searchParams.append('collection', collectionAddress.toLowerCase());
    if (tokenId != null) {
      url.searchParams.append('tokenId', tokenId.toString());
    }
    if (strategy != null) {
      url.searchParams.append('strategy', strategy);
    }
    url.searchParams.append('currency', currency);
    url.searchParams.append('status[]', 'VALID');
    url.searchParams.append('sort', sortBy);
    url.searchParams.append('pagination[first]', number_of_results);

    // url.searchParams.append('startTime',
    //   LOOKS_RARE_LAUNCH_DATE_TIMESTAMP_SECONDS.toString());
    // const now = Math.round(Date.now() / 1000); // seconds
    // url.searchParams.append('endTime',
    //   now.toString());

    if (DEBUG) console.log(url.href);

    const res = await fetch(
      url.href, {
      method: 'GET',
    });
    const responseData = (await res.json()) as { data?: Order[] };

    await sleep(1000); // for respecting the rate limit https://docs.looksrare.org/developers/public-api-documentation#what-is-the-default-rate-limit

    if (DEBUG) {
      console.log(responseData);
      console.log(JSON.stringify(responseData));
    }

    return responseData;
  }

  async getUserNonce(address: string) {
    const url = new URL(this.BASE_URL + `/api/v1/orders/nonce`);

    url.searchParams.append('address', address);

    if (DEBUG) console.log(url.href);

    const res = await fetch(
      url.href, {
      method: 'GET',
    });
    const responseData = (await res.json()) as { data?: string };

    await sleep(1000); // for respecting the rate limit https://docs.looksrare.org/developers/public-api-documentation#what-is-the-default-rate-limit

    if (DEBUG) {
      console.log(responseData);
      console.log(JSON.stringify(responseData));
    }

    return responseData;
  }

  async getBidsAndAsksPerToken(collectionAddress: string, tokenId: number) {
    const bidsRes = await this.getOrderForSpread(collectionAddress,
      tokenId, "false", "PRICE_DESC",
      this.StrategyStandardSaleForFixedPrice // we don't want private sales
      // also StrategyAnyItemFromCollectionForFixedPrice doesn't work when you set the tokenId
    );
    const bids = bidsRes.data ?? [];
    const asksRes = await this.getOrderForSpread(collectionAddress,
      tokenId, "true", "PRICE_ASC");
    const asks = asksRes.data ?? [];

    return {
      bids,
      asks,
    }
  }

  async getBidsPerCollection(collectionAddress: string) {
    const bidsRes = await this.getOrderForSpread(collectionAddress,
      null, "false", "PRICE_DESC",
      this.StrategyAnyItemFromCollectionForFixedPrice,
      this.WETH,
      "20",
    );
    return bidsRes.data ?? [];
  }
  
  async getAsksPerCollection(collectionAddress: string) {
    const asksRes = await this.getOrderForSpread(collectionAddress,
      null, "true", "PRICE_ASC",
      this.StrategyStandardSaleForFixedPrice,
      this.WETH,
      "50", // 50 is max without pagination
    );
    return asksRes.data ?? [];
  }

  async readSpreadResults(filename: string) {
    // read json from file:
    const json = readFileSync(filename, "utf8");
    // parse json:
    const _markets: SpreadsResult = JSON.parse(json);
    return _markets;
  }

  /**
   * Used for fixing the badly processed results of the first scrapping.
   * And also filtering out the tokens that were not sellable nor buyable.
   * @param pastResults 
   * @returns 
   */
  processSpreadResults(pastResults: SpreadsResult) : SpreadsResult {
    const oldResults = pastResults.results;
    const collectionLevelBids = pastResults.collectionLevelBids;

    const results = [];

    for (const result of oldResults) {
      const { tokenId, bidsAsks } = result;
      const allBids = [...bidsAsks.bids, ...collectionLevelBids];
      // calc the spread
      let spreadInfo: null | {
        spread: BigNumber,
        bestBid: Order,
        bestAsk: Order,
      } = null;
      if (allBids.length > 0 && bidsAsks.asks.length > 0) {
        const bidPrice = allBids[0].price;
        const askPrice = bidsAsks.asks[0].price;
        if (bidPrice != null && askPrice != null) {
          spreadInfo = {
            bestAsk: bidsAsks.asks[0],
            bestBid: allBids[0],
            spread: BigNumber.from(askPrice).sub(bidPrice),
          }
        }
      }
      results.push({ tokenId, spreadInfo, bidsAsks });
    }

    // filter out the ones without spread
    const filteredResults = results.filter(r => r.spreadInfo != null);
    // sort results by spread in ascending order
    filteredResults.sort((a, b) => {
      if (a.spreadInfo == null) {
        return 1;
      }
      if (b.spreadInfo == null) {
        return -1;
      }
      if (a.spreadInfo.spread.gt(b.spreadInfo.spread)) {
        return 1;
      }
      return -1;
    });

    // // show the top 5
    // console.log(JSON.stringify(filteredResults.map(f => ({
    //   tokenId: f.tokenId,
    //   spread: formatEther(f.spreadInfo?.spread ?? 0),
    // })).slice(0, 5), null, 2));

    return {
      collectionAddress: pastResults.collectionAddress,
      results: filteredResults,
      collectionLevelBids,
    };
  }

  async getSpreadsOfNfts(collectionAddress: string, tokenIds: number[], writeToFile = true) {

    const results = [];
    let i = 0;

    const collectionLevelBids = await this.getBidsPerCollection(collectionAddress);

    for (const tokenId of tokenIds) {
      i++;
      if (i % 100 === 0) {
        console.log(`${new Date().toString()} : ${i}/${tokenIds.length}`);
      }
      try {
        const bidsAsks = await this.getBidsAndAsksPerToken(collectionAddress, tokenId);
        const allBids = [...bidsAsks.bids, ...collectionLevelBids];

        // sort allBids by price in descending order
        allBids.sort((a, b) =>
          BigNumber.from(b.price).gt(BigNumber.from(a.price)) ? 1 : -1
        );

        // calc the spread
        let spreadInfo: null | {
          spread: BigNumber,
          bestBid: Order,
          bestAsk: Order,
        } = null;
        if (allBids.length > 0 && bidsAsks.asks.length > 0) {
          const bidPrice = allBids[0].price;
          const askPrice = bidsAsks.asks[0].price;
          if (bidPrice != null && askPrice != null) {
            spreadInfo = {
              bestAsk: bidsAsks.asks[0],
              bestBid: allBids[0],
              spread: BigNumber.from(askPrice).sub(bidPrice),
            }
          }
        }
        results.push({ tokenId, spreadInfo, bidsAsks : {
          bids: bidsAsks.bids,
          asks: bidsAsks.asks,
          allBids,
        } });
        if (spreadInfo != null) {
          console.log(`${tokenId}: ${formatEther(spreadInfo.spread)}`);
        } else {
          console.log(`${tokenId}: not buyable or sellable`);
        }
      } catch (e) {
        console.error(e);
      }
    }


    // filter out the ones without spread
    const filteredResults = results.filter(r => r.spreadInfo != null);
    // sort results by spread in ascending order
    filteredResults.sort((a, b) => {
      if (a.spreadInfo == null) {
        return 1;
      }
      if (b.spreadInfo == null) {
        return -1;
      }
      if (a.spreadInfo.spread.gt(b.spreadInfo.spread)) {
        return 1;
      }
      return -1;
    });
    // show the top 10
    console.log(JSON.stringify(filteredResults.map(f => ({
      tokenId: f.tokenId,
      spread: formatEther(f.spreadInfo?.spread ?? 0),
    })).slice(0, 10), null, 2));

    const toRet = {
      collectionAddress,
      collectionLevelBids,
      results,
    };

    if (writeToFile) {
      writeFileSync("./outmarkets/spread_looksrare_" + collectionAddress + "_" + Date.now() + ".json",
        JSON.stringify(toRet));
    }

    return toRet;
  }

}