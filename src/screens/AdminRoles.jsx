﻿import { useMemo, useState } from "react";
import {
  ADMIN_PERMISSION_OPTIONS,
  DEFAULT_ADMIN_ROLES,
  DEMO_ACCOUNTS,
  getPermissionsForProfile,
  isAdminRole,
} from "../services/roles";

const ROLES_STORAGE_KEY = "invitegenie_admin_roles";
const ASSIGNMENTS_STORAGE_KEY = "invitegenie_admin_role_assignments";

function loadStoredRoles() {
  try {
    const stored = localStorage.getItem(ROLES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ADMIN_ROLES;
  } catch {
    return DEFAULT_ADMIN_ROLES;
  }
}

function loadAssignments() {
  try {
    const stored = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const blankForm = {
  name: "",
  description: "",
  permissions: [],
};

export default function AdminRoles() {
  const [roles, setRoles] = useState(loadStoredRoles);
  const [assignments, setAssignments] = useState(loadAssignments);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [assignment, setAssignment] = useState({
    email: "admin@invitegenie.cm",
    role: DEFAULT_ADMIN_ROLES[0].name,
  });

  const adminUsers = useMemo(
    () =>
      DEMO_ACCOUNTS.filter((account) => isAdminRole(account.role)).map((account) => ({
        id: account.id,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        permissions: getPermissionsForProfile(account),
      })),
    []
  );

  const persistRoles = (nextRoles) => {
    setRoles(nextRoles);
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(nextRoles));
  };

  const persistAssignments = (nextAssignments) => {
    setAssignments(nextAssignments);
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(nextAssignments));
  };

  const startEdit = (role) => {
    setEditingRole(role.name);
    setForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
    });
  };

  const handlePermissionToggle = (permission) => {
    setForm((current) => {
      const hasValue = current.permissions.includes(permission);
      return {
        ...current,
        permissions: hasValue
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const normalizedName = form.name.trim().toLowerCase().replace(/\s+/g, "_");
    if (!normalizedName) return;

    const nextRole = {
      id: normalizedName,
      name: normalizedName,
      label: normalizedName
        .split("_")
        .filter(Boolean)
        .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
        .join(" "),
      description: form.description.trim() || "Custom admin role.",
      permissions: form.permissions,
      created_at: new Date().toISOString(),
    };

    const nextRoles = editingRole
      ? roles.map((role) => (role.name === editingRole ? { ...role, ...nextRole } : role))
      : [nextRole, ...roles.filter((role) => role.name !== normalizedName)];

    persistRoles(nextRoles);
    setEditingRole(null);
    setForm(blankForm);
  };

  const deleteRole = (roleName) => {
    if (!confirm(`Delete admin role "${roleName}"?`)) return;
    persistRoles(roles.filter((role) => role.name !== roleName));
  };

  const assignRole = (event) => {
    event.preventDefault();
    const email = assignment.email.trim().toLowerCase();
    if (!email || !assignment.role) return;

    const nextAssignments = [
      { email, role: assignment.role, assigned_at: new Date().toISOString() },
      ...assignments.filter((item) => item.email !== email),
    ];
    persistAssignments(nextAssignments);
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#A78BFA]">God Mode Status</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Admin Roles
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Create, edit, delete, and assign admin roles to manage permissions across the beta platform.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-black text-white">{editingRole ? "Edit Role" : "Create Role"}</h2>
            {editingRole ? (
              <button
                type="button"
                onClick={() => {
                  setEditingRole(null);
                  setForm(blankForm);
                }}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Role Name
            </span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="regional_admin"
              className="w-full rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none focus:border-[#A78BFA]/60"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Description
            </span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              placeholder="What this role can safely manage."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none focus:border-[#A78BFA]/60"
            />
          </label>

          <div className="mt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Permissions
            </p>
            <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {ADMIN_PERMISSION_OPTIONS.map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 h-4 w-4 accent-[#8B5CF6]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-white">{permission.label}</span>
                    <span className="text-xs text-slate-500">{permission.group}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#070A12] transition hover:bg-slate-200"
          >
            Save Role
          </button>
        </form>

        <div className="space-y-4">
          {roles.map((role) => (
            <article key={role.name} className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">{role.label || role.name}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{role.description}</p>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {role.permissions?.length || 0} permissions
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(role)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/[0.05]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRole(role.name)}
                    className="rounded-xl border border-rose-500/30 px-4 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(role.permissions || []).slice(0, 12).map((permission) => (
                  <span key={permission} className="rounded-lg bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                    {permission}
                  </span>
                ))}
                {(role.permissions || []).length > 12 ? (
                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-xs text-slate-500">
                    +{role.permissions.length - 12} more
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0D1320] p-5">
        <h2 className="font-black text-white">Assign Role to Admin User</h2>
        <form onSubmit={assignRole} className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <select
            value={assignment.email}
            onChange={(event) => setAssignment((current) => ({ ...current, email: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none"
          >
            {adminUsers.map((user) => (
              <option key={user.email} value={user.email}>
                {user.full_name} - {user.email}
              </option>
            ))}
          </select>
          <select
            value={assignment.role}
            onChange={(event) => setAssignment((current) => ({ ...current, role: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-[#070A12] px-4 py-3 text-sm text-white outline-none"
          >
            {roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.label || role.name}
              </option>
            ))}
          </select>
          <button className="rounded-2xl bg-[#8B5CF6] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">
            Assign
          </button>
        </form>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {assignments.map((item) => (
            <div key={item.email} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-bold text-white">{item.email}</p>
              <p className="mt-1 text-xs text-slate-400">Assigned role: {item.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
