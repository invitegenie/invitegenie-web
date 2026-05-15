// InviteGenie AvailabilityCalendar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getOwnedProviderForUser } from '../services/marketplaceStorefrontService';
import Layout from '../components/Layout';
import {
  fetchProviderAvailability,
  blockDate,
  unblockDate,
  addTimeSlot,
  calculateStatusFromRule,
  subscribeToAvailability
} from '../services/availabilityService';
import AvailabilityBadge from '../components/AvailabilityBadge';
import CalendarDayCell from '../components/CalendarDayCell';
import TimeSlotPicker from '../components/TimeSlotPicker';
import AvailabilityLegend from '../components/AvailabilityLegend';
import Icon from '../components/Icon';

function getMonthDays(year, month) {
  const days = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function AvailabilityCalendar() {
  const { currentUser } = useAuth();
  const provider = getOwnedProviderForUser(currentUser?.id);
  const providerId = provider?.id;
  
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [rules, setRules] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '', capacity: 1 });
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!providerId) return;
    
    const loadData = async () => {
      const data = await fetchProviderAvailability(providerId);
      setRules(data || []);
    };
    
    loadData();
    
    const sub = subscribeToAvailability(providerId, () => {
      loadData();
    });
    
    return () => sub.unsubscribe();
  }, [providerId, refresh, month, year]);

  if (!providerId) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto py-8 px-4 text-center text-white">
          <h1 className="text-2xl font-black mb-4">Availability Calendar</h1>
          <p className="text-slate-400">Please create a marketplace listing first to manage your availability.</p>
        </div>
      </Layout>
    );
  }

  const days = getMonthDays(year, month);

  const getRuleForDate = (date) => rules.find(r => r.date === date.toISOString().slice(0,10));
  const getStatus = (date) => calculateStatusFromRule(getRuleForDate(date));
  const getSlots = (date) => getRuleForDate(date)?.timeSlots || [];

  const handlePrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else { setMonth(m => m - 1); }
  };
  const handleNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else { setMonth(m => m + 1); }
  };
  const handleSelect = (date) => setSelectedDate(date);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const selectedISO = selectedDate ? selectedDate.toISOString().slice(0,10) : null;
  const selectedRule = selectedISO ? getRuleForDate(selectedDate) : null;

  const handleAddSlot = async () => {
    if (!selectedISO || !newSlot.startTime || !newSlot.endTime) return;
    await addTimeSlot(providerId, selectedISO, { ...newSlot, status: 'available', bookedCount: 0, staffAssigned: [] });
    setRefresh(r => r + 1);
    showToast('Time slot added!');
    setNewSlot({ startTime: '', endTime: '', capacity: 1 });
  };
  const handleBlock = async () => {
    if (!selectedISO) return;
    await blockDate(providerId, selectedISO, 'Blocked by vendor');
    setRefresh(r => r + 1);
    showToast('Date blocked!');
  };
  const handleUnblock = async () => {
    if (!selectedISO) return;
    await unblockDate(providerId, selectedISO);
    setRefresh(r => r + 1);
    showToast('Date marked available!');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <header className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-400">Vendor Tools</p>
          <h1 className="text-3xl font-black text-white mt-2">Availability Calendar</h1>
          <p className="text-slate-400 mt-1 text-sm">Manage bookings, busy times and staff schedules for {provider?.businessName}.</p>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <button onClick={handlePrev} className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white hover:bg-white/10 transition">&lt;</button>
              <span className="text-lg font-bold text-white min-w-[150px] text-center">
                {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={handleNext} className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white hover:bg-white/10 transition">&gt;</button>
            </div>
            <AvailabilityLegend />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-2 bg-[#111827] border border-white/10 p-6 rounded-[2rem] shadow-xl">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">{d}</div>
              ))}
              {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(date => (
                <CalendarDayCell
                  key={date.toISOString()}
                  date={date}
                  status={getStatus(date)}
                  slots={getSlots(date)}
                  selected={selectedDate && date.toDateString() === selectedDate.toDateString()}
                  onClick={() => handleSelect(date)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="bg-[#111827] rounded-[2rem] p-6 border border-white/10 shadow-xl sticky top-6">
                <div className="flex flex-col gap-2 mb-6">
                  <h2 className="text-xl font-black text-white">{selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                  <AvailabilityBadge status={getStatus(selectedDate)} />
                </div>
                
                {selectedRule?.reason && (
                  <div className="mb-4 text-sm font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    {selectedRule.reason}
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Time Slots</h3>
                  {getSlots(selectedDate).length > 0 ? (
                    <TimeSlotPicker slots={getSlots(selectedDate)} selectedSlot={null} onSelect={() => {}} />
                  ) : (
                    <p className="text-sm text-slate-400">No time slots defined.</p>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manage Availability</h3>
                  
                  <div className="flex gap-2">
                    <input type="time" value={newSlot.startTime} onChange={e => setNewSlot(s => ({ ...s, startTime: e.target.value }))} className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-full outline-none focus:border-violet-500" />
                    <input type="time" value={newSlot.endTime} onChange={e => setNewSlot(s => ({ ...s, endTime: e.target.value }))} className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-full outline-none focus:border-violet-500" />
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <input type="number" min={1} value={newSlot.capacity} onChange={e => setNewSlot(s => ({ ...s, capacity: Number(e.target.value) }))} className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white w-20 outline-none focus:border-violet-500" placeholder="Cap" title="Capacity" />
                    <button onClick={handleAddSlot} disabled={!newSlot.startTime || !newSlot.endTime} className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex-1 disabled:opacity-50 transition">Add Slot</button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <button onClick={handleBlock} className="border border-rose-500/50 bg-rose-500/10 text-rose-300 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition">Block Day</button>
                    <button onClick={handleUnblock} className="border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition">Available</button>
                  </div>
                </div>

                {toast && <div className="mt-4 text-xs font-bold text-emerald-400 bg-emerald-400/10 p-3 rounded-xl text-center border border-emerald-400/20">{toast}</div>}
              </div>
            ) : (
              <div className="bg-[#111827] rounded-[2rem] p-6 border border-white/10 shadow-xl flex flex-col items-center justify-center min-h-[300px] text-center sticky top-6">
                <Icon name="calendar_month" className="text-4xl text-slate-600 mb-4" />
                <p className="text-sm font-bold text-slate-400">Select a date to manage availability</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
