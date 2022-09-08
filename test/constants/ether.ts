import { BigNumber, ethers } from "ethers";

export const ETHER = ethers.constants.WeiPerEther;
export const GWEI = BigNumber.from(10).pow(9);
export const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);