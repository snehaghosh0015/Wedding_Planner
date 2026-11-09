import { Guest, RsvpStatus, DietaryOption } from '../types/wedding';

export interface RsvpStats {
  invited: number;
  confirmed: number;
  pending: number;
  declined: number;
  totalAttendees: number; // confirmed guests + their confirmed plus-ones
  confirmationRate: number; // percentage
  dietaryCounts: Record<DietaryOption, number>;
}

export function calculateRsvpStats(guests: Guest[]): RsvpStats {
  const dietaryCounts: Record<DietaryOption, number> = {
    'None': 0,
    'Vegetarian': 0,
    'Vegan': 0,
    'Gluten-Free': 0,
    'Halal': 0,
    'Kosher': 0,
    'Nut Allergy': 0,
  };

  let confirmed = 0;
  let pending = 0;
  let declined = 0;
  let totalAttendees = 0;

  for (const guest of guests) {
    if (guest.status === 'Confirmed') {
      confirmed += 1;
      totalAttendees += 1;
      if (dietaryCounts[guest.dietary] !== undefined) {
        dietaryCounts[guest.dietary] += 1;
      }
      if (guest.hasPlusOne && guest.plusOneName) {
        totalAttendees += 1;
        if (guest.plusOneDietary && dietaryCounts[guest.plusOneDietary] !== undefined) {
          dietaryCounts[guest.plusOneDietary] += 1;
        }
      }
    } else if (guest.status === 'Pending') {
      pending += 1;
    } else if (guest.status === 'Declined') {
      declined += 1;
    }
  }

  const invited = guests.length;
  const answered = confirmed + declined;
  const confirmationRate = invited > 0 ? Math.round((confirmed / invited) * 100) : 0;

  return {
    invited,
    confirmed,
    pending,
    declined,
    totalAttendees,
    confirmationRate,
    dietaryCounts,
  };
}

export function filterGuests(
  guests: Guest[],
  statusFilter: 'All' | RsvpStatus,
  searchQuery: string = ''
): Guest[] {
  const query = searchQuery.trim().toLowerCase();

  return guests.filter(guest => {
    const matchesStatus = statusFilter === 'All' || guest.status === statusFilter;
    const matchesQuery = !query || 
      guest.name.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query) ||
      (guest.plusOneName && guest.plusOneName.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });
}
