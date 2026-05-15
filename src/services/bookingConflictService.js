// InviteGenie Booking Conflict Service (local/demo only)
import { fetchAvailabilityForDate } from './availabilityService';

export async function checkBookingConflict({ providerId, date, startTime, endTime, staffAssigned, capacity = 1 }) {
  const rule = await fetchAvailabilityForDate(providerId, date);
  
  if (rule && rule.status === 'unavailable') {
    return {
      hasConflict: true,
      severity: 'high',
      conflictType: 'double_booking',
      message: 'Provider is unavailable on this date.',
      suggestedSlots: []
    };
  }
  
  if (rule && rule.timeSlots && rule.timeSlots.length > 0 && startTime) {
    const slot = rule.timeSlots.find(s => s.startTime === startTime);
    if (slot) {
      if (slot.status !== 'available') {
        return {
          hasConflict: true,
          severity: 'medium',
          conflictType: 'double_booking',
          message: 'Selected time slot is no longer available.',
          suggestedSlots: rule.timeSlots.filter(s => s.status === 'available')
        };
      }
      if ((slot.bookedCount || 0) + capacity > (slot.capacity || 1)) {
        return {
          hasConflict: true,
          severity: 'high',
          conflictType: 'capacity_full',
          message: 'Time slot capacity is full.',
          suggestedSlots: rule.timeSlots.filter(s => s.status === 'available' && ((s.capacity || 1) - (s.bookedCount || 0)) >= capacity)
        };
      }
    }
  }

  return {
    hasConflict: false,
    severity: 'none',
    message: '',
    suggestedSlots: []
  };
}
