import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import Layout from "../components/Layout";
import FeatureBadge from "../components/FeatureBadge";
import { useAuth } from "../auth/AuthContext";
import { getDemoUsers } from "../services/demoUsers";
import {
  getAccountType,
  getEffectiveCapabilities,
  getTaskerProfiles,
  saveTaskerProfile,
  updateUserCapabilities,
} from "../services/accountCapabilities";
import * as Engine from "../auth/coreEngine";
import { KEYS } from "../auth/coreEngine";

const STAFFING_SKILLS = [
  "event staff",
  "usher",
  "waiter",
  "decorator assistant",
  "security",
  "photographer assistant",
  "check-in staff",
  "logistics helper",
];

export default function Tasks() {
  const navigate = useNavigate();
  const { currentUser, setUser } = useAuth();
  const [profiles, setProfiles] = useState(() => getTaskerProfiles());
  const capabilities = getEffectiveCapabilities(currentUser || {});
  const accountType = getAccountType(currentUser || {});

  const taskers = useMemo(() => {
    const users = getDemoUsers();
    return profiles
      .filter((profile) => profile.active)
      .map((profile) => ({
        ...profile,
        user: users.find((user) => String(user.id) === String(profile.userId)),
      }));
  }, [profiles]);

  const activateTasker = () => {
    if (!currentUser) return alert("Please log in to activate Tasker mode.");

    const nextCapabilities = updateUserCapabilities(currentUser, { taskerMode: true });
    const nextUser = setUser({ ...currentUser, capabilities: nextCapabilities });
    const profile = saveTaskerProfile({
      userId: currentUser.id,
      active: true,
      skills: ["event staff", "usher", "check-in staff"],
      availability: "Weekends and evenings",
      rating: 0,
      completedJobs: 0,
      verificationStatus: accountType === "FREE" ? "basic" : "verified",
      preferredLocations: [currentUser.city || "Douala"].filter(Boolean),
    });
    
    const existingVendors = Engine.getCollection(KEYS.VENDORS) || [];
    const isAlreadyVendor = existingVendors.find(v => String(v.ownerId) === String(currentUser.id) && v.category === "Tasker");
    
    if (!isAlreadyVendor) {
      const newTaskerVendor = {
        id: `tasker-${currentUser.id}`,
        ownerId: currentUser.id,
        name: currentUser.full_name || currentUser.name || "Event Staff",
        businessName: currentUser.full_name || currentUser.name || "Event Staff",
        title: "Professional Event Staff",
        category: "Tasker",
        type: "task",
        location: currentUser.city || "Cameroon",
        price: 15000,
        startingPrice: 15000,
        description: `Available for: event staff, usher, check-in staff. Flexible hours.`,
        image: currentUser.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
        rating: "5.0",
        reviews: 1,
        completedJobs: 1,
        packages: [{ name: "Standard Shift", description: "Standard staffing coverage for an event shift.", price: 15000 }],
        reviewsList: [
          { userName: "Event Host", rating: 5, comment: "Punctual, professional, and very helpful.", date: new Date().toISOString().split("T")[0] }
        ],
        pro: false
      };
      Engine.save(KEYS.VENDORS, [newTaskerVendor, ...existingVendors]);
    }

    setProfiles((prev) => [profile, ...prev.filter((item) => String(item.userId) !== String(profile.userId))]);
    return nextUser;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 pb-28">
        <header className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Staffing Marketplace</p>
              <h1 className="mt-2 text-3xl font-black text-white">Tasker Availability</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Activate tasker mode to become visible for event staffing roles like usher, waiter, security,
                check-in staff, assistant photographer, or logistics helper.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FeatureBadge label={accountType} tone="amber" />
              <FeatureBadge label={capabilities.hasPriorityVisibility ? "Priority visibility" : "Basic visibility"} active={capabilities.hasPriorityVisibility} />
              <FeatureBadge label={capabilities.hasVerifiedBadge ? "Verified" : "Basic badge"} active={capabilities.hasVerifiedBadge} tone="emerald" />
            </div>
          </div>
        </header>

        {!capabilities.canBeTasker ? (
          <section className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.07] p-6">
            <h2 className="text-xl font-black text-white">Become available for staffing jobs</h2>
            <p className="mt-2 text-sm leading-6 text-amber-50/75">
              Free accounts can activate basic tasker visibility. Pro and above unlock priority placement,
              verification badges, analytics, and booking requests.
            </p>
            <button onClick={activateTasker} className="mt-5 rounded-2xl bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-950">
              Activate Tasker Mode
            </button>
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAFFING_SKILLS.map((skill) => (
            <div key={skill} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <Icon name="badge" className="text-amber-300" />
              <p className="mt-3 text-sm font-black capitalize text-white">{skill}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Available Taskers</h2>
              <p className="mt-1 text-sm text-slate-500">Demo staffing profiles stored in localStorage.</p>
            </div>
            <button onClick={() => navigate("/settings")} className="rounded-2xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/5">
              Manage Modes
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {taskers.length ? taskers.map((tasker) => (
              <article key={tasker.userId} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-emerald-400 text-lg font-black text-white">
                    {(tasker.user?.full_name || "IG").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-white">{tasker.user?.full_name || "InviteGenie Tasker"}</h3>
                    <p className="text-xs text-slate-500">{tasker.preferredLocations?.join(", ") || "Cameroon"}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(tasker.skills || []).map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-xs text-slate-300">
                  <span>{tasker.availability}</span>
                  <span className="font-black text-amber-200">{tasker.verificationStatus}</span>
                </div>
              </article>
            )) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm text-slate-400">
                No active tasker profiles yet. Activate tasker mode to seed your staffing profile.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
