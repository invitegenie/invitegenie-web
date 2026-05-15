import { supabase } from '../lib/supabaseClient';

const AVAILABILITY_KEY = 'demo_availability_rules';

export function getLocalAvailability() {
  if (typeof localStorage === 'undefined') return [];
  return JSON.parse(localStorage.getItem(AVAILABILITY_KEY) || '[]');
}

export function saveLocalAvailability(rules) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(rules));
  }
}

export async function fetchProviderAvailability(providerId) {
  try {
    const { data, error } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('providerId', providerId);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Using local availability data.", e);
    return getLocalAvailability().filter(r => r.providerId === providerId);
  }
}

export async function fetchAvailabilityForDate(providerId, date) {
  try {
    const { data, error } = await supabase
      .from('availability_rules')
      .select('*')
      .eq('providerId', providerId)
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) {
    return getLocalAvailability().find(r => r.providerId === providerId && r.date === date);
  }
}

export async function upsertAvailabilityRule(rule) {
  try {
    const { data, error } = await supabase
      .from('availability_rules')
      .upsert(rule)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn("Supabase upsert failed, using local storage.", e);
    const rules = getLocalAvailability();
    const idx = rules.findIndex(r => r.providerId === rule.providerId && r.date === rule.date);
    let newRule = { ...rule, updatedAt: new Date().toISOString() };
    if (idx !== -1) {
      newRule = { ...rules[idx], ...newRule };
      rules[idx] = newRule;
    } else {
      newRule.id = newRule.id || `AR-${Date.now()}`;
      newRule.createdAt = new Date().toISOString();
      rules.push(newRule);
    }
    saveLocalAvailability(rules);
    return newRule;
  }
}

export async function blockDate(providerId, date, reason) {
  const rule = await fetchAvailabilityForDate(providerId, date) || { providerId, date, timeSlots: [] };
  rule.status = 'unavailable';
  rule.reason = reason;
  return upsertAvailabilityRule(rule);
}

export async function unblockDate(providerId, date) {
  const rule = await fetchAvailabilityForDate(providerId, date);
  if (rule) {
    rule.status = 'available';
    rule.reason = '';
    return upsertAvailabilityRule(rule);
  }
}

export async function addTimeSlot(providerId, date, slot) {
  const rule = await fetchAvailabilityForDate(providerId, date) || { providerId, date, status: 'available', reason: '', timeSlots: [] };
  rule.timeSlots = rule.timeSlots || [];
  rule.timeSlots.push({ ...slot, id: `TS-${Date.now()}` });
  return upsertAvailabilityRule(rule);
}

export function calculateStatusFromRule(rule) {
  if (!rule) return 'available';
  if (rule.status === 'unavailable') return 'unavailable';
  const slots = rule.timeSlots || [];
  const total = slots.reduce((sum, s) => sum + (s.capacity || 1), 0);
  const booked = slots.reduce((sum, s) => sum + (s.bookedCount || 0), 0);
  if (total === 0) return 'available';
  if (booked >= total) return 'unavailable';
  if (total - booked <= Math.max(1, Math.floor(total * 0.3))) return 'almost_booked';
  return 'available';
}

export async function calculateAvailabilityStatus(providerId, date) {
  const rule = await fetchAvailabilityForDate(providerId, date);
  return calculateStatusFromRule(rule);
}

export async function syncAvailabilityAfterBooking(order) {
  // order: { providerId, date, timeSlotId, startTime, quantity }
  const { providerId, date, timeSlotId, startTime, quantity = 1 } = order;
  const rule = await fetchAvailabilityForDate(providerId, date);
  if (!rule) return;
  
  rule.timeSlots = (rule.timeSlots || []).map(s => {
    if (s.id === timeSlotId || s.startTime === startTime) {
      const bookedCount = (s.bookedCount || 0) + quantity;
      let status = s.status;
      if (bookedCount >= (s.capacity || 1)) status = 'booked';
      return { ...s, bookedCount, status };
    }
    return s;
  });
  
  await upsertAvailabilityRule(rule);
}

export function subscribeToAvailability(providerId, callback) {
  if (!supabase) return { unsubscribe: () => {} };
  
  return supabase.channel(`availability_${providerId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'availability_rules',
      filter: `providerId=eq.${providerId}`
    }, callback)
    .subscribe();
}
