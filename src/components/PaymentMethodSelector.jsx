import React from "react";
import { PAYMENT_PROVIDERS } from "../services/paymentProviderConfig";
import Icon from "./Icon";

export default function PaymentMethodSelector({ selectedProviderId, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PAYMENT_PROVIDERS.filter(p => p.enabled).map(provider => {
        const isSelected = selectedProviderId === provider.id;
        const isRecommended = ["mtn_momo", "orange_money", "cinetpay"].includes(provider.id);
        
        return (
          <button
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className={`relative flex flex-col items-start text-left p-4 rounded-2xl border transition-all ${
              isSelected ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-900/20" : "border-white/10 bg-slate-900/50 hover:bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white ${provider.color}`}>{provider.logoText}</div>
              {isSelected && <Icon name="check_circle" className="text-violet-400" />}
            </div>
            <p className="font-bold text-white text-sm">{provider.name}</p>
            {isRecommended && <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Recommended</span>}
          </button>
        );
      })}
    </div>
  );
}