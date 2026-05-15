export const WALLET_STORAGE_KEY = "demo_wallets";
export const WALLET_TX_KEY = "demo_wallet_transactions";

export function getWallet(userId) {
  try {
    const wallets = JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY)) || [];
    let wallet = wallets.find(w => String(w.userId) === String(userId));
    if (!wallet) {
      wallet = {
        id: `WAL-${userId}`,
        userId,
        currency: "XAF",
        availableBalance: 0,
        escrowHeldBalance: 0,
        pendingVerificationBalance: 0,
        withdrawnBalance: 0,
        lifetimeEarnings: 0,
        updatedAt: new Date().toISOString()
      };
      wallets.push(wallet);
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    }
    return wallet;
  } catch {
    return null;
  }
}

export function updateWalletBalance(userId, { available = 0, escrow = 0, pending = 0, withdrawn = 0, lifetime = 0 }) {
  const wallets = JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY)) || [];
  const index = wallets.findIndex(w => String(w.userId) === String(userId));
  
  let wallet = index >= 0 ? wallets[index] : getWallet(userId);
  
  wallet.availableBalance += available;
  wallet.escrowHeldBalance += escrow;
  wallet.pendingVerificationBalance += pending;
  wallet.withdrawnBalance += withdrawn;
  wallet.lifetimeEarnings += lifetime;
  wallet.updatedAt = new Date().toISOString();
  
  if (index >= 0) {
    wallets[index] = wallet;
  } else {
    wallets.push(wallet);
  }
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  
  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent("invitegenie:wallet-updated", { detail: wallet }));
  return wallet;
}