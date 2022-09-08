import { task } from "hardhat/config";

task("deployments", "Show deployments on the current network")
  .setAction(async (taskArgs, hre) => {
    const { ethers, deployments, getNamedAccounts } = hre;
    const deploymentsObject = await deployments.all();
    // for each deployment
    for (const [name, deployment] of Object.entries(deploymentsObject)) {
      // get the deployed address
      const deployedAddress = deployment.address;
      console.log(`${name} at ${deployedAddress}`);
    }
    console.log("namedAccounts:");
    console.log({ namedAccounts: await getNamedAccounts() });
  });
