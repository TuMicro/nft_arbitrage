import { BigNumber } from "ethers";

export const ONE_DAY_IN_SECONDS = 24 * 3600;
export const ONE_HOUR_IN_SECONDS = 3600;

export const ONE_MINUTE_IN_MILLIS = 60 * 1000;
export const ONE_HOUR_IN_MILLIS = 60 * ONE_MINUTE_IN_MILLIS;
export const ONE_DAY_IN_MILLIS = 24 * ONE_HOUR_IN_MILLIS;


export function getUnixTimestamp() {
  return BigNumber.from(Math.floor(Date.now() / 1000));
}