export interface AssetContractResponse {
  collection: Collection;
  address: string;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version: string;
  opensea_version?: null;
  owner: number;
  schema_name: string;
  symbol: string;
  total_supply?: null;
  description: string;
  external_link: string;
  image_url: string;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address?: null;
}
export interface Collection {
  banner_image_url: string;
  chat_url?: null;
  created_date: string;
  default_to_fiat: boolean;
  description: string;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url: string;
  display_data: DisplayData;
  external_url: string;
  featured: boolean;
  featured_image_url: string;
  hidden: boolean;
  safelist_request_status: string;
  image_url: string;
  is_subject_to_whitelist: boolean;
  large_image_url: string;
  medium_username?: null;
  name: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: string;
  payout_address?: null;
  require_email: boolean;
  short_description?: null;
  slug: string;
  telegram_url?: null;
  twitter_username: string;
  instagram_username?: null;
  wiki_url: string;
  is_nsfw: boolean;
  fees: Fees;
}
export interface DisplayData {
  card_display_style: string;
}
export interface Fees {
  seller_fees: SellerFees;
  opensea_fees: OpenseaFees;
}
export interface SellerFees {
  // unknown
}
export interface OpenseaFees {
  [key: string]: number;
}
