export interface OrdersResponse {
  next?: string;
  previous?: null;
  orders?: (OrdersEntity)[] | null;
}
export interface OrdersEntity {
  created_date: string;
  closing_date: string;
  listing_time: number;
  expiration_time: number;
  order_hash: string;
  protocol_data: ProtocolData;
  protocol_address: string;
  maker: AccountOrMaker;
  taker?: null;
  current_price: string;
  maker_fees?: (MakerFeesEntity)[] | null;
  taker_fees?: (null)[] | null;
  side: string;
  order_type: string;
  cancelled: boolean;
  finalized: boolean;
  marked_invalid: boolean;
  client_signature: string;
  relay_id: string;
  criteria_proof?: null;
  maker_asset_bundle: MakerAssetBundle;
  taker_asset_bundle: TakerAssetBundle;
}
export interface ProtocolData {
  parameters: Parameters;
  signature: string;
}
export interface Parameters {
  offerer: string;
  offer?: (OfferEntity)[] | null;
  consideration?: (ConsiderationEntity)[] | null;
  startTime: string;
  endTime: string;
  orderType: number;
  zone: string;
  zoneHash: string;
  salt: string;
  conduitKey: string;
  totalOriginalConsiderationItems: number;
  counter: number;
}
export interface OfferEntity {
  itemType: number;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
}
export interface ConsiderationEntity {
  itemType: number;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
  recipient: string;
}
export interface AccountOrMaker {
  user: number;
  profile_img_url: string;
  address: string;
  config: string;
}
export interface MakerFeesEntity {
  account: Account;
  basis_points: string;
}
export interface Account {
  user?: number | null;
  profile_img_url: string;
  address: string;
  config: string;
}
export interface MakerAssetBundle {
  assets?: (AssetsEntity)[] | null;
  maker?: null;
  slug?: null;
  name?: null;
  description?: null;
  external_link?: null;
  asset_contract: AssetContract;
  permalink: string;
  seaport_sell_orders?: null;
}
export interface AssetsEntity {
  id: number;
  num_sales: number;
  background_color?: null;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  animation_url?: null;
  animation_original_url?: null;
  name?: null;
  description?: null;
  external_link?: null;
  asset_contract: AssetContract;
  permalink: string;
  collection: Collection;
  decimals: number;
  token_metadata: string;
  is_nsfw: boolean;
  owner: Owner;
  token_id: string;
}
export interface AssetContract {
  address: string;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version: string;
  opensea_version?: null;
  owner: number;
  schema_name: string;
  symbol: string;
  total_supply: string;
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
  payout_address: string;
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
  payout_address: string;
  require_email: boolean;
  short_description?: null;
  slug: string;
  telegram_url?: null;
  twitter_username: string;
  instagram_username?: null;
  wiki_url?: null;
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
  [key: string]: number;
}
export interface OpenseaFees {
  [key: string]: number;
}
export interface Owner {
  user: User;
  profile_img_url: string;
  address: string;
  config: string;
}
export interface User {
  username: string;
}
export interface TakerAssetBundle {
  assets?: (AssetsEntity1)[] | null;
  maker?: null;
  slug?: null;
  name?: null;
  description?: null;
  external_link?: null;
  asset_contract: AssetContract1;
  permalink: string;
  seaport_sell_orders?: null;
}
export interface AssetsEntity1 {
  id: number;
  num_sales: number;
  background_color?: null;
  image_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_original_url: string;
  animation_url?: null;
  animation_original_url?: null;
  name: string;
  description: string;
  external_link?: null;
  asset_contract: AssetContract1;
  permalink: string;
  collection: Collection1;
  decimals: number;
  token_metadata?: null;
  is_nsfw: boolean;
  owner: Owner;
  token_id: string;
}
export interface AssetContract1 {
  address: string;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version?: null;
  opensea_version?: null;
  owner?: null;
  schema_name: string;
  symbol: string;
  total_supply?: null;
  description: string;
  external_link?: null;
  image_url?: null;
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
export interface Collection1 {
  banner_image_url?: null;
  chat_url?: null;
  created_date: string;
  default_to_fiat: boolean;
  description: string;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url?: null;
  display_data: SellerFeesOrDisplayData;
  external_url?: null;
  featured: boolean;
  featured_image_url?: null;
  hidden: boolean;
  safelist_request_status: string;
  image_url?: null;
  is_subject_to_whitelist: boolean;
  large_image_url?: null;
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
  twitter_username?: null;
  instagram_username?: null;
  wiki_url?: null;
  is_nsfw: boolean;
  fees: Fees1;
}
export interface SellerFeesOrDisplayData {
}
export interface Fees1 {
  seller_fees: SellerFeesOrDisplayData;
  opensea_fees: OpenseaFees;
}
