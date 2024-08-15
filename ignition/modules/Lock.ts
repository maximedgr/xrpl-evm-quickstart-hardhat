import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
console.log("Start Lock deployment using hardhat ignition...");

const ONE_MINUTE_IN_FUTURE = Math.floor(Date.now() / 1000) + 60*5; // 5 minutes in the future
const TEN_XRP_IN_GWEI: bigint = 10n * 1_000_000_000n; // 10 XRP = 10,000,000,000 Gwei

const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", ONE_MINUTE_IN_FUTURE);
  const lockedAmount = m.getParameter("lockedAmount", TEN_XRP_IN_GWEI);

  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;
