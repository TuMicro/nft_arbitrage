/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * This represents an Ethereum address (42-character hexadecimal string) with 0x appended in front.
 * @pattern ^0x[a-fA-F0-9]{40}$
 */
export type Address = string;

export interface PaginationInput {
  /** The number of page limit. */
  first?: number;

  /** The identifier to a record to start from. */
  cursor?: string;
}

export interface PriceFilterInput {
  /** Minimum value of the price range. This accepts the string representation of wei-based amount. */
  min?: string;

  /** Maximum value of the price range. This accepts the string representation of wei-based amount. */
  max?: string;
}

export interface CreateOrderRequest {
  /** 65-length ECDSA signature in Ethereum. Should start with 0x. Use the [`LooksRare SDK`](https://github.com/LooksRare/looksrare-sdk#signatures) and refer to its documentation for the signature generation. */
  signature: string;

  /** Collection contract address */
  collection: Address;

  /** This filed can be omitted when strategy refers to the address of collection offer contract. */
  tokenId?: string;

  /** Signer address */
  signer: Address;

  /** Strategy contract address. Address can be found in https://docs.looksrare.org/developers/deployed-contract-addresses */
  strategy: Address;

  /** Specifies whether the order is ask or bid */
  isOrderAsk: boolean;

  /** Currency token address. For example, use WETH address - 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 */
  currency: Address;

  /**
   * String representation of the nounce number.
   * @example 56
   */
  nonce: string;

  /**
   * String representation of the amount.
   * @example 1
   */
  amount: string;

  /**
   * String representation of the price, wei-based.
   * @example 2023600000000000000
   */
  price: string;

  /**
   * String representation of the start timestamp in seconds.
   * @example 1645553279
   */
  startTime: string;

  /**
   * String representation of the end timestamp in seconds. End time should be a future date time and should be after start time.
   * @example 1645554279
   */
  endTime: string;

  /**
   * Minimum percentage to ask. String representation of the actual percentage multiplied by 100.
   * @example 8500
   */
  minPercentageToAsk: string;

  /** Additional parameters */
  params?: string[];
}

export interface Account {
  address?: string;
  name?: string | null;
  biography?: string | null;
  websiteLink?: string | null;
  instagramLink?: string | null;
  twitterLink?: string | null;
  isVerified?: boolean;
}

export interface Collection {
  /** Collection contract address */
  address?: Address;

  /** Collection owner address */
  owner?: Address;

  /** Collection name shown on LooksRare website */
  name?: string | null;

  /** Collection description shown on LooksRare website */
  description?: string | null;
  symbol?: string | null;
  type?: "ERC721" | "ERC1155";
  websiteLink?: string | null;
  facebookLink?: string | null;
  twitterLink?: string | null;
  instagramLink?: string | null;
  telegramLink?: string | null;
  mediumLink?: string | null;
  discordLink?: string | null;

  /** Specifices if verified on LooksRare */
  isVerified?: boolean;

  /** Specifices if flagged as a contract with explicit content of NFTs */
  isExplicit?: boolean;
}

export interface CollectionStats {
  /** Collection contract address */
  address?: Address;

  /** Count of owners */
  countOwners?: number;

  /** Total supply */
  totalSupply?: number;

  /** Collection's lowest Ask order price */
  floorPrice?: string | null;

  /** Collection's lowest Ask order price for the last rolling 24h */
  floorChange24h?: number | null;

  /** Collection's lowest Ask order price for the last rolling 7d */
  floorChange7d?: number | null;

  /** Collection's lowest Ask order price for the last rolling 30d */
  floorChange30d?: number | null;

  /** Collection's floorPrice * totalSupply */
  marketCap?: string | null;

  /** Collection's sale volume for the last rolling 24h */
  volume24h?: string;

  /** Collection's average sale price in the last rolling 24h */
  average24h?: string;

  /** Collection's volume change in the last rolling 24h */
  change24h?: number | null;

  /** Collection's number of sales in the last rolling 24h */
  count24h?: number;

  /** Collection's sale volume for the last rolling 7d */
  volume7d?: string;

  /** Collection's average sale price in the last rolling 7d */
  average7d?: string;

  /** Collection's volume change in the last rolling 7d */
  change7d?: number | null;

  /** Collection's number of sales in the last rolling 7d */
  count7d?: number;

  /** Collection's sale volume for the last rolling 1m */
  volume1m?: string;

  /** Collection's average sale price in the last rolling 1m */
  average1m?: string;

  /** Collection's volume change in the last rolling 1m */
  change1m?: number | null;

  /** Collection's number of sales in the last rolling 1m */
  count1m?: number;

  /** Collection's sale volume for the last rolling 3m */
  volume3m?: string;

  /** Collection's average sale price in the last rolling 3m */
  average3m?: string;

  /** Collection's volume change in the last rolling 3m */
  change3m?: number | null;

  /** Collection's number of sales in the last rolling 3m */
  count3m?: number;

  /** Collection's sale volume for the last rolling 6m */
  volume6m?: string;

