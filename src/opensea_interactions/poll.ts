import fetch from "node-fetch";
import { AssetContractResponse } from "./api_model_v1/asset_contract_response";

// inspiration from: https://github.com/dcts/opensea-scraper/blob/main/src/functions/offers.js

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
import puppeteer from 'puppeteer-extra';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser } from "puppeteer";
import { sleep } from "../utils";
import { OrdersResponse } from "./api_model_v2/orders";
import { BigNumber } from "ethers";

puppeteer.use(StealthPlugin())


function _parseWiredVariable(html: string) {
  const str = html.split("window.__wired__=")[1].split("</script>")[0];
  return JSON.parse(str);
}

export class OpenSeaPoller {
  browser: Promise<Browser>;
  additionalWait = 100; // millis

  constructor() {
    this.browser = this.startBrowser();
  }


  // GENERIC HANDLERS

  async startBrowser() {
    return await puppeteer.launch({
      headless: true,
      args: ['--start-maximized'],
    });
  }

  async closeBrowser() {
    await (await this.browser).close();
  }

  async newPage(url: string) {
    const page = await (await this.browser).newPage();
    await page.goto(url);
    console.log(`opening url ${url}`);
    // ...🚧 waiting for cloudflare to resolve
    console.log("🚧 waiting for cloudflare to resolve...");
    await page.waitForSelector('.cf-browser-verification', { hidden: true });
    // additional wait?
    const additionalWait = this.additionalWait;
    if (additionalWait > 0) {
      console.log(`additional wait active, waiting ${additionalWait / 1000} seconds...`);
      await sleep(additionalWait);
    }
    return page;
  }

  async getApiPageContent(url: string) {
    const page = await this.newPage(url);
    const text = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return document.querySelectorAll(".prettyprint")[1].textContent;
    }) as string;
    // skipping the first 4 lines
    const body = text.split('\n').slice(4).join('\n');
    // searching for the first curly brace
    const firstCurlyBrace = body.indexOf('{');
    // extracting the json
    const json = body.slice(firstCurlyBrace);

    await page.close();

    return JSON.parse(json);
  }

  async getRegularPageContent(url: string) {
    const page = await this.newPage(url);
    const html = await page.content();

    await page.close();

    return _parseWiredVariable(html);
  }



  // SPECIFIC METHODS


  async getSlugFromCollectionAddress(address: string) {
    return await this.getApiPageContent(`https://api.opensea.io/api/v1/asset_contract/${address}`) as AssetContractResponse;;
  }

  async getSignatures(address: string, tokenIds: string[]) {
    return await this.getApiPageContent(`https://api.opensea.io/`
      + `v2/orders/ethereum/seaport/listings?asset_contract_address=${address}`
      + `&limit=20&` + tokenIds.map(t => "token_ids=" + t).join('&')) as OrdersResponse;
  }


  async getFloorTokenIds(slug: string) {
    // buy now items with ETH or WETH:
    const __wired__ = await this.getRegularPageContent(`https://opensea.io/collection/${slug}?search[paymentAssets][0]=ETH&search[paymentAssets][1]=WETH&search[sortAscending]=true&search[sortBy]=UNIT_PRICE&search[toggles][0]=BUY_NOW`);
    // create currency dict to extract different offer currencies
    const currencyDict: { [key: string]: any } = {};
    Object.values(__wired__.records)
      .filter(o => (o as any).__typename === "AssetType")
      .forEach(_currency => {
        const currency = _currency as any;
        currencyDict[currency.id] = {
          id: currency.id,
          symbol: currency.symbol,
          imageUrl: currency.imageUrl,
          usdSpotPrice: currency.usdSpotPrice,
        };
      });
    // get all floorPrices (all currencies)
    const prices = Object.values(__wired__.records)
      .filter(o => (o as any).__typename === "PriceType" && (o as any).eth && (o as any).unit && (o as any).usd)
      .map(o => {
        return {
          eth: (o as any).eth as string | null,
          unit: (o as any).unit as string | null,
          usd: (o as any).usd as string | null,
        }
      });
    // get offers
    const offers = Object.values(__wired__.records)
      .filter(o => (o as any).__typename === "AssetType" && (o as any).tokenId)
      .map((o, idx) => {
        const tokenId = (o as any).tokenId as string;
        return {
          name: ((o as any).name as string | null) ?? tokenId ?? "", // tokenId as name if name===null (e.g. BoredApeYachtClub nfts do not have name)
          tokenId: tokenId,
          displayImageUrl: (o as any).displayImageUrl as string,
          price: prices[idx],
        };
      });

    if (offers.length !== prices.length) {
      console.log("WARNING: offers.length !== prices.length");
    }

    return offers;
  }

  async getOpenSeaFloorPriceBuyNowOrders(collection_address: string) {
    const c = await this.getSlugFromCollectionAddress(collection_address);
    const slug = c.collection.slug;
    console.log(slug);


    const offers = await this.getFloorTokenIds(slug);
    // console.log(offers);

    const orders = await this.getSignatures(collection_address, offers.map(o => o.tokenId));

    console.log(JSON.stringify(orders.orders?.map(o => ({
      id: BigNumber.from(o.protocol_data.parameters.offer?.[0]?.identifierOrCriteria).toHexString(),
      signature: o.protocol_data.signature,
      offerer: o.protocol_data.parameters.offerer,
      protocol_data: o.protocol_data,
    }))));

    await this.closeBrowser();
  }
}