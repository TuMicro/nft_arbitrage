import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { WETH_ADDRESS } from '../test/constants/addresses';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment,) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // TODO: deploy here
  
  // console.log("Deployed  at " + .address + " 🎉");

};
export default func;