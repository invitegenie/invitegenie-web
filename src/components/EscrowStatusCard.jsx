import React from 'react';

export default function EscrowStatusCard({ escrow }) {
  if (!escrow) return null;
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex flex-col gap-2">
      <div className="text-lg font-bold text-indigo-300">Escrow Status</div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span>Status</span>
          <span className="text-yellow-400">{escrow.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Held</span>
          <span className="text-blue-400">{escrow.remainingHeld} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Released</span>
          <span className="text-green-400">{escrow.totalReleased} FCFA</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">Created: {escrow.createdAt && new Date(escrow.createdAt).toLocaleString()}</div>
    </div>
  );
}
