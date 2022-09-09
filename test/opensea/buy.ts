import { Seaport11__factory } from "../../typechain_types";
import { OPENSEA_SEAPORT_1_1_MAINNET, ZERO_ADDRESS } from "../constants/addresses";
import { network, ethers } from "hardhat";
import { ONE_MINUTE_IN_MILLIS } from "../constants/time";
import { expect } from "chai";
import { block, sample_protocol_data } from "../constants/opensea_signature_testing";
import { BigNumber } from "ethers";

describe.only("OpenSea Transactions", () => {
  it("Must be able to buy an NFT", async () => {
    
    const blockNumber = await ethers.provider.getBlockNumber();
    expect(blockNumber).eq(block);

    const signers = await ethers.getSigners();

    const seaportContract = Seaport11__factory.connect(OPENSEA_SEAPORT_1_1_MAINNET, signers[0]);

    const params = sample_protocol_data.parameters;


    // [hardhat required] impersonating airdrop owner to enable claiming
    await network.provider.request({ // network from hardhat
      method: "hardhat_impersonateAccount",
      params: ["0xfBf8de425f5CEC239908Fda8f9De2D94D9718094"],
    });
    const externalAccount = await ethers.getSigner("0xfBf8de425f5CEC239908Fda8f9De2D94D9718094");

    // get sum of considerations with token zero (ETH)
    const sumOfEthConsiderations = params.consideration.reduce((acc, curr) => {
      return acc.add(curr.token == ZERO_ADDRESS ? curr.startAmount : 0); // TODO: support WETH (or other tokens)
    }, BigNumber.from(0));

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
      signature: sample_protocol_data.signature,
    }, {
      value: sumOfEthConsiderations,
    });

    // TODO: extract data and compare with output_data even if transaction fails
    // console.log(tr.data);
    // expect(tr.data).to.equal(ouput_data);

    const r = await tr.wait();

    console.log(r.transactionHash);

    console.log("Buy successful! 👌");


  }).timeout(5 * ONE_MINUTE_IN_MILLIS);
});

