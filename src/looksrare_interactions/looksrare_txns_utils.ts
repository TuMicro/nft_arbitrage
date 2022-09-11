import { Order } from "./looks_rare_api_model";
import { BigNumber, ethers } from 'ethers';

export const LOOKSRARE_CONTRACT_ETHEREUM = "0x59728544B08AB483533076417FbBB2fD0B17CE3a";
export const LOOKSRARE_ERC721_TRANSFER_MANAGER_CONTRACT_ETHEREUM = "0xf42aa99f011a1fa7cda90e5e98b277e306bca83e";


const TAKER_ORDER_STRUCT_TYPES = ['bool', 'address', 'uint256', 'uint256', 'uint256', 'bytes'];
const MAKER_ORDER_STRUCT_TYPES = [
  'bool',
  'address',
  'address',
  'uint256',
  'uint256',
  'uint256',
  'address',
  'address',
  'uint256',
  'uint256',
  'uint256',
  'uint256',
  'bytes',
  'uint8',
  'bytes32',
  'bytes32',
];

export class LooksRareTxnUtils {

  static async prepareBuyNftTransaction(
    looksRareExchangeContract: ethers.Contract,
    makerOrder: Order,
    taker: string,
  ) {
    const takerBidArray = [
      false,
      taker,
      makerOrder.price,
      makerOrder.tokenId,
      BigNumber.from(0), // doesnt matter in taker bid
      [],
    ];
    const takerBid = ethers.utils.AbiCoder.prototype.encode(
      TAKER_ORDER_STRUCT_TYPES,
      takerBidArray,
    );
    const makerAskArray = [
      makerOrder.isOrderAsk,
      makerOrder.signer,
      makerOrder.collectionAddress,
      makerOrder.price,
      makerOrder.tokenId,
      makerOrder.amount, // number of NFTs
      makerOrder.strategy,
      makerOrder.currencyAddress,
      makerOrder.nonce,
      makerOrder.startTime,
      makerOrder.endTime,
      makerOrder.minPercentageToAsk,
      (makerOrder.params ?? "").length === 0 ? [] : makerOrder.params, // TODO: test whether this works with Private listings
      makerOrder.v,
      makerOrder.r,
      makerOrder.s,
    ];
    const makerAsk = ethers.utils.AbiCoder.prototype.encode(
      MAKER_ORDER_STRUCT_TYPES,
      makerAskArray,
    );

    const t = await looksRareExchangeContract.populateTransaction.matchAskWithTakerBid(
      takerBidArray,
      makerAskArray,
    );
    return {
      target: looksRareExchangeContract.address,
      payload: t.data!,
    }
  }

  static async prepareSellNftTransaction(
    looksRareExchangeContract: ethers.Contract,
    tokenId: string, // needed in case of matching with a collection-level big (strategy: StrategyAnyItemFromCollectionForFixedPrice)
    makerOrder: Order,
    minPercentageToAsk: BigNumber, // (from 0 to 10_000) min percentage to receive of the bid price, slippage protection in case of royalty fees changing
    taker: string, // must be the message.sender
  ) {
    const takerAskArray = [
      true,
      taker,
      makerOrder.price,
      tokenId,
      minPercentageToAsk,
      [],
    ];
    // next line helps debugging the encoding
    const takerBid = ethers.utils.AbiCoder.prototype.encode(
      TAKER_ORDER_STRUCT_TYPES,
      takerAskArray,
    );
    // console.log("taker done");
    const makerBidArray = [
      makerOrder.isOrderAsk,
      makerOrder.signer,
      makerOrder.collectionAddress,
      makerOrder.price,
      makerOrder.tokenId ?? 0, // must have a value
      makerOrder.amount,
      makerOrder.strategy,
      makerOrder.currencyAddress,
      makerOrder.nonce,
      makerOrder.startTime,
      makerOrder.endTime,
      makerOrder.minPercentageToAsk,
      (makerOrder.params ?? "").length === 0 ? [] : makerOrder.params,
      makerOrder.v,
      makerOrder.r,
      makerOrder.s,
    ];
    // next line helps debugging the encoding
    const maker = ethers.utils.AbiCoder.prototype.encode(
      MAKER_ORDER_STRUCT_TYPES,
      makerBidArray,
    );
    // console.log("maker done");

    const t = await looksRareExchangeContract.populateTransaction.matchBidWithTakerAsk(
      takerAskArray,
      makerBidArray,
    );
    return {
      target: looksRareExchangeContract.address,
      payload: t.data!,
      populatedTransaction: t,
    }
  }
}