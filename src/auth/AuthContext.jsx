/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import supabase, { isSupabaseConfigured } from "../lib/supabaseClient";
import * as Engine from "./coreEngine";
import {
  ADMIN_ROLES,
  DEMO_ACCOUNTS,
  findDemoAccount,
  getPermissionsForProfile,
  isAdminRole,
  normalizeRole,
  USER_ROLES,
} from "../services/roles";

const AUTH_STORAGE_KEY = "invitegenie_auth";
const PROFILE_STORAGE_KEY = "invitegenie_profile";
const SUPER_ADMIN_2FA_KEY = "super_admin_2fa_verified";

export const AuthContext = createContext(null);

function readStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function roleToTier(role) {
  if (role === USER_ROLES.SUPER_ADMIN) return "GOD_MODE";
  if (ADMIN_ROLES.includes(role)) return "ADMIN";
  if ([USER_ROLES.PRO_USER, USER_ROLES.EVENT_PLANNER, USER_ROLES.ENTERPRISE_CLIENT].includes(role)) return "PRO";
  if ([USER_ROLES.VENDOR, USER_ROLES.TASKER].includes(role)) return "BUSINESS";
  if (role === USER_ROLES.CHECKIN_AGENT) return "STAFF";
  return "BASIC";
}

function normalizeProfile(authUser, profileData = {}) {
  const role = normalizeRole(
    profileData.role ||
      profileData.admin_role ||
      authUser?.user_metadata?.role ||
      (USER_ROLES?.BASIC_USER || "normal_user")
  );
  const fullName =
    profileData.full_name ||
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    profileData.email?.split("@")[0] ||
    authUser?.email?.split("@")[0] ||
    "InviteGenie User";

  const baseProfile = {
    id: profileData.id || authUser?.id,
    email: profileData.email || authUser?.email || "",
    full_name: fullName,
    phone: profileData.phone || authUser?.phone || "",
    role,
    admin_role: profileData.admin_role || (isAdminRole(role) ? role : null),
    permissions: profileData.permissions || [],
    accountType: profileData.accountType || profileData.account_type || profileData.plan || role,
    plan: profileData.plan || profileData.accountType || profileData.account_type || roleToTier(role),
    status: profileData.status || "active",
    tier: profileData.tier || roleToTier(role),
    avatar: profileData.avatar || fullName.slice(0, 2).toUpperCase(),
    city: profileData.city || "",
    country: profileData.country || "",
    createdAt: profileData.createdAt || profileData.created_at || new Date().toISOString(),
  };

  return {
    ...baseProfile,
    permissions: getPermissionsForProfile(baseProfile),
  };
}

function toCurrentUser(profile) {
  if (!profile) return null;
  return {
    ...profile,
    name: profile.full_name,
    plan: profile.plan || (profile.tier === "PRO" ? "Pro Account" : profile.tier === "ADMIN" ? "Admin Console" : profile.tier),
    accountType: profile.accountType || profile.role,
  };
}

function toDemoSession(account) {
  const publicAccount = { ...account };
  delete publicAccount.password;

  const profile = normalizeProfile(
    {
      id: publicAccount.id,
      email: publicAccount.email,
      phone: publicAccount.phone,
      user_metadata: {
        full_name: publicAccount.full_name,
        role: publicAccount.role,
      },
    },
    publicAccount
  );

  return {
    user: {
      id: profile.id,
      email: profile.email,
      phone: profile.phone,
      app_metadata: { provider: "demo" },
      user_metadata: { full_name: profile.full_name, role: profile.role },
    },
    profile,
  };
}

async function fetchSupabaseProfile(authUser) {
  if (!supabase || !authUser?.id) return normalizeProfile(authUser);

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,phone,role,admin_role,permissions,status")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) {
    console.warn("Unable to fetch profile from Supabase. Falling back to auth metadata.", error.message);
  }

  return normalizeProfile(authUser, data || {});
}

