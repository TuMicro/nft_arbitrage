# Description

NOTE: This code is not yet ready for production use. It is a work in progress.

## Overview

This repository aims to poll information from OpenSea and LooksRare (and probably more marketplaces in the future) and execute on arbitrage opportunities.

We will use flashloans to be able to execute on big opportunities without requiring a large amount of capital.

We will send the transaction with Flashbots to avoid being frontrun (avoid mempool) and to avoid paying gas fees in case of failure.

Many of the features implemented (or to be implemented) here are intended to be part of a larger project that we are building on stealth mode for now.

## Summary

What has been built so far:

* Given an ERC721 collection on the Ethereum mainnet, we get the floor NFT on OpenSea and we buy it, then we sell it on LooksRare to the highest bid.
* We run this using Hardhat in a local mainnet fork.

[Link to the video demo.]()

# How to run 

1. You will need nodejs 16.13.2 (but probably any higher version will work).
2. Fill in the `.env` file with, preferrably, newly generated keys (you can use https://vanity-eth.tk/ although not recommended for production use) and an infura key. (see `.env.example` for the format). OPENSEA_API_KEY and ETHERSCAN_API_KEY are optional for now.
3. Run `npm install` to install the dependencies.
4. Run:
```
npx hardhat compile
npx hardhat typechain
npx hardhat test
```

## Notes

* If adding new files to external_abis (or even when changing solidity code) run `npx hardhat typechain` to update the typechain types. If this fails to update types then temporary comment out problematic tasks on the `hardhat.config.ts` file.
* The recommended IDE is VSCode.
* Solhint works on VSCode even without having it on dependencies. (tested with the Juan Blanco Solidity vscode extension).

## Deployment (this part is not ready yet)

Base command: 
```
npx hardhat --network <networkName> deploy [options and flags]
```

Use this first for testing:
```
npx hardhat --network hardhat deploy --report-gas
```

Live networks:
Make sure to change the addresses (mainnet vs rinkeby) in externalmarketplaces libraries:
```
npx hardhat --network rinkeby deploy

npx hardhat --network optimism deploy
```

Logs:
* Deployment address: 
  * 1: 

* Rinkeby (public keys used)
  * Owner/deployer: 
  * User: 
  * Initial NFT holder: 

## Post-deployment tasks

Some useful ones:
```
# verify source code (make sure to set the config with forkForVerification)
npx hardhat --network rinkeby etherscan-verify --solc-input
# see deployments
npx hardhat deployments --network rinkeby
# get execution information
npx hardhat get_execution --execution 0 --network rinkeby
# flatten solidity
npx hardhat flatten > flattened.sol
```

### About the custom hardhat tasks implemented

See all the tasks:
```
npx hardhat
```

## Utils

Showing the commits tree:
```
git log --oneline --graph --decorate --all
```

## Acknowledgements

Parts of the code are based on the following repos:

* https://github.com/dcts/opensea-scraper

