import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function Gallery() {
  const navigate = useNavigate();
  const items = [
    { title: "Afro Beats 2024", date: "Jan 12", img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800" },
    { title: "Wedding Gala", date: "Feb 15", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
    { title: "Corporate Summit", date: "Mar 20", img: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe6?auto=format&fit=crop&q=80&w=800" },
    { title: "Fashion Expo", date: "Apr 05", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
               <h1 className="text-3xl font-bold text-white">Event Gallery</h1>
            </div>
            <p className="text-slate-500 text-sm">Visual memories of your most successful events.</p>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold">Upload Photos</button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div key={i} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/5 bg-white/5">
              <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xs font-black text-violet-400 uppercase tracking-widest">{item.date}</p>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}