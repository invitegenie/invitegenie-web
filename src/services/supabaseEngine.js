/**
 * Supabase Service Engine
 * 
 * Handles all Supabase database operations.
 * Provides localStorage fallback if Supabase is not configured or an error occurs.
 * 
 * IMPORTANT: This is production-safe and does not break existing functionality.
 * - It exports async functions only
 * - It gracefully handles errors
 * - It returns null/empty arrays on error instead of throwing
 */

import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';

// Helper to get data from localStorage
const getFromLocalStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return [];
  }
};

/**
 * Events Service
 */
export const getEventsFromSupabase = async (filters = {}) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for events.');
      const events = getFromLocalStorage('ig_events');
      if (filters.status) {
        return events.filter(e => e.status === filters.status);
      }
      return events;
    }

    let query = supabase.from('events').select('*');
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.hostId) {
      query = query.eq('host_id', filters.hostId);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching events from Supabase:', error);
      return getFromLocalStorage('ig_events'); // Fallback on Supabase error
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getEventsFromSupabase error:', err);
    return getFromLocalStorage('ig_events'); // Fallback on unexpected error
  }
};

export const createEventInSupabase = async (eventData) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for createEvent.');
      // localStorage is handled by coreEngine, just return the data for consistency
      return eventData;
    }

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event in Supabase:', error);
      // If Supabase fails, coreEngine will still have saved to localStorage
      return eventData; 
    }
    return data;
  } catch (err) {
    console.error('Supabase createEventInSupabase error:', err);
    return eventData; // Return original data if Supabase fails
  }
};

/**
 * Tickets Service
 */
export const getTicketsFromSupabase = async (userId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for tickets.');
      const tickets = getFromLocalStorage('ig_tickets');
      return userId ? tickets.filter(t => t.user_id === userId) : tickets;
    }

    let query = supabase.from('tickets').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching tickets from Supabase:', error);
      return getFromLocalStorage('ig_tickets');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getTicketsFromSupabase error:', err);
    return getFromLocalStorage('ig_tickets');
  }
};

export const createTicketInSupabase = async (ticketData) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for createTicket.');
      return ticketData;
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating ticket in Supabase:', error);
      return ticketData;
    }
    return data;
  } catch (err) {
    console.error('Supabase createTicketInSupabase error:', err);
    return ticketData;
  }
};

/**
 * Memories Service
 */
export const getMemoriesFromSupabase = async (eventId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for memories.');
      const memories = getFromLocalStorage('ig_memories');
      if (eventId) {
        return memories.filter(m => m.event_id === eventId);
      }
      return memories;
    }

    let query = supabase.from('memories').select('*');
    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching memories from Supabase:', error);
      return getFromLocalStorage('ig_memories');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getMemoriesFromSupabase error:', err);
    return getFromLocalStorage('ig_memories');
  }
};

export const createMemoryInSupabase = async (memoryData) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for createMemory.');
      return memoryData;
    }

    const { data, error } = await supabase
      .from('memories')
      .insert([memoryData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating memory in Supabase:', error);
      return memoryData;
    }
    return data;
  } catch (err) {
    console.error('Supabase createMemoryInSupabase error:', err);
    return memoryData;
  }
};

/**
 * Profiles Service
 */
export const getProfilesFromSupabase = async (userId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for profiles.');
      const profiles = getFromLocalStorage('ig_users'); // Assuming ig_users stores profiles
      if (userId) {
        return profiles.find(p => p.id === userId) || null;
      }
      return profiles;
    }

    let query = supabase.from('profiles').select('*');
    if (userId) {
      const { data, error } = await query.eq('id', userId).maybeSingle();
      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        return null;
      }
      return data;
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching profiles from Supabase:', error);
      return getFromLocalStorage('ig_users');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getProfilesFromSupabase error:', err);
    return getFromLocalStorage('ig_users');
  }
};

/**
 * Payments Service
 */
export const getPaymentsFromSupabase = async (userId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for payments.');
      const payments = getFromLocalStorage('ig_payments');
      if (userId) {
        return payments.filter(p => p.user_id === userId);
      }
      return payments;
    }

    let query = supabase.from('payments').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching payments from Supabase:', error);
      return getFromLocalStorage('ig_payments');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getPaymentsFromSupabase error:', err);
    return getFromLocalStorage('ig_payments');
  }
};

/**
 * Invitations Service
 */
export const getInvitationsFromSupabase = async (userId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for invitations.');
      const invitations = getFromLocalStorage('ig_invitations');
      if (userId) {
        return invitations.filter(i => i.host_id === userId || i.guest_id === userId);
      }
      return invitations;
    }

    let query = supabase.from('invitations').select('*');
    if (userId) {
      query = query.or(`host_id.eq.${userId},guest_id.eq.${userId}`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching invitations from Supabase:', error);
      return getFromLocalStorage('ig_invitations');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getInvitationsFromSupabase error:', err);
    return getFromLocalStorage('ig_invitations');
  }
};

/**
 * Freelancers Service
 */
export const getFreelancersFromSupabase = async (category = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for freelancers.');
      const freelancers = getFromLocalStorage('ig_freelancers');
      if (category) {
        return freelancers.filter(f => f.category === category);
      }
      return freelancers;
    }

    let query = supabase.from('freelancers').select('*');
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching freelancers from Supabase:', error);
      return getFromLocalStorage('ig_freelancers');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getFreelancersFromSupabase error:', err);
    return getFromLocalStorage('ig_freelancers');
  }
};

/**
 * Gigs Service
 */
export const getGigsFromSupabase = async (freelancerId = null) => {
  try {
    if (!isSupabaseEnabled()) {
      console.debug('Supabase not enabled, using localStorage fallback for gigs.');
      const gigs = getFromLocalStorage('ig_gigs');
      if (freelancerId) {
        return gigs.filter(g => g.freelancer_id === freelancerId);
      }
      return gigs;
    }

    let query = supabase.from('gigs').select('*');
    if (freelancerId) {
      query = query.eq('freelancer_id', freelancerId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching gigs from Supabase:', error);
      return getFromLocalStorage('ig_gigs');
    }
    return data || [];
  } catch (err) {
    console.error('Supabase getGigsFromSupabase error:', err);
    return getFromLocalStorage('ig_gigs');
  }
};

/**
 * Health check - ensure Supabase is properly configured and connected
 */
export const checkSupabaseHealth = async () => {
  try {
    if (!isSupabaseEnabled()) {
      return {
        enabled: false,
        configured: false,
        message: 'Supabase client not initialized (missing URL or Anon Key).',
      };
    }

    // Try a simple query to test connection
    const { error } = await supabase.from('events').select('id').limit(1);
    
    if (error) {
      console.warn('Supabase connection issue:', error);
      return {
        enabled: true,
        configured: true,
        connected: false,
        message: `Supabase configured but connection failed: ${error.message}`,
      };
    }

    return {
      enabled: true,
      configured: true,
      connected: true,
      message: 'Supabase is operational.',
    };
  } catch (err) {
    console.error('Supabase health check error:', err);
    return {
      enabled: false,
      configured: false,
      message: `Error checking Supabase health: ${err.message}`,
    };
  }
};

export default {
  getEventsFromSupabase,
  createEventInSupabase,
  getTicketsFromSupabase,
  createTicketInSupabase,
  getMemoriesFromSupabase,
  createMemoryInSupabase,
  getProfilesFromSupabase,
  getPaymentsFromSupabase,
  getInvitationsFromSupabase,
  getFreelancersFromSupabase,
  getGigsFromSupabase,
  checkSupabaseHealth,
  isSupabaseEnabled, // Re-export for coreEngine
};