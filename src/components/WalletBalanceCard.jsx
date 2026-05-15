import React from 'react';

export default function WalletBalanceCard({ wallet }) {
  if (!wallet) return null;
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex flex-col gap-2">
      <div className="text-lg font-bold text-indigo-300">Wallet Balance</div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span>Pending Verification</span>
          <span className="text-yellow-400">{wallet.pendingVerificationBalance} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Escrow Held</span>
          <span className="text-blue-400">{wallet.escrowHeldBalance} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Available</span>
          <span className="text-green-400">{wallet.availableBalance} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Withdrawn</span>
          <span className="text-gray-400">{wallet.withdrawnBalance} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Disputed</span>
          <span className="text-red-400">{wallet.disputedBalance} FCFA</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">Last updated: {wallet.updatedAt && new Date(wallet.updatedAt).toLocaleString()}</div>
    </div>
  );
}
