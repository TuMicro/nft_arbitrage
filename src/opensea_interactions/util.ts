import { BigNumber } from "ethers";
import { Parameters } from "../../src/opensea_interactions/api_model_v2/orders";
import { ZERO_ADDRESS } from "../../test/constants/addresses";

export function getEthTotalPriceFromOrder(params: Parameters) {
  return (params.consideration ?? []).reduce((acc, curr) => {
    return acc.add(curr.token === ZERO_ADDRESS ? curr.startAmount : 0);
  }, BigNumber.from(0));
}