import { Wallet } from "ethers";

export const FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY ?? "";

if (FLASHBOTS_RELAY_SIGNING_KEY === "") {
  throw new Error("FLASHBOTS_RELAY_SIGNING_KEY is not set. Must provide FLASHBOTS_RELAY_SIGNING_KEY. Please see https://github.com/flashbots/pm/blob/main/guides/searcher-onboarding.md");
}

export const flashbotsRelaySigningWallet = new Wallet(FLASHBOTS_RELAY_SIGNING_KEY);
