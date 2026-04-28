import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEvents } from "../services/mockData";

const categories = [
  { name: "All Schedules", icon: "calendar_today", key: "all", color: "text-slate-400 bg-white/5" },
  { name: "Event", icon: "stars", key: "Event", color: "text-purple-400 bg-purple-500/10" },
  { name: "Meeting", icon: "handshake", key: "Meeting", color: "text-blue-400 bg-blue-500/10" },
  { name: "Setup and Rehearsal", icon: "construction", key: "Setup and Rehearsal", color: "text-amber-400 bg-amber-500/10" },
  { name: "Task Deadlines", icon: "timer", key: "Task Deadlines", color: "text-rose-400 bg-rose-500/10" },
];

const initialAgendas = [
  { id: 1, title: 'Traditional Wedding Prep', category: 'Setup and Rehearsal', date: '2029-05-02', time: '09:00', location: 'Eko Hotels, Lagos', personInCharge: 'John Doe', notes: ['Confirm Aso Ebi distribution', 'Stage for live band'], team: ['JD', 'AS', 'RK'], comments: [{ user: 'JD', text: 'Catering van arrives at 6am.' }], image: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Nollywood Gala Premiere', category: 'Event', date: '2029-05-10', time: '19:00', location: 'Filmhouse IMAX', personInCharge: 'Maya Brooks', notes: ['Red carpet starts at 6pm', 'Security for VIPs'], team: ['MB', 'LC'], comments: [], image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Durbar Festival Sync', category: 'Meeting', date: '2029-05-15', time: '11:00', location: 'Kano Office', personInCharge: 'Maya Brooks', notes: ['Coordinate horse processions'], team: ['MB', 'JD', 'AS'], comments: [{ user: 'MB', text: 'Governor confirmed attendance.' }], image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800' },
  { id: 10, title: 'Naming Ceremony', category: 'Event', date: '2029-05-25', time: '10:00', location: 'Victoria Island', personInCharge: 'Maya Brooks', notes: ['Morning prayers', 'Brunch setup'], team: ['MB', 'LC', 'AS'], comments: [], image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800' },
  { id: 12, title: 'Safari Business Retreat', category: 'Meeting', date: '2029-05-29', time: '09:00', location: 'Kruger National Park', personInCharge: 'Alice Smith', notes: ['Itinerary review'], team: ['AS', 'RK'], comments: [], image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800' },
];

export default function Calendar() {
  const navigate = useNavigate();
  const [agendas, setAgendas] = useState(initialAgendas);
  const [viewDate, setViewDate] = useState(new Date(2029, 4, 1)); // May 2029
  const [selectedDate, setSelectedDate] = useState('2029-05-15');
  const [selectedAgendaId, setSelectedAgendaId] = useState(5);
  const [filter, setFilter] = useState('All Schedules');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Schedules');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [modalData, setModalData] = useState({ title: '', category: 'Meeting', date: '', time: '', location: '', personInCharge: '', notes: '' });

  const agendaCounts = useMemo(() => ({
    all: agendas.length,
    Event: agendas.filter(a => a.category === 'Event').length,
    Meeting: agendas.filter(a => a.category === 'Meeting').length,
    'Setup and Rehearsal': agendas.filter(a => a.category === 'Setup and Rehearsal').length,
    'Task Deadlines': agendas.filter(a => a.category === 'Task Deadlines').length,
  }), [agendas]);

  const filteredAgendas = useMemo(() => {
    return agendas.filter(a => {
      const matchesFilter = filter === 'All Schedules' || a.category === filter;
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [agendas, filter, search]);

  const selectedAgenda = useMemo(() => agendas.find(a => a.id === selectedAgendaId), [agendas, selectedAgendaId]);

  const calendarDays = useMemo(() => {
    const days = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [viewDate]);

  const handleAddAgenda = () => {
    setModalData({ title: '', category: 'Meeting', date: selectedDate, time: '12:00', location: '', personInCharge: 'Maya Brooks', notes: '' });
    setIsModalOpen(true);
  };

  const handleSaveAgenda = () => {
    if (!modalData.title || !modalData.date) return;
    const newAgenda = { ...modalData, id: Date.now(), notes: [modalData.notes], team: ['MB'], comments: [] };
    setAgendas([...agendas, newAgenda]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this schedule?')) {
      setAgendas(agendas.filter(a => a.id !== id));
      if (selectedAgendaId === id) setSelectedAgendaId(null);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = agendas.map(a => {
      if (a.id === selectedAgendaId) {
        return { ...a, comments: [...a.comments, { user: 'MB', text: newComment }] };
      }
      return a;
    });
    setAgendas(updated);
    setNewComment("");
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const changeYear = (offset) => {
    setViewDate(new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1));
  };

  const getCategoryStyles = (cat, isSelected) => {
    if (isSelected) return 'ring-2 ring-violet-500 bg-violet-500/20 text-white border-transparent';
    switch (cat) {
      case 'Meeting': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Event': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Setup and Rehearsal': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Task Deadlines': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-white/5 text-slate-400 border-white/10';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-10">
        {/* Left App Sidebar is already handled by Layout, but internal sub-navigation can go here if needed */}
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-6 min-w-0">
          {/* Top Bar Navigation (Internal to Page) */}
          <header className="flex items-center justify-between rounded-3xl bg-white/[0.03] p-4 shadow-sm border border-white/[0.05] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-500 font-medium">Dashboard / <span className="text-white">Calendar</span></div>
              <h1 className="text-xl font-semibold font-heading text-white tracking-tight ml-4">Calendar</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.02] px-4 py-2 border border-white/[0.05]">
                <span className="material-symbols-outlined text-sm text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder="Search schedules..." 
                  className="bg-transparent text-xs outline-none w-32 md:w-48 text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><span className="material-symbols-outlined">notifications</span></button>
            </div>
          </header>

          {/* Context Tabs */}
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-2xl w-fit">
            {['Schedules', 'Events', 'Gallery', 'Financial', 'Feedback'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-violet-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Summary Filtering Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.name}
                onClick={() => setFilter(cat.name)}
                className={`flex items-center gap-4 rounded-3xl border p-5 transition-all cursor-pointer ${
                  filter === cat.name ? 'bg-white/[0.08] border-violet-500/30 ring-2 ring-violet-500/5' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.color}`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{cat.name}</p>
                  <p className="text-xl font-bold text-white">{agendaCounts[cat.key === 'all' ? 'all' : cat.key]} <span className="text-xs font-medium text-slate-500">Agenda</span></p>
                </div>
              </button>
            ))}
          </div>

          {/* Context Modules */}
          <section className="flex flex-1 flex-col rounded-[2.5rem] bg-white/[0.02] shadow-sm border border-white/[0.05] p-6 backdrop-blur-xl min-h-[600px]">
            {activeTab === 'Schedules' && (
               <CalendarGrid 
                 viewDate={viewDate} 
                 calendarDays={calendarDays} 
                 selectedDate={selectedDate} 
                 setSelectedDate={setSelectedDate} 
                 setSelectedAgendaId={setSelectedAgendaId} 
                 filteredAgendas={filteredAgendas}
                 changeYear={changeYear}
                 changeMonth={changeMonth}
                 handleAddAgenda={handleAddAgenda}
               />
            )}

            {activeTab === 'Gallery' && <GalleryModule agendas={agendas} />}
            {activeTab === 'Financial' && <FinancialModule />}
            {activeTab === 'Feedback' && <FeedbackModule />}
            {activeTab === 'Events' && <EventsListModule navigate={navigate} />}
          </section>
        </div>

        {/* Right Detail Panel remains same but with updated imagery */}
        <DetailPanel 
          selectedAgenda={selectedAgenda} 
          handleDelete={handleDelete} 
          selectedAgendaId={selectedAgendaId} 
          newComment={newComment} 
          setNewComment={setNewComment} 
          handleAddComment={handleAddComment} 
          getCategoryStyles={getCategoryStyles}
          agendas={agendas}
          setAgendas={setAgendas}
          setIsModalOpen={setIsModalOpen}
          setModalData={setModalData}
        />
      </div>

      {/* Agenda Modal (Self-contained for now) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-[#141218] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="border-b border-white/5 p-8 flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-heading text-white tracking-tight">New Agenda</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title</label>
                <input 
                  type="text" 
                  className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/20" 
                  placeholder="e.g. Wedding Setup"
                  value={modalData.title}
                  onChange={(e) => setModalData({...modalData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                  <select 
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white outline-none"
                    value={modalData.category}
                    onChange={(e) => setModalData({...modalData, category: e.target.value})}
                  >
                    {categories.slice(1).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</label>
                  <input 
                    type="date" 
                    className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-3 text-sm text-white outline-none"
                    value={modalData.date}
                    onChange={(e) => setModalData({...modalData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-white/10 py-4 text-sm font-semibold text-slate-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAgenda}
                  className="flex-1 rounded-2xl bg-violet-600 py-4 text-sm font-semibold text-white shadow-md hover:bg-violet-500 transition-all"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function CalendarGrid({ viewDate, calendarDays, selectedDate, setSelectedDate, setSelectedAgendaId, filteredAgendas, changeYear, changeMonth, handleAddAgenda }) {
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <button onClick={() => changeYear(-1)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500"><span className="material-symbols-outlined text-sm">keyboard_double_arrow_left</span></button>
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <h2 className="text-2xl font-semibold font-heading text-white min-w-[160px] text-center">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            <button onClick={() => changeYear(1)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500"><span className="material-symbols-outlined text-sm">keyboard_double_arrow_right</span></button>
          </div>
        </div>
        <button onClick={handleAddAgenda} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-violet-500 transition-all">
          <span className="material-symbols-outlined text-sm">add</span> New Agenda
        </button>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-7 border-t border-l border-white/[0.05] min-w-[600px]">
          {dayNames.map(d => (
            <div key={d} className="border-r border-b border-white/[0.05] p-4 text-center text-[10px] font-bold tracking-widest text-slate-500">{d}</div>
          ))}
          {calendarDays.map((day, idx) => {
            const dateStr = day ? `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const dayAgendas = filteredAgendas.filter(a => a.date === dateStr);
            const isSelected = selectedDate === dateStr;
            return (
              <div key={idx} onClick={() => day && setSelectedDate(dateStr)} className={`min-h-[100px] border-r border-b border-white/[0.05] p-2 transition-colors cursor-pointer ${day ? (isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]') : 'bg-transparent'}`}>
                {day && (
                  <>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-violet-400' : 'text-slate-500'}`}>{day}</span>
                    <div className="mt-2 space-y-1">
                      {dayAgendas.map(a => (
                        <div key={a.id} onClick={(e) => { e.stopPropagation(); setSelectedAgendaId(a.id); setSelectedDate(a.date); }} className="truncate rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300 hover:scale-[1.02] transition-all">
                          {a.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GalleryModule({ agendas }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {agendas.filter(a => a.image).map(a => (
        <div key={a.id} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10">
          <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <p className="text-xs font-bold text-white">{a.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FinancialModule() {
  const expenses = [
    { item: 'Catering (Aso-Ebi/African)', budget: '$5,000', actual: '$4,800', status: 'Under' },
    { item: 'Venue Decor', budget: '$2,500', actual: '$3,100', status: 'Over' },
    { item: 'Live Band', budget: '$1,500', actual: '$1,500', status: 'On Track' },
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Event Budgeting</h3>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
            <tr><th className="p-4">Item</th><th className="p-4">Budget</th><th className="p-4">Actual</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {expenses.map((e, i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="p-4 font-medium">{e.item}</td><td className="p-4">{e.budget}</td><td className="p-4">{e.actual}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${e.status === 'Under' ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbackModule() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-400">★★★★★</span>
          <span className="text-xs text-slate-400">by Tunde A.</span>
        </div>
        <p className="text-sm text-slate-300">"The traditional wedding coordination was flawless! The stage for the live band was perfect."</p>
      </div>
    </div>
  );
}

function EventsListModule({ navigate }) {
  const events = getEvents();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => (
        <div 
          key={event.id} 
          onClick={() => navigate(`/events/${event.id}`)}
          className="group p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
        >
          <div className="h-32 rounded-xl overflow-hidden mb-3">
             <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
          </div>
          <p className="font-bold text-white text-sm truncate">{event.title}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{event.location}</p>
        </div>
      ))}
    </div>
  );
}

function DetailPanel({ selectedAgenda, handleDelete, selectedAgendaId, newComment, setNewComment, handleAddComment, getCategoryStyles, agendas, setAgendas, setIsModalOpen, setModalData }) {
  if (!selectedAgenda) return (
    <aside className="hidden w-[400px] flex-col items-center justify-center p-12 text-center text-slate-500 rounded-[2.5rem] bg-white/[0.03] border border-white/10 lg:flex shrink-0">
      <span className="material-symbols-outlined text-4xl mb-4">event_busy</span>
      <p className="text-sm font-medium">Select an agenda to view details</p>
    </aside>
  );

  return (
    <aside className="hidden w-[400px] flex-col overflow-hidden rounded-[2.5rem] bg-white/[0.03] border border-white/10 shadow-2xl lg:flex shrink-0 backdrop-blur-2xl">
      <div className="relative h-48 overflow-hidden">
        <img src={selectedAgenda.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"} alt="Event" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${getCategoryStyles(selectedAgenda.category, false)}`}>
            {selectedAgenda.category}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        <h2 className="text-2xl font-semibold font-heading text-white tracking-tight mb-2 mt-4">{selectedAgenda.title}</h2>
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span className="text-xs font-medium">{new Date(selectedAgenda.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="text-xs font-medium">{selectedAgenda.time}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-xs font-medium">{selectedAgenda.location}</span>
          </div>
        </div>
        <div className="mb-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Person In Charge</p>
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
            <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400">MB</div>
            <span className="text-sm font-semibold text-white">{selectedAgenda.personInCharge}</span>
          </div>
        </div>
        <div className="mb-6 text-slate-300">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Notes</p>
          <div className="space-y-2">
            {selectedAgenda.notes.map((note, i) => (
              <div key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                {note}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Comments</p>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2 custom-scrollbar">
            {selectedAgenda.comments.map((comment, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-3 border border-white/5">
                <span className="text-[10px] font-bold text-violet-400 block mb-1">{comment.user}</span>
                <p className="text-xs text-slate-300">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="relative">
            <input type="text" placeholder="Add a comment..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500/50" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} />
            <button onClick={handleAddComment} className="absolute right-2 top-1.5 p-1 text-violet-400 hover:text-violet-300 transition-colors"><span className="material-symbols-outlined text-sm">send</span></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <button 
            onClick={() => { setModalData(selectedAgenda); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">edit</span> Edit
          </button>
          <button onClick={() => handleDelete(selectedAgendaId)} className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors">
            <span className="material-symbols-outlined text-sm">delete</span> Delete
          </button>
          <button className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-xs font-semibold text-white hover:bg-violet-500 transition-colors shadow-md">
            <span className="material-symbols-outlined text-sm">notifications_active</span> Remind Me
          </button>
        </div>
      </div>
    </aside>
  );
}
