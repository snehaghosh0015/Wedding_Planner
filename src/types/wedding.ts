export type UserRole = 'Couple' | 'Guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: 'google' | 'apple' | 'email';
  avatar?: string;
  isPlusOneAllowed?: boolean;
}

export type RsvpStatus = 'Invited' | 'Confirmed' | 'Pending' | 'Declined';
export type DietaryOption = 'None' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Kosher' | 'Nut Allergy';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: RsvpStatus;
  tableNumber?: number;
  dietary: DietaryOption;
  hasPlusOne: boolean;
  plusOneName?: string;
  plusOneDietary?: DietaryOption;
  attendingCeremony: boolean;
  attendingReception: boolean;
  notes?: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Venue' 
  | 'Catering' 
  | 'Outfits' 
  | 'Photography' 
  | 'Flowers & Decor' 
  | 'Entertainment' 
  | 'Stationery' 
  | 'Favors & Gifts';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  vendorName: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  dueDate: string;
  isPaid: boolean;
  notes?: string;
}

export interface StoryMilestone {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  quote?: string;
  imageUrl: string;
  category: 'Met' | 'First Date' | 'Adventure' | 'The Move' | 'Proposal' | 'The Ring' | 'Promise' | 'Tradition';
}

export interface AlbumPhoto {
  id: string;
  uploaderName: string;
  uploaderRole: UserRole;
  imageUrl: string;
  caption: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  tags: string[];
}

export interface StoryMoment {
  id: string;
  userName: string;
  userRole: UserRole;
  mediaUrl: string;
  text?: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (24h later)
  viewed?: boolean;
}

export type HoneymoonVibe = 
  | 'Beach' 
  | 'Mountains' 
  | 'Cultural' 
  | 'Romantic Hideaway' 
  | 'Adventure' 
  | 'Gastronomy';

export interface HoneymoonDestination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  vibes: HoneymoonVibe[];
  estimatedCostTotal: number;
  costBreakdown: {
    flights: number;
    luxuryStayPerNight: number;
    nights: number;
    activitiesAndDining: number;
  };
  bestSeason: string;
  romanticHighlights: string[];
  imageUrl: string;
  rating: number;
}
