import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";
import { USER_ROLES } from "../services/roles";
import useEngineCollection from "./useEngineCollection";
import { useAuth } from "../auth/AuthContext";

export default function UsersManagement() {
  const { role: currentUserRole } = useAuth();
  const users = useEngineCollection(KEYS.USERS) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [editingUser, setEditingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Access Control: Only admins can manage the registry
  const isAdmin = [USER_ROLES.SUPER_ADMIN, USER_ROLES.APP_ADMIN].includes(currentUserRole);

  const tiers = ["BASIC", "PRO", "BUSINESS", "STAFF", "GOD_MODE"];

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const matchesSearch = 
        (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
      const matchesTier = tierFilter === "All Tiers" || (u.tier || "BASIC") === tierFilter;
      return matchesSearch && matchesRole && matchesTier;
    });
  }, [users, searchTerm, roleFilter, tierFilter]);

  const handleUpdateUser = (updatedData) => {
    const updatedUsers = users.map(u => u.id === updatedData.id ? { ...u, ...updatedData } : u);
    Engine.save(KEYS.USERS, updatedUsers);
    setEditingUser(null);
  };

  const handleAddUser = (newData) => {
    const newUser = {
      ...newData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    Engine.save(KEYS.USERS, [newUser, ...users]);
    setIsAddModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to remove this user from the realm?")) {
      const updatedUsers = users.filter(u => u.id !== id);
      Engine.save(KEYS.USERS, updatedUsers);
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 shadow-2xl shadow-rose-900/20">
             <Icon name="lock" className="text-rose-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Security Alert</h2>
          <p className="text-slate-500 max-w-sm">Access to the User Registry is restricted to Administrative spirits only.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#F9FAFB] tracking-tighter uppercase">User Registry</h1>
            <p className="text-[#9CA3AF] text-xs mt-1 uppercase font-black tracking-widest">Global User Directory & Role Control</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative min-w-[300px]">
               <Icon name="search" className="absolute left-3 top-2.5 text-gray-500 text-sm" />
               <input 
                 type="text" 
                 placeholder="Search by name or email..." 
                 className="w-full bg-[#111827] border border-[#2A3342] text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button 
               onClick={() => setIsAddModalOpen(true)}
               className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-purple-900/40"
             >
               Add Resident
             </button>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center bg-[#111827] p-4 rounded-2xl border border-[#2A3342]">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0B0F19] border border-[#2A3342] text-[#9CA3AF] rounded-lg px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-[#8B5CF6]/50"
          >
            <option>All Roles</option>
            {Object.values(USER_ROLES).map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>

          <select 
            value={tierFilter} 
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#0B0F19] border border-[#2A3342] text-[#9CA3AF] rounded-lg px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-[#8B5CF6]/50"
          >
            <option>All Tiers</option>
            {tiers.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="ml-auto text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
            {filteredUsers.length} Residents Indexed
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#111827] border border-[#2A3342] rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#151A25] border-b border-[#2A3342]">
                <tr className="text-[10px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Account Tier</th>
                  <th className="px-8 py-5">Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3342]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] flex items-center justify-center text-white font-black text-xs">
                          {(u.name || u.email || "U")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{u.name || "Anonymous Genie"}</p>
                          <p className="text-xs text-[#6B7280] truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-8 py-5">
                      <TierBadge tier={u.tier} />
                    </td>
                    <td className="px-8 py-5 text-xs text-[#9CA3AF]">
                      {new Date(u.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(u)}
                          className="p-2 bg-[#1F2937] border border-[#2A3342] rounded-lg text-[#9CA3AF] hover:text-[#8B5CF6] transition-all"
                        >
                          <Icon name="edit" className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 bg-[#1F2937] border border-[#2A3342] rounded-lg text-[#9CA3AF] hover:text-[#EF4444] transition-all"
                        >
                          <Icon name="delete" className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                       <Icon name="person_off" className="text-5xl text-[#2A3342] mb-4" />
                       <p className="text-[#6B7280] font-black uppercase tracking-widest text-xs">No residents found in the registry</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={handleUpdateUser}
          roles={Object.values(USER_ROLES)}
          tiers={tiers}
        />
      )}

      {isAddModalOpen && (
        <AddUserModal 
          onClose={() => setIsAddModalOpen(null)} 
          onSave={handleAddUser}
          roles={Object.values(USER_ROLES)}
          tiers={tiers}
        />
      )}
    </Layout>
  );
}

function RoleBadge({ role }) {
  const config = {
    SUPER_ADMIN: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
    APP_ADMIN: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20",
    EVENT_HOST: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
    STAFF_AGENT: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    BASIC_USER: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  };

  const styles = config[role] || "text-gray-500 bg-gray-500/10 border-gray-500/20";

  return (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles}`}>
      {role?.replace('_', ' ')}
    </span>
  );
}

function TierBadge({ tier }) {
  const isPremium = ["PRO", "BUSINESS", "GOD_MODE"].includes(tier?.toUpperCase());
  return (
    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${isPremium ? 'text-amber-400' : 'text-slate-500'}`}>
      {isPremium && <Icon name="diamond" className="text-[14px]" />}
      {tier || "BASIC"}
    </span>
  );
}

function EditUserModal({ user, onClose, onSave, roles, tiers }) {
  const [formData, setFormData] = useState({ ...user });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-[#2A3342] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-[#2A3342]">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Modify Access</h2>
          <p className="text-xs text-[#9CA3AF] mt-1 font-bold uppercase tracking-widest">{user.email}</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Assign Role</label>
            <select 
              className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Account Tier</label>
            <select 
              className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              value={formData.tier || "BASIC"}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            >
              {tiers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-4 rounded-2xl border border-[#2A3342] text-[#9CA3AF] text-xs font-black uppercase tracking-widest hover:bg-[#1F2937] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(formData)} 
              className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-900/40 hover:opacity-90 active:scale-95 transition-all"
            >
              Confirm Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onSave, roles, tiers }) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "BASIC_USER", tier: "BASIC" });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-[#2A3342] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-[#2A3342]">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Summon New Resident</h2>
          <p className="text-xs text-[#9CA3AF] mt-1 font-bold uppercase tracking-widest">Create a manual user identity</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Full Name</label>
            <input 
              className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              placeholder="Enter name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Email Address</label>
            <input 
              className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              placeholder="email@example.cm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Role</label>
              <select 
                className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-xs text-white outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest px-1">Tier</label>
              <select 
                className="w-full bg-[#0B0F19] border border-[#2A3342] rounded-xl px-4 py-3 text-xs text-white outline-none"
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              >
                {tiers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-4 rounded-2xl border border-[#2A3342] text-[#9CA3AF] text-xs font-black uppercase hover:bg-[#1F2937]">Cancel</button>
            <button 
              onClick={() => onSave(formData)} 
              className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] text-white text-xs font-black uppercase shadow-xl hover:opacity-90 active:scale-95"
            >Create User</button>
          </div>
        </div>
      </div>
    </div>
  );
}
