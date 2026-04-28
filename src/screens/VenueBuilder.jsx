import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import * as Engine from "../auth/coreEngine";

const TOOLS = [
  { type: 'table', icon: 'table_restaurant', label: 'Table' },
  { type: 'seat', icon: 'chair', label: 'Seat' },
  { type: 'stage', icon: 'theater_comedy', label: 'Stage' },
  { type: 'bar', icon: 'local_bar', label: 'Bar' },
  { type: 'zone', icon: 'grid_view', label: 'VIP Zone' },
];

export default function VenueBuilder() {
  const [objects, setObjects] = useState([]);
  const [selectedTool, setSelectedTool] = useState('table');
  const [venueName, setVenueName] = useState("Main Ballroom");

  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / 20) * 20;
    const y = Math.round((e.clientY - rect.top) / 20) * 20;

    const newObj = {
      id: `obj-${Date.now()}`,
      type: selectedTool,
      x, y,
      label: `${selectedTool.toUpperCase()} ${objects.length + 1}`,
      status: 'available'
    };
    setObjects([...objects, newObj]);
  };

  const handleSave = () => {
    Engine.saveVenue({ name: venueName, layout: objects });
    alert("Venue layout saved to the Realm!");
  };

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        <header className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[2rem] border border-white/10">
          <div>
            <input 
              value={venueName} 
              onChange={e => setVenueName(e.target.value)}
              className="bg-transparent text-2xl font-black text-white outline-none border-b border-white/10 focus:border-violet-500 transition-colors"
            />
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Venue Layout Architect</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setObjects([])} className="px-6 py-2 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white">Reset</button>
            <button onClick={handleSave} className="px-6 py-2 bg-violet-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-violet-900/40">Save Venue</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
          {/* Toolbar */}
          <aside className="lg:col-span-2 space-y-3">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 mb-4">Construction Tools</p>
            {TOOLS.map(tool => (
              <button
                key={tool.type}
                onClick={() => setSelectedTool(tool.type)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  selectedTool === tool.type 
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg' 
                  : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined">{tool.icon}</span>
                <span className="text-xs font-bold uppercase">{tool.label}</span>
              </button>
            ))}
          </aside>

          {/* Canvas */}
          <main className="lg:col-span-10 relative bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden group cursor-crosshair">
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
            
            <div className="absolute inset-0" onClick={handleCanvasClick}>
              {objects.map(obj => (
                <div
                  key={obj.id}
                  style={{ left: obj.x, top: obj.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all hover:scale-110 ${
                    obj.type === 'stage' ? 'bg-amber-500/20 border-amber-500 text-amber-400 w-32 h-20' :
                    obj.type === 'zone' ? 'bg-purple-500/20 border-purple-500 text-purple-400 w-24 h-24' :
                    'bg-white/10 border-white/20 text-white w-12 h-12'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {TOOLS.find(t => t.type === obj.type)?.icon}
                  </span>
                  <span className="text-[8px] font-black uppercase text-center">{obj.label}</span>
                </div>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 pointer-events-none">
               <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Editor Legend</p>
               <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-[9px] text-gray-300">Selected</span></div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] text-gray-300">Available</span></div>
               </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}