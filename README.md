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


Check all the tasks:
```
npx hardhat
```

Run some useful ones (careful):
```
# if it fails for not approving just try again: (make sure the ERC721holder has the NFT as set up in the task)
npx hardhat execute_buy --network rinkeby

npx hardhat list_on_opensea --network rinkeby

npx hardhat list_on_looksrare --network rinkeby

# make sure to use the order from the list_on_looksrare task:
npx hardhat validate_looksrare_signature --network rinkeby

# if it fails for not approving just try again: 
npx hardhat buy_on_looksrare --network rinkeby

```

## Utils

Showing the commits tree:
```
git log --oneline --graph --decorate --all
```
