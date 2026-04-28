import Modal, { useModal } from "./Modal";

export function MarketplaceModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Marketplace" onClose={onClose}>
      <div className="space-y-4 text-center">
        <span className="material-symbols-outlined text-6xl text-purple-400 mx-auto block">
          storefront
        </span>
        <h3 className="text-xl font-bold text-white">Coming Soon</h3>
        <p className="text-slate-400">
          Explore premium invitation templates, themes, and premium features.
        </p>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export function SettingsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Settings" onClose={onClose}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Theme</label>
          <select className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white">
            <option>Dark Mode</option>
            <option>Light Mode</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Notifications</label>
          <input type="checkbox" className="rounded" defaultChecked /> Email Notifications
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </Modal>
  );
}

export function ConvertPointsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Convert Points" onClose={onClose}>
      <div className="space-y-4 text-center">
        <span className="material-symbols-outlined text-6xl text-emerald-400 mx-auto block">
          card_giftcard
        </span>
        <h3 className="text-xl font-bold text-white">Convert Your Points</h3>
        <p className="text-slate-400 text-sm">
          Redeem your Genie Points for premium features, templates, and more.
        </p>
        <div className="bg-slate-800 rounded-lg p-4 mt-4">
          <p className="text-sm text-slate-300">Your Points: <span className="text-emerald-400 font-bold">2,450</span></p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
        >
          Coming Soon
        </button>
      </div>
    </Modal>
  );
}

export function MakeAWishModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Make a Wish" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-slate-400 text-sm">
          Describe what you'd like from InviteGenie. Our AI will help make it happen!
        </p>
        <textarea
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500"
          placeholder="I wish for..."
          rows={4}
        />
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          Submit Wish
        </button>
      </div>
    </Modal>
  );
}

export function SummonGenieModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="Summon a Genie" onClose={onClose}>
      <div className="space-y-4 text-center">
        <span
          className="material-symbols-outlined text-6xl text-yellow-400 mx-auto block animate-pulse"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
        <h3 className="text-xl font-bold text-white">AI Content Generator</h3>
        <p className="text-slate-400 text-sm">
          Generate professional event descriptions, guest lists, and more with AI.
        </p>
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-colors"
        >
          Start Generating
        </button>
      </div>
    </Modal>
  );
}
