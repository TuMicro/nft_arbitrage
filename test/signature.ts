import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { keccak256, toUtf8Bytes, _TypedDataEncoder } from "ethers/lib/utils";

export class SignatureUtils {

  static generateSignedDataStructHash(types: Record<string, Array<TypedDataField>>) {
    for (const [name, fields] of Object.entries(types)) {
      const structType = name + "(" + fields
        .map(field => field.type + " " + field.name).join(",") + ")";
      console.log(structType);
      console.log(keccak256(toUtf8Bytes(structType)));
    }
  }

  static async getDataHashToBeSigned(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>, 
    value: Record<string, any>,
    provider: ethers.providers.Provider,
  ) {
    // Populate any ENS names
    const populated = await _TypedDataEncoder.resolveNames(domain, types, value, async (name: string) => {
      const resolved = await provider.resolveName(name);
      if (resolved == null) {
        throw new Error(`Could not resolve name ${name}`);
      }
      return resolved;
    });

    const paramsHash = _TypedDataEncoder.from(types).hash(value);
    const hashToBeSigned = _TypedDataEncoder.hash(populated.domain, types, populated.value);
    return {
      hashToBeSigned,
      paramsHash,
    }
  }

  static validateObjectAgaintsTypes(types: Record<string, Array<TypedDataField>>,
    buyOrderV1: { [key: string]: any }) {
    // validate the buyOrderV1 object
    for (const [name, fields] of Object.entries(types)) {
      // make sure each field is present on the buyOrderV1
      for (const field of fields) {
        if (!(field.name in buyOrderV1)) {
          throw new Error(`missing field ${field.name}`);
        }
      }
      // make sure there are no extra fields on the buyOrderV1
      for (const fieldName of Object.keys(buyOrderV1)) {
        if (!fields.find((field) => field.name === fieldName)) {
          throw new Error(`unexpected field ${fieldName}`);
        }
      }
    }
  }
}