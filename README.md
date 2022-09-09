# Description

TODO: add this

# Development

Repo tested using nodejs 16.13.2

Solhint works through vscode even without having it on dependencies. (tested with the Juan Blanco Solidity vscode extension)

Usage:
```
npx hardhat compile
npx hardhat test
```

## Notes

* If you change the Order structs don't forget to update its values on the test files and update the scheme hash in solidity. You can get the schemes hashes from the first lines of `npx hardhat test`. Otherwise tests will throw `'Signature: Invalid'`
* If adding new files to external_abis (or even when changing solidity code) run `npx hardhat typechain` to update the typechain types. If this fails to update types then temporary comment out problematic tasks on the `hardhat.config.ts` file.

## Deployment

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

