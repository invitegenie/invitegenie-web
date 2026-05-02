import React, { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import Icon from "../../components/Icon";
import * as Engine from "../../auth/coreEngine";
import { KEYS } from "../../auth/coreEngine";
import useEngineCollection from "../useEngineCollection";
import { useAuth } from "../../auth/AuthContext";
import { USER_ROLES } from "../../auth/roles";

export default function SystemAuditLog() {
  const { role, currentUser } = useAuth();
  const logs = useEngineCollection(KEYS.AUDIT_LOGS) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [adminFilter, setAdminFilter] = useState("All Administrators");

  const isAdmin = [USER_ROLES.SUPER_ADMIN, USER_ROLES.APP_ADMIN].includes(role);

  const uniqueAdmins = useMemo(() => {
    const adminMap = {};
    logs.forEach(log => {
      if (log.adminId) {
        adminMap[log.adminId] = log.adminName;
      }
    });
    return Object.entries(adminMap).map(([id, name]) => ({ id, name }));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAdmin = adminFilter === "All Administrators" || log.adminId === adminFilter;

      return matchesSearch && matchesAdmin;
    });
  }, [logs, searchTerm, adminFilter]);

  const handleAcknowledge = (logId) => {
    Engine.updateAuditLog(logId, {
      status: "reviewed",
      reviewedBy: currentUser?.name || "Super Admin",
      reviewedAt: new Date().toISOString(),
    });
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 shadow-2xl">
            <Icon name="security" className="text-4xl text-rose-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Security Violation</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">Only high-level spirits may view the chronicles.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8 pb-32 font-sans animate-in fade-in duration-500">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F9FAFB]">Chronicles of Action</h1>
            <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF]">Immutable System Audit Logs</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="rounded-xl border border-[#2A3342] bg-[#111827] px-4 py-3 text-xs font-bold text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all"
            >
              <option>All Administrators</option>
              {uniqueAdmins.map((admin) => (
                <option key={admin.id} value={admin.id}>{admin.name}</option>
              ))}
            </select>
            <div className="relative w-full lg:w-80">
              <Icon name="search" className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-[#2A3342] bg-[#111827] py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
              />
            </div>
          </div>
        </header>

        <div className="overflow-hidden rounded-[2.5rem] border border-[#2A3342] bg-[#111827] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#151A25] border-b border-[#2A3342]">
                <tr className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5">Administrator</th>
                  <th className="px-8 py-5">Action</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3342]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-[#9CA3AF]">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22C55E] flex items-center justify-center text-[10px] font-black text-white">
                          {log.adminName.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white">{log.adminName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                        log.isCritical 
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                        : "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="max-w-md text-xs font-medium leading-relaxed text-slate-400">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {log.status === "reviewed" ? (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex rounded-lg bg-[#22C55E]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#22C55E] border border-[#22C55E]/20">
                            Audited
                          </span>
                          <p className="text-[8px] text-slate-600 mt-1 uppercase font-bold">By {log.reviewedBy}</p>
                        </div>
                      ) : (
                        role === USER_ROLES.SUPER_ADMIN && (
                          <button
                            onClick={() => handleAcknowledge(log.id)}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] hover:text-[#22C55E] hover:border-[#22C55E]/30 transition-all"
                          >
                            Acknowledge
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-600">The chronicles are empty.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}