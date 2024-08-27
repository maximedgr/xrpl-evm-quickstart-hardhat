import { ethers } from "hardhat";

async function main() {
  // Address of the deployed Lock contract
  const lockContractAddress = "0xYourLockContractAddressHere";

  // Get the Lock contract
  const Lock = await ethers.getContractFactory("Lock");
  const lock = Lock.attach(lockContractAddress);

  // Get the signer (your deploying account or the one with the necessary rights)
  const [deployer] = await ethers.getSigners();

  // Execute the withdraw function of the contract
  console.log("Attempting to withdraw funds...");

  try {
    const tx = await lock.connect(deployer).withdraw();
    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Withdrawal successful!");
  } catch (error) {
    console.error("Error during withdrawal:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
