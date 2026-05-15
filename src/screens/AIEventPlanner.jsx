import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { useAuth } from "../auth/AuthContext";
import { 
  generateAIEventPlan, 
  getAIEventPlans, 
  updateAIChecklistItem,
  buildWebsiteInputFromAIPlan,
  saveAIEventPlanExport
} from "../services/aiEventPlannerService";
import {
  PlannerPromptInput,
  AISuggestionChips,
  BudgetBreakdownCard,
  PlanningTimeline,
  ChecklistSection,
  GuestEstimator,
  VendorSuggestionCard,
  DecorMoodBoard,
  SeatingLayoutPreview,
  EventPlanExport
} from "../components/AIPlannerWidgets";

export default function AIEventPlanner() {
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const eventIdFromParams = searchParams.get('eventId');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);

  // Load existing plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      const loadedPlans = await getAIEventPlans(currentUser?.id);
      setPlans(loadedPlans || []);
      
      if (planId) {
        const found = (loadedPlans || []).find(p => String(p.id) === String(planId));
        if (found) setActivePlan(found);
      } else if (eventIdFromParams) {
        // If opened from an event, find if it has an AI plan
        const found = (loadedPlans || []).find(p => String(p.eventId) === String(eventIdFromParams));
        if (found) {
          setActivePlan(found);
          navigate(`/ai-planner/${found.id}`, { replace: true });
        }
      }
    };
    loadPlans();
  }, [planId, eventIdFromParams, navigate, currentUser?.id]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI loading delay for realism
    setTimeout(async () => {
      try {
        const options = { eventId: searchParams.get('eventId') };
        const newPlan = await generateAIEventPlan(prompt, currentUser, options);
        setPlans(prev => [newPlan, ...prev]);
        setActivePlan(newPlan);
        setPrompt("");
        navigate(`/ai-planner/${newPlan.id}`);
      } catch (err) {
        console.error("Failed to generate plan", err);
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  const toggleChecklist = async (taskId, completed) => {
    if (!activePlan) return;
    const updated = await updateAIChecklistItem(activePlan.id, taskId, completed);
    setActivePlan(updated);
    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
  };
  
  const launchWebsiteGenerator = () => {
    if (!activePlan) return;
    const websiteInput = buildWebsiteInputFromAIPlan(activePlan);
    localStorage.setItem('ig_ai_website_input', JSON.stringify(websiteInput));
    navigate(activePlan.eventId ? `/events/${activePlan.eventId}/website` : `/venue-builder`);
  };

  const launchVenueBuilder = () => {
    if (!activePlan) return;
    navigate(activePlan.eventId ? `/events/${activePlan.eventId}/venue-builder` : `/venue-builder?planId=${activePlan.id}`);
  };

  const launchSeatingPlanner = () => {
    if (!activePlan) return;
    navigate(activePlan.eventId ? `/seating-planner/${activePlan.eventId}` : `/venue-builder?planId=${activePlan.id}`);
  };

  const handleExport = (type) => {
    if (!activePlan) return;
    saveAIEventPlanExport(activePlan.id, type);
    if (type === "csv") {
      const csv = Object.entries(activePlan.budgetBreakdown || {})
        .map(([category, amount]) => `${category},${amount},FCFA`)
        .join("\n");
      localStorage.setItem("demo_ai_event_budget_csv", csv);
    }
  };

  const handleShare = async () => {
    if (!activePlan) return;
    const url = `${window.location.origin}/ai-planner/${activePlan.id}`;
    if (navigator.share) await navigator.share({ title: activePlan.title, text: activePlan.aiSummary, url });
    else await navigator.clipboard.writeText(url);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-32">
        
        {/* Header & Prompt Section */}
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400 bg-violet-500/10 w-fit px-3 py-1 rounded-full mb-4">InviteGenie Intelligence</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">AI Event Planning Assistant</h1>
          <p className="text-slate-400 text-lg max-w-2xl">Describe your vision, budget, and guest count. Our intelligent engine will generate a complete strategy, budget breakdown, and vendor recommendations instantly.</p>
          
          <PlannerPromptInput 
            value={prompt} 
            onChange={setPrompt} 
            onSubmit={handleGenerate} 
            isGenerating={isGenerating} 
          />
          <AISuggestionChips onSelect={(chip) => { setPrompt(chip); }} />
        </div>

        {/* Main Dashboard area */}
        {activePlan ? (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/20 border border-violet-500/20 p-6 rounded-[2rem]">
              <div>
                <h2 className="text-2xl font-black text-white">{activePlan.title}</h2>
                <p className="text-sm text-violet-200 mt-1 max-w-3xl leading-relaxed">{activePlan.aiSummary}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={launchWebsiteGenerator} className="bg-white text-slate-900 text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full hover:bg-slate-200 transition shadow-xl">
                  Generate Website
                </button>
                <button onClick={launchVenueBuilder} className="bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full hover:opacity-90 transition shadow-xl">
                  Venue Builder
                </button>
                <button onClick={() => handleExport("pdf")} className="bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full hover:bg-white/20 transition">
                  Export PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BudgetBreakdownCard budget={activePlan.budgetBreakdown} currency={activePlan.currency} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChecklistSection checklist={activePlan.checklist} onToggle={toggleChecklist} />
                  <PlanningTimeline timeline={activePlan.timeline} />
                </div>
                
                <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl">
                  <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                    <Icon name="storefront" className="text-amber-400" /> AI Vendor Matches
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {activePlan.vendorSuggestions.map(vendor => (
                      <VendorSuggestionCard key={vendor.vendorId} vendor={vendor} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <GuestEstimator guestCount={activePlan.guestCount} catering={activePlan.cateringEstimate} seating={activePlan.seatingSuggestions} />
                
                <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                     <Icon name="architecture" className="text-3xl text-emerald-400" />
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">Interactive Seating</h3>
                  <p className="text-xs text-slate-400 mb-4">Design your floor plan with drag-and-drop tables, VIP zones, and seating assignments.</p>
                  <SeatingLayoutPreview seating={activePlan.seatingSuggestions} />
                  <button onClick={launchSeatingPlanner} className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md">
                    <Icon name="drag_indicator" className="text-[16px]" /> Open Drag & Drop Builder
                  </button>
                </div>

                <DecorMoodBoard theme={activePlan.generatedTheme} />
                <EventPlanExport plan={activePlan} onExport={handleExport} onShare={handleShare} onSave={() => handleExport("dashboard")} />
                
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-6 shadow-xl">
                  <h3 className="text-rose-400 font-black text-lg mb-3 flex items-center gap-2"><Icon name="warning" /> Risk Management</h3>
                  <ul className="list-disc list-inside text-rose-200/80 text-sm space-y-2 ml-2">
                    {activePlan.riskRecommendations.map((risk, i) => <li key={i}><strong>{risk.title}:</strong> {risk.desc}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : plans.length > 0 && !isGenerating ? (
          <div className="mt-12">
            <h3 className="text-white font-bold text-xl mb-6">Recent AI Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map(p => (
                <button key={p.id} onClick={() => navigate(`/ai-planner/${p.id}`)} className="bg-[#111827] border border-white/10 rounded-2xl p-5 text-left hover:border-violet-500/50 transition flex flex-col justify-between min-h-[140px]">
                  <div>
                    <h4 className="text-white font-bold truncate">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{p.guestCount} guests • {p.estimatedBudget.toLocaleString()} FCFA</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 w-fit px-2 py-1 rounded-md mt-4">Open Plan &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
