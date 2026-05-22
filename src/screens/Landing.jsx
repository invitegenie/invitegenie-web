import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2560", // Dynamic
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=2560", // Elegant Gala
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2560", // Decor
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2560"  // Grand Venue
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-[#030509] text-slate-200 font-sans selection:bg-violet-500/30 selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION - Kept structure, upgraded visuals */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-[#030509]/90 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-6'} px-6 sm:px-10 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
             <Icon name="auto_awesome" className="text-white text-lg animate-pulse-slow" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white hidden sm:block">InviteGenie</span>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-300 border border-violet-500/20">Beta</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/marketplace")} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors hidden md:block">
            Marketplace
          </button>
          <button onClick={() => navigate("/login")} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors hidden md:block">
            Sign In
          </button>
          <button onClick={() => navigate("/summon-genie")} className="relative group rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 overflow-hidden transition-all hover:border-violet-500/50 hover:bg-violet-500/10 active:scale-95">
            <span className="relative z-10 text-[11px] font-black uppercase tracking-widest text-white group-hover:text-violet-200 transition-colors">Start Planning</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </nav>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-32">
        {/* Background Image Slider Concept */}
        <div className="absolute inset-0 z-0 bg-[#030509]">
          {heroImages.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`Cinematic Event ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-30" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030509]/40 via-[#030509]/80 to-[#030509]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-64 h-32 glass-panel rounded-2xl p-4 hidden lg:flex flex-col gap-3 animate-float opacity-70 border border-white/10">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center"><Icon name="smart_toy" className="text-violet-400 text-sm" /></div><div className="h-2 w-24 bg-white/10 rounded-full" /></div>
           <div className="h-2 w-full bg-white/5 rounded-full" />
           <div className="h-2 w-3/4 bg-white/5 rounded-full" />
        </div>
        <div className="absolute bottom-1/4 right-10 w-72 glass-panel rounded-2xl p-4 hidden lg:flex flex-col gap-3 animate-float opacity-70 border border-white/10" style={{ animationDelay: "2s" }}>
           <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-emerald-400">VENUE RENDER GENERATED</span><Icon name="check_circle" className="text-emerald-400 text-sm" /></div>
           <div className="h-24 w-full bg-black/40 rounded-xl overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-emerald-500/20" />
           </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 shadow-[0_0_30px_rgba(139,92,246,0.15)] border border-violet-500/30">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">The AI-Powered Event Operating System</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] text-white drop-shadow-2xl mb-8">
            Plan <span className="text-gradient-gold relative">Extraordinary
              <div className="absolute -inset-2 bg-yellow-500/20 blur-2xl -z-10 rounded-full" />
            </span> Events With AI.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl font-medium leading-relaxed drop-shadow-lg mb-12 opacity-90">
            InviteGenie combines AI planning, immersive venue visualization, vendor booking, tasker staffing, and intelligent event execution into one cinematic platform.
          </p>

          <div className="mb-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 text-sm font-black uppercase tracking-widest text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
            Use 000000 for verification.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <button onClick={() => navigate('/summon-genie')} className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(139,92,246,0.4)] relative overflow-hidden group">
              <span className="relative z-10">Start Planning With AI</span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
            <button onClick={() => navigate('/marketplace')} className="w-full sm:w-auto px-10 py-5 glass-card text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all">
              Explore Marketplace
            </button>
            <button onClick={() => navigate('/venue-builder')} className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/5 hover:scale-105 active:scale-95 transition-all">
              Try Venue Builder
            </button>
          </div>
        </div>
        
        {/* Soft bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030509] to-transparent z-10" />
      </section>

      {/* 2. TRUST / SOCIAL PROOF SECTION */}
      <section className="relative py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 border-r border-white/10 pr-8 hidden lg:flex">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted By</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Icon name="celebration" className="text-violet-500" /> Event Planners</div>
             <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Icon name="storefront" className="text-fuchsia-500" /> Premium Vendors</div>
             <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Icon name="theater_comedy" className="text-yellow-500" /> Creators</div>
             <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Icon name="business" className="text-blue-500" /> Corporate Teams</div>
             <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"><Icon name="location_city" className="text-emerald-500" /> Venues</div>
          </div>
        </div>
      </section>

      {/* 3. AI EVENT GENIE SECTION */}
      <section className="relative py-32 px-6 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-900/20 rounded-full blur-[120px] -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader badge="Artificial Intelligence" title="The AI Co-Planner For Every Event." />
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Describe your vision in plain English. The Genie instantly generates event concepts, builds budget suggestions, recommends top-tier local vendors, and drafts your entire timeline.
            </p>
            <ul className="space-y-4 mb-10">
              <FeatureTick text="Automated seating plan suggestions" />
              <FeatureTick text="Smart budget allocation & tracking" />
              <FeatureTick text="Intelligent vendor matching based on style" />
              <FeatureTick text="Instant moodboard & styling concepts" />
            </ul>
            <button onClick={() => navigate('/summon-genie')} className="px-8 py-4 bg-violet-600/20 border border-violet-500/50 text-violet-300 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-violet-600/40 transition-colors flex items-center gap-2">
              <Icon name="auto_awesome" className="text-sm" /> Summon The Genie
            </button>
          </div>
          
          <div className="relative">
            <div className="glass-card rounded-[2rem] p-6 shadow-2xl border border-white/10 relative z-10 animate-float">
              {/* Mock AI UI */}
              <div className="flex flex-col gap-6">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex gap-4 self-end max-w-[80%]">
                  <p className="text-sm text-slate-300">"Plan a 300-guest luxury gala in Douala with a cinematic lighting theme. Budget is 15M FCFA."</p>
                </div>
                <div className="bg-violet-900/20 rounded-xl p-5 border border-violet-500/20 flex gap-4 self-start max-w-[90%] shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex shrink-0 items-center justify-center mt-1"><Icon name="auto_awesome" className="text-white text-xs" /></div>
                  <div>
                    <p className="text-sm text-white font-medium mb-3">I've generated a concept for your Cinematic Luxury Gala. Here is the breakdown:</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-black/50 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase text-slate-500 mb-1">Theme</span><span className="text-xs text-white font-bold">Midnight Cinematic Glow</span></div>
                      <div className="bg-black/50 p-3 rounded-lg border border-white/5"><span className="block text-[10px] uppercase text-slate-500 mb-1">Budget</span><span className="text-xs text-emerald-400 font-bold">On Track (15M FCFA)</span></div>
                    </div>
                    <div className="h-10 bg-black/50 rounded-lg border border-white/5 flex items-center px-4 justify-between">
                       <span className="text-xs text-slate-400">4 Recommended Vendors Found</span>
                       <Icon name="chevron_right" className="text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 blur-2xl -z-10 rounded-[3rem]" />
          </div>
        </div>
      </section>

      {/* 4. VENUE BUILDER EXPERIENCE SECTION */}
      <section className="relative py-32 px-6 max-w-[90rem] mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <SectionHeader badge="Venue Studio" title="Design The Perfect Layout." centered />
          <p className="text-lg text-slate-400">Drag-and-drop seating, stages, and luxury décor in our 2D planning workspace. Seamlessly assign seats and visualize guest flow before the first chair is placed.</p>
        </div>

        <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 glass-panel aspect-[16/9] shadow-2xl">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2560" alt="Venue Planning" className="w-full h-full object-cover opacity-50 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030509] via-transparent to-[#030509]/50" />
          
          {/* Overlay UI elements mocking the editor */}
          <div className="absolute top-6 left-6 flex gap-3">
             <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-2"><Icon name="chair" className="text-violet-400 text-sm" /><span className="text-xs font-bold">Add Table</span></div>
             <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-2"><Icon name="celebration" className="text-fuchsia-400 text-sm" /><span className="text-xs font-bold">Add Stage</span></div>
          </div>
          
          <div className="absolute bottom-6 right-6">
             <button onClick={() => navigate('/venue-builder')} className="px-8 py-4 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-xl">
               Open Venue Builder
             </button>
          </div>

          {/* Floating Labels */}
          <FloatingLabel top="30%" left="20%" text="AI Generated Layout" color="emerald" delay="0s" />
          <FloatingLabel top="50%" left="60%" text="300 Guest Capacity" color="violet" delay="1s" />
          <FloatingLabel top="70%" left="40%" text="Safe Flow Path" color="blue" delay="2s" />
        </div>
      </section>

      {/* 5. IMMERSIVE RENDER PREVIEW SECTION */}
      <section className="relative py-32 px-6 max-w-7xl mx-auto border-t border-white/5 bg-gradient-to-b from-transparent to-black/50">
        <div className="absolute left-0 top-1/2 w-96 h-96 bg-fuchsia-900/10 rounded-full blur-[120px] -z-10" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative group">
             <div className="rounded-[2rem] overflow-hidden border border-white/10 relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                <img src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1200" alt="Cinematic Render" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Beta Render Engine</span>
                </div>
             </div>
             <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-600/20 to-yellow-600/20 blur-2xl -z-10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader badge="Vision Engine" title="Visualize The Event Before It Happens." />
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Step into the future. InviteGenie's upcoming rendering capabilities will allow you to see your layout wrapped in cinematic lighting, textures, and atmosphere before making a single deposit.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-4 rounded-xl text-center"><Icon name="lightbulb" className="text-yellow-400 text-2xl mb-2" /><p className="text-xs font-bold">Luxury Lighting</p></div>
              <div className="glass-card p-4 rounded-xl text-center"><Icon name="360" className="text-blue-400 text-2xl mb-2" /><p className="text-xs font-bold">Spatial Depth</p></div>
              <div className="glass-card p-4 rounded-xl text-center"><Icon name="auto_fix_high" className="text-fuchsia-400 text-2xl mb-2" /><p className="text-xs font-bold">Material Previews</p></div>
              <div className="glass-card p-4 rounded-xl text-center"><Icon name="photo_camera" className="text-emerald-400 text-2xl mb-2" /><p className="text-xs font-bold">Virtual Walkthroughs</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MARKETPLACE SECTION */}
      <section className="relative py-32 px-6 border-t border-white/5 bg-[#05070e]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeader badge="Marketplace" title="Discover Trusted Event Vendors." centered />
          <p className="text-lg text-slate-400 mb-8">Browse premium decorators, top-tier DJs, secure venues, and gourmet caterers. All verified, all professional.</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Decorators', 'DJs', 'Caterers', 'Venues', 'Photographers', 'Furniture'].map(cat => (
              <span key={cat} className="px-4 py-1.5 rounded-full glass-panel text-xs font-bold text-slate-300 hover:text-white hover:border-white/30 cursor-pointer transition-colors">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[90rem] mx-auto">
          <VendorCard name="Lumière Decor" cat="Decorator" rating="4.9" price="250,000" img="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800" />
          <VendorCard name="Bassline Events" cat="DJ & Sound" rating="4.8" price="100,000" img="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800" />
          <VendorCard name="The Grand Orchid" cat="Venue" rating="5.0" price="1,500,000" img="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" />
          <VendorCard name="Epicurean Bites" cat="Catering" rating="4.7" price="15,000/head" img="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800" />
        </div>
        
        <div className="mt-16 text-center">
          <button onClick={() => navigate('/marketplace')} className="px-10 py-4 glass-card border border-white/20 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
            View All Categories
          </button>
        </div>
      </section>

      {/* 7. TASKER / STAFFING SECTION */}
      <section className="relative py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader badge="On-Demand Staffing" title="Turn Event Work Into Opportunity." />
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Need reliable ushers, quick setup crews, or professional security? Hire pre-vetted taskers directly through the platform. Or become a tasker and get paid for your hustle.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/tasks')} className="px-8 py-4 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600/40 transition-colors">
                Find Staff
              </button>
              <button onClick={() => navigate('/tasks')} className="px-8 py-4 glass-panel border border-white/10 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                Become a Tasker
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] -z-10" />
             <TaskerCard role="VIP Usher" rate="15k/shift" time="18:00 - 02:00" />
             <TaskerCard role="Setup Crew" rate="10k/shift" time="08:00 - 14:00" delay="0.2s" />
             <TaskerCard role="Security" rate="20k/shift" time="20:00 - 06:00" delay="0.4s" />
             <TaskerCard role="Server" rate="12k/shift" time="16:00 - 23:00" delay="0.6s" />
          </div>
        </div>
      </section>

      {/* 8. PAYMENTS / WALLET / ESCROW SECTION */}
      <section className="relative py-32 px-6 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeader badge="Financial Infrastructure" title="Built For Real Event Commerce." centered />
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            Manage massive budgets with confidence. Our milestone-based escrow workflow and manual verification systems ensure vendors are paid securely and hosts are protected.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-2xl border-t-4 border-t-emerald-500">
              <Icon name="verified_user" className="text-emerald-400 text-4xl mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Escrow Workflow</h3>
              <p className="text-sm text-slate-400">Funds are held securely until delivery milestones are met and approved.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl border-t-4 border-t-yellow-500">
              <Icon name="account_balance_wallet" className="text-yellow-400 text-4xl mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Vendor Wallets</h3>
              <p className="text-sm text-slate-400">Track earnings, request payouts, and manage business financials in one place.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl border-t-4 border-t-blue-500 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase rounded">Beta</div>
              <Icon name="payments" className="text-blue-400 text-4xl mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Mobile Money</h3>
              <p className="text-sm text-slate-400">Manual verification system supporting MTN Mobile Money and Orange Money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. EVENT EXECUTION & 10. ADMIN LAYER */}
      <section className="relative py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="glass-card p-10 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
            <Icon name="account_tree" className="text-violet-400 text-3xl mb-6" />
            <h3 className="text-2xl font-black text-white mb-4">Manage Everything In One Workspace</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">Coordinate vendors, track checklists, manage team communication, and monitor setup timelines from a centralized command center.</p>
            <img src="https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800" alt="Workspace" className="w-full h-48 object-cover rounded-xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          
          <div className="glass-card p-10 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <Icon name="admin_panel_settings" className="text-emerald-400 text-3xl mb-6" />
            <h3 className="text-2xl font-black text-white mb-4">Trust & Moderation From Day One</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">Built-in fraud monitoring, vendor approval workflows, and deep audit visibility ensuring a safe ecosystem for high-value transactions.</p>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Vendor Verification</span><span className="text-xs text-emerald-400">Passed</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Payment Audit</span><span className="text-xs text-emerald-400">Secure</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Content Moderation</span><span className="text-xs text-emerald-400">Active</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FEATURE GRID SECTION */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="Ecosystem Features" title="Everything You Need." centered />
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['AI Planning', 'Venue Builder', 'Marketplace', 'Messaging', 'Wallets', 'Escrow', 'Taskers', 'Analytics', 'Draft Saving', 'Templates', 'Timelines', 'Notifications'].map((feat, i) => (
              <div key={i} className="p-4 glass-card rounded-xl text-center border border-white/5 hover:border-violet-500/30 transition-colors group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white group-hover:text-gradient-primary transition-all">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. ROADMAP SECTION */}
      <section className="relative py-24 px-6 border-t border-white/5 bg-[#030509]">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader badge="Future Vision" title="The Future Of Event Intelligence." centered />
          <div className="mt-12 flex flex-col gap-4 text-left">
             <RoadmapItem title="Real-Time 3D Rendering Engine" status="In Development" />
             <RoadmapItem title="AI Automated Venue Generation" status="Planned" />
             <RoadmapItem title="Live Bank/Payment Gateway Integrations" status="Planned" />
             <RoadmapItem title="Enterprise Hotel & Conference Sync" status="Vision" />
          </div>
        </div>
      </section>

      {/* 14. FINAL CTA SECTION */}
      <section className="relative py-32 px-6 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/40 via-[#030509] to-[#030509] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Create Events People Will <span className="text-gradient-primary">Never Forget.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
            Plan smarter, visualize better, and execute extraordinary experiences with InviteGenie.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/summon-genie')} className="px-10 py-5 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Planning
            </button>
            <button onClick={() => navigate('/marketplace/new')} className="px-10 py-5 glass-card text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/20">
              Become a Vendor
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 px-6 bg-[#020306]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon name="auto_awesome" className="text-violet-400 text-xl" />
              <span className="text-lg font-black text-white">InviteGenie</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">The AI-powered event operating system. Plan, visualize, and execute seamlessly.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Platform</h4>
            <ul className="space-y-4 text-xs text-slate-500 font-medium">
              <li><Link to="/summon-genie" className="hover:text-white transition-colors">AI Planner</Link></li>
              <li><Link to="/venue-builder" className="hover:text-white transition-colors">Venue Studio</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/tasks" className="hover:text-white transition-colors">Taskers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Company</h4>
            <ul className="space-y-4 text-xs text-slate-500 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Legal</h4>
            <ul className="space-y-4 text-xs text-slate-500 font-medium">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">© {new Date().getFullYear()} InviteGenie. All rights reserved.</p>
          <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded text-slate-400">Currently in Beta</span>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents for cleanliness

function SectionHeader({ badge, title, centered }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
      <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 mb-4">
        {badge}
      </div>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">{title}</h2>
    </div>
  );
}

function FeatureTick({ text }) {
  return (
    <li className="flex items-start gap-3">
      <Icon name="check_circle" className="text-violet-500 text-xl shrink-0 mt-0.5" />
      <span className="text-sm font-medium text-slate-300">{text}</span>
    </li>
  );
}

function FloatingLabel({ top, left, text, color, delay }) {
  const colorMap = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };
  return (
    <div 
      className={`absolute px-3 py-1.5 rounded-lg border backdrop-blur-md text-[10px] font-bold uppercase tracking-wider animate-float ${colorMap[color]} shadow-lg`}
      style={{ top, left, animationDelay: delay }}
    >
      {text}
    </div>
  );
}

function VendorCard({ name, cat, rating, price, img }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)] border-white/10 hover:border-violet-500/30">
      <div className="h-48 overflow-hidden relative">
        <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur rounded px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">{cat}</div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-white text-lg">{name}</h3>
          <span className="flex items-center gap-1 text-xs font-bold text-yellow-400"><Icon name="star" className="text-[12px]" />{rating}</span>
        </div>
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1"><Icon name="location_on" className="text-[12px]" /> Douala, CM</p>
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div><p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Starting at</p><p className="text-sm font-black text-emerald-400">FCFA {price}</p></div>
          <button className="px-4 py-2 rounded-lg bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-colors border border-white/10">View</button>
        </div>
      </div>
    </div>
  );
}

function TaskerCard({ role, rate, time, delay = "0s" }) {
  return (
    <div className="glass-panel p-4 rounded-xl border border-white/5 animate-float" style={{ animationDelay: delay }}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-bold text-white">{role}</h4>
        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{rate}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon name="schedule" className="text-[14px]" /> {time}
      </div>
    </div>
  );
}

function RoadmapItem({ title, status }) {
  const isDev = status === "In Development";
  return (
    <div className="glass-card p-6 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-colors">
      <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{title}</h4>
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isDev ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' : 'bg-white/5 text-slate-500 border-white/10'}`}>
        {status}
      </span>
    </div>
  );
}
