import { Guest } from '../types/wedding';

export interface TableConfig {
  id: number;
  name: string;
  theme: string;
  capacity: number;
  location: string;
  accentColor?: string;
}

export const TABLES: TableConfig[] = [
  { 
    id: 1, 
    name: 'Terrazza Belvedere', 
    theme: 'Bridal Party & Immediate Family', 
    capacity: 8, 
    location: 'Upper Garden Terrace',
    accentColor: 'rose'
  },
  { 
    id: 2, 
    name: 'Prato dei Cipressi', 
    theme: 'Close Friends & Plus-Ones', 
    capacity: 8, 
    location: 'Cypress Lawn',
    accentColor: 'emerald'
  },
  { 
    id: 3, 
    name: 'Loggia Antica', 
    theme: 'University & Travel Companions', 
    capacity: 8, 
    location: 'Arched Courtyard Loggia',
    accentColor: 'amber'
  },
  { 
    id: 4, 
    name: 'Fontana della Piazza', 
    theme: 'International Travelers & Colleagues', 
    capacity: 8, 
    location: 'Stone Fountain Plaza',
    accentColor: 'sky'
  },
  { 
    id: 5, 
    name: 'Vigneto Romantico', 
    theme: 'Extended Family & Guests', 
    capacity: 8, 
    location: 'Olive Grove Overlook',
    accentColor: 'purple'
  },
];

export interface TableStats {
  tableId: number;
  primaryGuestsCount: number;
  plusOnesCount: number;
  totalSeatsOccupied: number;
  capacity: number;
  remainingSeats: number;
  isFull: boolean;
  isOverCapacity: boolean;
  occupancyPercentage: number;
  dietaryCounts: Record<string, number>;
}

/**
 * Calculates comprehensive seat occupancy and dietary stats for a given table.
 */
export function calculateTableStats(
  tableId: number, 
  capacity: number, 
  guests: Guest[]
): TableStats {
  const seatedGuests = guests.filter((g) => (g.tableNumber || 1) === tableId);
  const primaryGuestsCount = seatedGuests.length;
  const plusOnesCount = seatedGuests.reduce(
    (acc, g) => acc + (g.hasPlusOne && g.plusOneName ? 1 : 0), 
    0
  );
  const totalSeatsOccupied = primaryGuestsCount + plusOnesCount;
  const remainingSeats = Math.max(0, capacity - totalSeatsOccupied);
  const isFull = totalSeatsOccupied >= capacity;
  const isOverCapacity = totalSeatsOccupied > capacity;
  const occupancyPercentage = Math.min(100, Math.round((totalSeatsOccupied / capacity) * 100));

  const dietaryCounts: Record<string, number> = {};
  seatedGuests.forEach((g) => {
    if (g.dietary && g.dietary !== 'None') {
      dietaryCounts[g.dietary] = (dietaryCounts[g.dietary] || 0) + 1;
    }
    if (g.hasPlusOne && g.plusOneDietary && g.plusOneDietary !== 'None') {
      dietaryCounts[g.plusOneDietary] = (dietaryCounts[g.plusOneDietary] || 0) + 1;
    }
  });

  return {
    tableId,
    primaryGuestsCount,
    plusOnesCount,
    totalSeatsOccupied,
    capacity,
    remainingSeats,
    isFull,
    isOverCapacity,
    occupancyPercentage,
    dietaryCounts,
  };
}

/**
 * Groups guests by their assigned table number (defaults unassigned to Table 1).
 */
export function getGuestsByTable(guests: Guest[]): Record<number, Guest[]> {
  const grouped: Record<number, Guest[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  guests.forEach((guest) => {
    const tblId = guest.tableNumber && grouped[guest.tableNumber] ? guest.tableNumber : 1;
    grouped[tblId].push(guest);
  });

  return grouped;
}

/**
 * Pure function to reassign a guest to a new table.
 */
export function reassignGuestTable(
  guests: Guest[], 
  guestId: string, 
  newTableId: number
): Guest[] {
  if (newTableId < 1 || newTableId > 5) {
    return guests;
  }
  return guests.map((g) => {
    if (g.id === guestId) {
      return {
        ...g,
        tableNumber: newTableId,
        updatedAt: new Date().toISOString(),
      };
    }
    return g;
  });
}

/**
 * Filter guests by table selection and case-insensitive search string.
 */
export function filterSeatingGuests(
  guests: Guest[],
  selectedTableId: number | 'all',
  searchQuery: string
): Guest[] {
  const q = searchQuery.trim().toLowerCase();
  return guests.filter((g) => {
    const matchesQuery = 
      !q ||
      g.name.toLowerCase().includes(q) ||
      (g.plusOneName && g.plusOneName.toLowerCase().includes(q)) ||
      (g.dietary && g.dietary.toLowerCase().includes(q));

    if (selectedTableId === 'all') {
      return matchesQuery;
    }
    return matchesQuery && (g.tableNumber || 1) === selectedTableId;
  });
}
