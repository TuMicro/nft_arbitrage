import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ProtocolData } from "../../src/opensea_interactions/api_model_v2/orders";
import { getEthTotalPriceFromOrder } from "../../src/opensea_interactions/util";
import { Seaport11__factory } from "../../typechain_types";
import { OPENSEA_SEAPORT_1_1_MAINNET, ZERO_ADDRESS } from "../constants/addresses";

export async function buy(protocolData: ProtocolData, externalAccount: SignerWithAddress) {
  
  const seaportContract = Seaport11__factory.connect(OPENSEA_SEAPORT_1_1_MAINNET, externalAccount);
  const params = protocolData.parameters;

  if (params.consideration == null) {
    throw new Error("Consideration is null");
  }

  if (params.offer == null) {
    throw new Error("Offer is null");
  }

  // get sum of considerations with token zero (ETH)
  // TODO: support WETH (or other tokens)
  const sumOfEthConsiderations = getEthTotalPriceFromOrder(params);

  const tr = await seaportContract.connect(externalAccount).fulfillBasicOrder({
    considerationToken: params.consideration[0].token,
    considerationIdentifier: params.consideration[0].identifierOrCriteria,
    considerationAmount: params.consideration[0].startAmount,
    offerer: params.offerer,
    zone: params.zone,
    offerToken: params.offer[0].token,
    offerIdentifier: params.offer[0].identifierOrCriteria,
    offerAmount: params.offer[0].startAmount,
    basicOrderType: params.orderType,
    startTime: params.startTime,
    endTime: params.endTime,
    zoneHash: params.zoneHash,
    salt: params.salt,
    offererConduitKey: params.conduitKey, // TODO: not sure about this one
    fulfillerConduitKey: params.conduitKey, // TODO: not sure about this one
    totalOriginalAdditionalRecipients: params.consideration.length - 1,
    additionalRecipients: params.consideration.slice(1).map((item) => {
      return {
        recipient: item.recipient,
        amount: item.startAmount,
      };
    }),
    signature: protocolData.signature,
  }, {
    value: sumOfEthConsiderations,
  });

  // TODO: extract data and compare with output_data even if transaction fails
  // console.log(tr.data);
  // expect(tr.data).to.equal(ouput_data);

  const r = await tr.wait();

  console.log(r.transactionHash);

  console.log("Buy successful! 👌");
}