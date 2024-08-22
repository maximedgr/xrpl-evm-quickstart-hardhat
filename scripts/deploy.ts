import { ethers } from "hardhat";

async function main() {
  // Deploy the Lock contract
  console.log("Start Lock deployment...");

  // Prepare deployments args to be passed to the constructor
  const unlockTime = Math.floor(Date.now() / 1000) + 60*5; // 5 minutes in the future
  const value_im_locking = ethers.parseEther("10"); // Parsing ETH/XRP value into WEI (1ETH = 10^18wei)
  console.log("Locking 10 XRP");
  console.log("Unlocking time: "+unlockTime);

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: value_im_locking });

  console.log("Lock contract deployed to:", lock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