function shouldAllowDemoAuth() {
  // DEMO ONLY - replace with Supabase Auth before production.
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_AUTH === "true" || !isSupabaseConfigured();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextUser, nextProfile) => {
    const currentUser = toCurrentUser(nextProfile);
    setUser(nextUser);
    setProfile(nextProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));

    // DEMO ONLY: Set legacy key for compatibility with existing ProtectedRoute components
    if (isAdminRole(nextProfile.role)) {
      localStorage.setItem("ig_demo_admin_user", JSON.stringify(nextProfile));
    }

    Engine.setCurrentUser?.(currentUser);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem("ig_demo_admin_user");
    sessionStorage.removeItem(SUPER_ADMIN_2FA_KEY);
    Engine.logoutUser?.();
  }, []);

  const hydrateFromAuthUser = useCallback(
    async (authUser) => {
      if (!authUser) {
        clearSession();
        return null;
      }

      const nextProfile = await fetchSupabaseProfile(authUser);
      if (nextProfile.status && nextProfile.status !== "active") {
        await supabase?.auth.signOut();
        clearSession();
        throw new Error("This account is inactive. Contact InviteGenie support.");
      }

      persistSession(authUser, nextProfile);
      return { user: authUser, profile: nextProfile, role: nextProfile.role };
    },
    [clearSession, persistSession]
  );

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      setLoading(true);
      try {
        const storedUser = readStoredJson(AUTH_STORAGE_KEY);
        const storedProfile = readStoredJson(PROFILE_STORAGE_KEY);

        // Prioritize real Supabase session over demo localStorage
        if (supabase && isSupabaseConfigured()) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            await hydrateFromAuthUser(data.session.user);
            return;
          }
        }

        if (storedUser && storedProfile) {
          setUser({
            id: storedProfile.id,
            email: storedProfile.email,
            phone: storedProfile.phone,
            app_metadata: { provider: "demo" },
            user_metadata: { full_name: storedProfile.full_name, role: storedProfile.role },
          });
          setProfile(normalizeProfile(storedUser, storedProfile));
          // Ensure the core engine is aware of the hydrated user
          Engine.setCurrentUser?.(storedUser);
        } else {
          clearSession();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSession();

    const { data: listener } =
      supabase?.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          clearSession();
          return;
        }
        if (session?.user && event !== "TOKEN_REFRESHED") {
          try {
            await hydrateFromAuthUser(session.user);
          } catch (error) {
            console.warn(error.message);
          }
        }
      }) || {};

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, [clearSession, hydrateFromAuthUser]);

  const signIn = useCallback(
    async (email, password, options = {}) => {
      const portal = options?.portal || "any";
      // TEMPORARY: Professional Demo Account Logic
      let demoAccount = null;
      if (shouldAllowDemoAuth()) {
        demoAccount = findDemoAccount(email, password);
      }

      if (demoAccount) {
        if (portal === "user" && isAdminRole(demoAccount.role)) {
          throw new Error("Admin accounts must use the admin console.");
        }

        if (portal === "admin" && !isAdminRole(demoAccount.role)) {
          throw new Error("This account is not authorized for admin access.");
        }

        const demoSession = toDemoSession(demoAccount);

        // For Super Admin, we don't clear the 2FA key here yet,
        // the AdminProtectedRoute will check for the verified flag in sessionStorage
        if (demoAccount.role !== USER_ROLES.SUPER_ADMIN) {
           sessionStorage.setItem(SUPER_ADMIN_2FA_KEY, "true");
        } else {
           sessionStorage.removeItem(SUPER_ADMIN_2FA_KEY);
        }

        persistSession(demoSession.user, demoSession.profile);
        return { ...demoSession, role: demoSession.profile.role, isDemo: true };
      }

      if (!supabase) {
        throw new Error("Invalid demo credentials. Supabase Auth is not configured yet.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      sessionStorage.removeItem(SUPER_ADMIN_2FA_KEY);
      const result = await hydrateFromAuthUser(data.user);
      if (portal === "user" && isAdminRole(result.role)) {
        clearSession();
        throw new Error("Admin accounts must use the admin console.");
      }
      if (portal === "admin" && !isAdminRole(result.role)) {
        clearSession();
        throw new Error("This account is not authorized for admin access.");
      }
      return result;
    },
    [clearSession, hydrateFromAuthUser, persistSession]
  );

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    clearSession();
  }, [clearSession]);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;

    const nextProfile =
      user.app_metadata?.provider === "demo" ? normalizeProfile(user, profile) : await fetchSupabaseProfile(user);

    persistSession(user, nextProfile);
    return nextProfile;
  }, [persistSession, profile, user]);

  const signup = useCallback(
    async (email, password, fullName) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: USER_ROLES.BASIC_USER,
            },
          },
        });
        if (error) throw error;
        return data;
      }

      const demoSession = toDemoSession({
        ...DEMO_ACCOUNTS.find((account) => account.role === USER_ROLES.BASIC_USER),
        id: `demo-${Date.now()}`,
        email,
        full_name: fullName || email,
      });
      persistSession(demoSession.user, demoSession.profile);
      return demoSession.user;
    },
    [persistSession]
  );

  const updateCurrentUser = useCallback(
    (nextUser) => {
      const nextProfile = normalizeProfile(user, {
        ...profile,
        ...nextUser,
        full_name: nextUser.full_name || nextUser.name || profile?.full_name,
      });
      persistSession(user || { id: nextProfile.id, email: nextProfile.email }, nextProfile);
      return toCurrentUser(nextProfile);
    },
    [persistSession, profile, user]
  );

  const role = profile?.role || null;
  const permissions = useMemo(() => getPermissionsForProfile(profile), [profile]);
  const isAdmin = Boolean(role && isAdminRole(role));
  const isSuperAdmin = role === USER_ROLES.SUPER_ADMIN;

  const value = useMemo(
    () => ({
      user,
      profile,
      currentUser: toCurrentUser(profile),
      role,
      permissions,
      loading,
      isAuthenticated: Boolean(user && profile),
      isAdmin,
      isSuperAdmin,
      signIn,
      signOut,
      refreshProfile,
      login: signIn,
      logout: signOut,
      signup,
      setUser: updateCurrentUser,
    }),
    [
      user,
      profile,
      role,
      permissions,
      loading,
      isAdmin,
      isSuperAdmin,
      signIn,
      signOut,
      refreshProfile,
      signup,
      updateCurrentUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
