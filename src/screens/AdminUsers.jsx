import { useMemo, useState } from "react";
import {
  DEFAULT_ADMIN_ROLES,
  DEMO_ACCOUNTS,
  getPermissionsForProfile,
  hasPermission,
  isAdminRole,
  USER_ROLES,
} from "../services/roles";
import { useAuth } from "../auth/AuthContext";

const ADMIN_USERS_STORAGE_KEY = "invitegenie_admin_users";
const ROLES_STORAGE_KEY = "invitegenie_admin_roles";

function loadRoles() {
  try {
    const stored = localStorage.getItem(ROLES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMIN_ROLES;
  } catch {
    return DEFAULT_ADMIN_ROLES;
  }
}

function initialAdminUsers() {
  const demoAdmins = DEMO_ACCOUNTS.filter((account) => isAdminRole(account.role)).map((account) => ({
    id: account.id,
    email: account.email,
    full_name: account.full_name,
    phone: account.phone,
    role: account.role,
    admin_role: account.admin_role || account.role,
    status: account.status || "active",
    created_at: new Date().toISOString(),
  }));

  return [
    ...demoAdmins,
    {
      id: "demo-support-admin",
      email: "support@invitegenie.cm",
      full_name: "InviteGenie Support Admin",
      phone: "+237000000005",
      role: USER_ROLES.SUPPORT_ADMIN,
      admin_role: USER_ROLES.SUPPORT_ADMIN,
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-marketplace-admin",
      email: "marketplace@invitegenie.cm",
      full_name: "InviteGenie Marketplace Admin",
      phone: "+237000000006",
      role: USER_ROLES.MARKETPLACE_ADMIN,
      admin_role: USER_ROLES.MARKETPLACE_ADMIN,
      status: "inactive",
      created_at: new Date().toISOString(),
    },
  ];
}

function loadUsers() {
  try {
    const stored = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialAdminUsers();
  } catch {
    return initialAdminUsers();
  }
}

export default function AdminUsers() {
  const { profile } = useAuth();
  const [roles] = useState(loadRoles);
  const [users, setUsers] = useState(loadUsers);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    full_name: "",
    email: "",
    admin_role: USER_ROLES.ADMIN,
  });

  const roleMap = useMemo(() => new Map(roles.map((role) => [role.name, role])), [roles]);
  const canAssignAdminRole = hasPermission(profile, "assign_admin_role");
  const canManageAdminStatus = hasPermission(profile, "manage_all_users");

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const inviteAdmin = (event) => {
    event.preventDefault();
    if (!inviteForm.email || !inviteForm.full_name) return;

    const role = inviteForm.admin_role;
    const newUser = {
      id: `admin-${Date.now()}`,
      email: inviteForm.email.trim().toLowerCase(),
      full_name: inviteForm.full_name.trim(),
      phone: "",
      role,
      admin_role: role,
      status: "invited",
      created_at: new Date().toISOString(),
    };

    persistUsers([newUser, ...users]);
    setInviteForm({ full_name: "", email: "", admin_role: USER_ROLES.ADMIN });
  };

  const updateUser = (userId, patch) => {
    persistUsers(users.map((user) => (user.id === userId ? { ...user, ...patch } : user)));
  };

  const resetRole = (userId) => {
    updateUser(userId, { role: USER_ROLES.ADMIN, admin_role: USER_ROLES.ADMIN });
  };

  const getUserPermissions = (user) => {
    const customRole = roleMap.get(user.admin_role || user.role);
    if (customRole) return customRole.permissions || [];
    return getPermissionsForProfile(user);
  };

  const isSuperAdmin = profile?.role === USER_ROLES.SUPER_ADMIN;
  
  const visibleUsers = useMemo(() => {
    if (isSuperAdmin) return users;
    return users.filter(u => u.role !== USER_ROLES.SUPER_ADMIN && u.role !== USER_ROLES.APP_ADMIN);
  }, [users, isSuperAdmin]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#A78BFA]">{isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Admin Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          View admin users, assign roles, activate or deactivate accounts, and inspect effective permissions.
          This is local mock state ready to connect to Supabase.
        </p>
      </header>

      {canAssignAdminRole ? (
        <section className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
          <h2 className="font-black text-white">Invite or Create Admin User</h2>
          <form onSubmit={inviteAdmin} className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              value={inviteForm.full_name}
              onChange={(event) => setInviteForm((current) => ({ ...current, full_name: event.target.value }))}
              placeholder="Full name"
              className="rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none focus:border-[#A78BFA]/60"
            />
            <input
              type="email"
              value={inviteForm.email}
              onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="admin@example.com"
              className="rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none focus:border-[#A78BFA]/60"
            />
            <select
              value={inviteForm.admin_role}
              onChange={(event) => setInviteForm((current) => ({ ...current, admin_role: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none"
            >
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.label || role.name}
                </option>
              ))}
            </select>
            <button className="rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#070A12]">
              Invite
            </button>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1320]">
        <div className="border-b border-white/10 p-5">
          <h2 className="font-black text-white">Admin Accounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-[#070A12] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Permissions</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleUsers.map((user) => {
                const permissions = getUserPermissions(user);
                const isExpanded = expandedUserId === user.id;

                return (
                  <tr key={user.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{user.full_name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.admin_role || user.role}
                        onChange={(event) =>
                          updateUser(user.id, { role: event.target.value, admin_role: event.target.value })
                        }
                        disabled={!canAssignAdminRole}
                        className="w-full rounded-xl border border-white/10 bg-[#070A12] px-3 py-2 text-xs text-white outline-none"
                      >
                        {roles.map((role) => (
                          <option key={role.name} value={role.name}>
                            {role.label || role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${
                          user.status === "active"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : user.status === "invited"
                              ? "bg-amber-400/10 text-amber-200"
                              : "bg-rose-400/10 text-rose-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                        className="text-xs font-bold text-[#A78BFA] hover:text-white"
                      >
                        {isExpanded ? "Hide permissions" : `View ${permissions.length} permissions`}
                      </button>
                      {isExpanded ? (
                        <div className="mt-3 flex max-w-xl flex-wrap gap-2">
                          {permissions.map((permission) => (
                            <span
                              key={permission}
                              className="rounded-lg bg-white/[0.04] px-2 py-1 text-xs text-slate-300"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateUser(user.id, {
                              status: user.status === "active" ? "inactive" : "active",
                            })
                          }
                          disabled={!canManageAdminStatus}
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/[0.05]"
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetRole(user.id)}
                          disabled={!canAssignAdminRole}
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/[0.05]"
                        >
                          Reset Role
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
