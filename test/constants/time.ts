import { BigNumber } from "ethers";

export const ONE_DAY_IN_SECONDS = 24 * 3600;
export const ONE_HOUR_IN_SECONDS = 3600;

export function getUnixTimestamp() {
  return BigNumber.from(Math.floor(Date.now() / 1000));
}