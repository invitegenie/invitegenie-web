import { useNavigate } from "react-router-dom";
import { ImageCard } from "../components/RichCards";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0a0f] text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6 backdrop-blur-md">
        <span className="bg-gradient-to-r from-purple-400 to-emerald-300 bg-clip-text text-2xl font-bold font-heading text-transparent">
          InviteGenie
        </span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button onClick={() => navigate("/login")} className="rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-950 transition hover:bg-purple-400 hover:text-white">
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="mb-6 text-6xl font-semibold font-heading leading-tight tracking-tight sm:text-8xl">
            Conjure <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Magical</span> Events
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
            The all-in-one AI platform to design breathtaking invitations, manage guests effortlessly, and track event check-ins with style.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/login")} className="rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 px-8 py-4 text-lg font-medium transition hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              Get Started for Free
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium backdrop-blur-xl transition hover:bg-white/10">
              View Templates
            </button>
          </div>
        </div>
      </header>

      {/* Showcase Grid */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-16 flex items-end justify-between">
          <h2 className="text-4xl font-semibold font-heading">Built for Every Moment</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ImageCard 
            title="Elegant Weddings" 
            subtitle="Manage RSVPs for your big day." 
            image="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
            badge="Popular"
          />
          <ImageCard 
            title="Corporate Galas" 
            subtitle="Professional check-ins and analytics." 
            image="https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800" 
          />
          <ImageCard 
            title="Private Parties" 
            subtitle="Automate your guest lists." 
            image="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800" 
          />
        </div>
      </section>
    </div>
  );
}