import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { fetchProviderAvailability, calculateStatusFromRule, subscribeToAvailability } from '../services/availabilityService';
import { getProviderById } from '../services/mockData';
import CalendarDayCell from '../components/CalendarDayCell';
import TimeSlotPicker from '../components/TimeSlotPicker';
import AvailabilityBadge from '../components/AvailabilityBadge';
import AvailabilityLegend from '../components/AvailabilityLegend';
import Icon from '../components/Icon';

function getMonthDays(year, month) {
  const days = [];
  const last = new Date(year, month + 1, 0);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function ProviderAvailability() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const provider = getProviderById(providerId);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    if (!providerId) return;
    const loadData = async () => {
      const data = await fetchProviderAvailability(providerId);
      setRules(data || []);
    };
    loadData();
    const sub = subscribeToAvailability(providerId, loadData);
    return () => sub.unsubscribe();
  }, [providerId, month, year]);

  if (!provider) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <p className="text-white">Provider not found.</p>
          <button onClick={() => navigate("/marketplace")} className="mt-4 text-violet-400 font-bold text-sm">Back to Marketplace</button>
        </div>
      </Layout>
    );
  }

  const days = getMonthDays(year, month);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const getRuleForDate = (date) => rules.find(r => r.date === date.toISOString().slice(0,10));
  const getStatus = (date) => calculateStatusFromRule(getRuleForDate(date));
  const getSlots = (date) => getRuleForDate(date)?.timeSlots || [];

  const handlePrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else { setMonth(m => m - 1); }
  };
  const handleNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else { setMonth(m => m + 1); }
  };
  
  const handleSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleBook = () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().slice(0,10);
    navigate(`/marketplace/${providerId}/book?date=${dateStr}&time=${selectedSlot?.startTime || ''}`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <header className="mb-8">
          <button onClick={() => navigate(`/marketplace/${providerId}`)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white mb-4 transition">
            <Icon name="arrow_back" className="text-lg" /> Back to Profile
          </button>
          <h1 className="text-3xl font-black text-white">{provider.businessName || provider.name} Availability</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">Check availability before booking. Select an open date and time slot to secure your reservation.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xl font-black text-white">
                {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-2">
                <button onClick={handlePrev} className="p-2 rounded-xl bg-[#111827] border border-white/10 text-white hover:bg-white/10 transition">&lt;</button>
                <button onClick={handleNext} className="p-2 rounded-xl bg-[#111827] border border-white/10 text-white hover:bg-white/10 transition">&gt;</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 bg-[#111827] border border-white/10 p-6 rounded-[2rem] shadow-xl">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">{d}</div>
              ))}
              {Array.from({ length: new Date(year, month, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(date => {
                const status = getStatus(date);
                const isPast = date < startOfToday;
                return (
                  <div key={date.toISOString()} className={isPast ? 'opacity-30 pointer-events-none' : ''}>
                    <CalendarDayCell
                      date={date}
                      status={status}
                      slots={getSlots(date)}
                      selected={selectedDate && date.toDateString() === selectedDate.toDateString()}
                      onClick={() => handleSelect(date)}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <AvailabilityLegend />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#111827] rounded-[2rem] p-6 border border-white/10 shadow-xl sticky top-6">
              {selectedDate ? (
                <>
                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Selected Date</p>
                    <h2 className="text-xl font-black text-white mb-2">{selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                    <AvailabilityBadge status={getStatus(selectedDate)} />
                  </div>
                  
                  {getStatus(selectedDate) === 'unavailable' ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
                      <p className="text-sm font-bold text-rose-400">This date is unavailable.</p>
                      <p className="text-xs text-rose-300 mt-1">Please select another date.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Available Time Slots</p>
                        {getSlots(selectedDate).length > 0 ? (
                          <TimeSlotPicker 
                            slots={getSlots(selectedDate)} 
                            selectedSlot={selectedSlot} 
                            onSelect={setSelectedSlot} 
                          />
                        ) : (
                          <p className="text-sm text-slate-400 bg-white/5 p-3 rounded-xl">Any time (No specific slots set)</p>
                        )}
                      </div>
                      
                      <button 
                        onClick={handleBook}
                        disabled={getSlots(selectedDate).length > 0 && !selectedSlot}
                        className="w-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:grayscale transition hover:opacity-90"
                      >
                        Continue to Booking
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
                  <Icon name="calendar_month" className="text-4xl text-slate-600 mb-4" />
                  <p className="text-sm font-bold text-slate-400">Select an available date to view time slots and book.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