  /** Collection's average sale price in the last rolling 6m */
  average6m?: string;

  /** Collection's volume change in the last rolling 6m */
  change6m?: number | null;

  /** Collection's number of sales in the last rolling 6m */
  count6m?: number;

  /** Collection's sale volume for the last rolling 1y */
  volume1y?: string;

  /** Collection's average sale price in the last rolling 1y */
  average1y?: string;

  /** Collection's volume change in the last rolling 1y */
  change1y?: number | null;

  /** Collection's number of sales in the last rolling 1y */
  count1y?: number;

  /** Collection's sale volume off all time */
  volumeAll?: string;

  /** Collection's average sale price off all time */
  averageAll?: string;

  /** Collection's number of sales off all time */
  countAll?: number;
}

export interface Token {
  id?: number;

  /** Collection contract address */
  collectionAddress?: Address;
  tokenId?: string;
  tokenURI?: string | null;

  /** A link to an image/video hosted on Cloudinary */
  imageURI?: string;

  /** Specifices if flagged as a NFT with explicit content */
  isExplicit?: boolean;

  /** Specifices if the content is animated */
  isAnimated?: boolean;

  /** Describe the reason of being flagged */
  flag?: "NO_IMAGE" | "NONE" | "PORNOGRAPHY" | "TRIAGE";

  /** Token attributes */
  attributes?: Attribute[] | null;
}

export interface Attribute {
  /** @example Background effect */
  traitType?: string;

  /** @example CosUp */
  value?: string;

  /** @example string */
  displayType?: string;
}

export interface Order {
  /** keccak256 hash of order data */
  hash?: string;

  /** Collection contract address */
  collectionAddress?: Address;
  tokenId?: string | null;
  isOrderAsk?: boolean;

  /** Signer address */
  signer?: Address;

  /** Strategy contract address. Can be one of strategy contract addresses listed in https://docs.looksrare.org/developers/deployed-contract-addresses */
  strategy?: Address;

  /** Currency token adress. For example, this can be 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2, WETH address */
  currencyAddress?: Address;
  amount?: number;
  price?: string;
  nonce?: string;
  startTime?: number;
  endTime?: number;

  /**
   * Minimum percentage to ask. String representation of the actual percentage multiplied by 100.
   * @example 8500
   */
  minPercentageToAsk?: number;
  params?: string | null;

  /** 65-length ECDSA signature in Ethereum. Unless status is VALID, this will be null. */
  signature?: string;

  /** first 32 bytes of signature. Unless status is VALID, this will be null. */
  r?: string | null;

  /** second 32 bytes of signature. Unless status is VALID, this will be null. */
  s?: string | null;

  /** final 1 byte of signature. Unless status is VALID, this will be null. */
  v?: number | null;
  status?:
    | "CANCELLED"
    | "ERC_APPROVAL"
    | "ERC20_APPROVAL"
    | "ERC20_BALANCE"
    | "EXECUTED"
    | "EXPIRED"
    | "INVALID_OWNER"
    | "VALID";
}

export interface Event {
  id?: number;

  /** Address referring to a sender */
  from?: Address;

  /** Address referring to a receiver */
  to?: Address;

  /** Event type */
  type?: "MINT" | "TRANSFER" | "LIST" | "SALE" | "OFFER" | "CANCEL_LIST" | "CANCEL_OFFER";
  hash?: string | null;

  /** @format date-time */
  createdAt?: string;

  /** Collection object matching with the given collection address */
  collection?: Collection;

  /** Token object matching with the given token id */
  token?: Token;

  /** Order object matching with the given order hash */
  order?: Order;
}

export interface TradingReward {
  /** Account address */
  address?: Address;

  /** Merkle proofs for the address */
  proof?: string[];

  /** Total trading volume in WETH */
  volumeTotal?: string;

  /** Total rewards earned in LOOKS */
  looksTotal?: string;

  /** Trading volume in WETH for the past 24 hours */
  volume24h?: string;

  /** Trading rewards in LOOKS for the past 24 hours */
  looks24h?: string;

  /** @format date */
  date?: string;
}

export interface Reward {
  /** Account address */
  address?: Address;
  listing?: { proof?: string[]; looks24h?: string; looksTotal?: string; date?: string };
  trading?: {
    proof?: string[];
    looks24h?: string;
    looksTotal?: string;
    volume24h?: string;
    volumeTotal?: string;
    date?: string;
  };
}

export interface JsonResponse {
  success?: boolean;
  message?: string;

  /** Array or object */
  data?: object | any[];
}

export interface ErrorResponse {
  success?: boolean;
  name?: string;
  message?: string;
  data?: string;
}

export type UnauthorizedErrorResponse = ErrorResponse & { name?: string };

export type BadRequestErrorResponse = ErrorResponse & {
  errors?: { target?: object; value?: object; property?: string; children?: any[]; constraints?: object }[];
};

export interface TooManyRequestsErrorResponse {
  success?: boolean;
  message?: string;
  data?: string;
}
