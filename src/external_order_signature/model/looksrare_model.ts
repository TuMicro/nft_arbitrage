/**
 * This represents an Ethereum address (42-character hexadecimal string) with 0x appended in front.
 * @pattern ^0x[a-fA-F0-9]{40}$
 */
 export type Address = string;
 
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