/**
 * Globalization Utility
 * Multi-Currency, Multi-Timezone, and Localization Helpers for EverAfter
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (Italy/EU)', rateAgainstUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.78 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateAgainstUSD: 152.0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateAgainstUSD: 84.5 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateAgainstUSD: 1.36 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateAgainstUSD: 1.50 },
};

export function convertFromUSD(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCIES[targetCurrency]?.rateAgainstUSD || 1.0;
  return Math.round(amountInUSD * rate);
}

export function formatGlobalCurrency(amountInUSD: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = convertFromUSD(amountInUSD, currency);
  return `${info.symbol}${converted.toLocaleString()}`;
}

export type TimezoneOption = {
  id: string;
  city: string;
  label: string;
  offsetHoursFromCET: number; // Tuscany is CET (UTC+1 or UTC+2 daylight)
};

export const GLOBAL_TIMEZONES: TimezoneOption[] = [
  { id: 'cet', city: 'Tuscany (Local Venue)', label: 'CET (Local Tuscany Time)', offsetHoursFromCET: 0 },
  { id: 'london', city: 'London / Dublin', label: 'BST / GMT (1 hr behind)', offsetHoursFromCET: -1 },
  { id: 'nyc', city: 'New York / Montreal', label: 'EDT (6 hrs behind)', offsetHoursFromCET: -6 },
  { id: 'sf', city: 'San Francisco / LA', label: 'PDT (9 hrs behind)', offsetHoursFromCET: -9 },
  { id: 'tokyo', city: 'Tokyo / Kyoto', label: 'JST (7 hrs ahead)', offsetHoursFromCET: 7 },
  { id: 'delhi', city: 'New Delhi / Mumbai', label: 'IST (4.5 hrs ahead)', offsetHoursFromCET: 4.5 },
];

export type SupportedCurrency = CurrencyCode;
export type SupportedTimezone = 'cet' | 'london' | 'nyc' | 'sf' | 'tokyo' | 'delhi';

export function getTimezoneOffset(tzId: string): number {
  const found = GLOBAL_TIMEZONES.find((t) => t.id.toLowerCase() === tzId.toLowerCase());
  return found ? found.offsetHoursFromCET : 0;
}

export function convertTimeCET(timeCETStr: string, timezoneOrOffset: string | number): string {
  const offsetHours = typeof timezoneOrOffset === 'number' 
    ? timezoneOrOffset 
    : getTimezoneOffset(timezoneOrOffset);

  if (offsetHours === 0) return timeCETStr;
  
  // Format: "4:30 PM CET" or "3:45 PM"
  const match = timeCETStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return timeCETStr;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === 'PM';

  if (isPM && hours < 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  let totalMinutes = hours * 60 + minutes + Math.round(offsetHours * 60);
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  totalMinutes %= (24 * 60);

  const newHours24 = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  const newPeriod = newHours24 >= 12 ? 'PM' : 'AM';
  const newHours12 = newHours24 % 12 === 0 ? 12 : newHours24 % 12;

  const minStr = String(newMinutes).padStart(2, '0');
  return `${newHours12}:${minStr} ${newPeriod}`;
}

export type SupportedLanguage = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ja';

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    story: 'Our Story',
    album: 'Live Album',
    rsvp: 'Logistics & RSVP',
    budget: 'Budget',
    concierge: 'Concierge',
    honeymoon: 'Honeymoon',
    seating: 'Seating Plan',
    weddingCard: 'Invitation Card',
    weather: 'Weather',
    ambiance: 'Ambiance',
    confirmAttendance: 'Confirm Attendance',
    dressCode: 'Black Tie Optional / Tuscan Garden Chic',
  },
  it: {
    story: 'La Nostra Storia',
    album: 'Album dal Vivo',
    rsvp: 'Logistica e RSVP',
    budget: 'Budget Matrimonio',
    concierge: 'Assistente AI',
    honeymoon: 'Luna di Miele',
    seating: 'Tavoli e Posti',
    weddingCard: 'Partecipazione',
    weather: 'Meteo Toscana',
    ambiance: 'Atmosfera',
    confirmAttendance: 'Conferma Presenza',
    dressCode: 'Abito Scuro / Eleganza Toscana',
  },
  fr: {
    story: 'Notre Histoire',
    album: 'Album en Direct',
    rsvp: 'Logistique et RSVP',
    budget: 'Budget Mariage',
    concierge: 'Concierge IA',
    honeymoon: 'Lune de Miel',
    seating: 'Plan de Table',
    weddingCard: 'Faire-part',
    weather: 'Météo Toscane',
    ambiance: 'Ambiance',
    confirmAttendance: 'Confirmer la Présence',
    dressCode: 'Tenue de Soirée / Jardin Toscan',
  },
  es: {
    story: 'Nuestra Historia',
    album: 'Álbum en Vivo',
    rsvp: 'Logística y RSVP',
    budget: 'Presupuesto',
    concierge: 'Asistente IA',
    honeymoon: 'Luna de Miel',
    seating: 'Mesas y Asientos',
    weddingCard: 'Invitación',
    weather: 'Clima Toscana',
    ambiance: 'Ambiente',
    confirmAttendance: 'Confirmar Asistencia',
    dressCode: 'Etiqueta Opcional / Elegancia Toscana',
  },
  de: {
    story: 'Unsere Geschichte',
    album: 'Live-Fotoalbum',
    rsvp: 'Logistik & RSVP',
    budget: 'Budget-Planer',
    concierge: 'KI-Assistent',
    honeymoon: 'Flitterwochen',
    seating: 'Sitzplan',
    weddingCard: 'Hochzeitskarte',
    weather: 'Wetter Toskana',
    ambiance: 'Ambiente',
    confirmAttendance: 'Zusage Bestätigen',
    dressCode: 'Festlich / Toskanischer Chic',
  },
  ja: {
    story: '二人の物語',
    album: 'ライブアルバム',
    rsvp: '出欠確認と案内',
    budget: '予算管理',
    concierge: 'AIコンシェルジュ',
    honeymoon: 'ハネムーン',
    seating: '座席表',
    weddingCard: '招待状',
    weather: 'トスカーナの天気',
    ambiance: 'ムード設定',
    confirmAttendance: 'ご出席の確認',
    dressCode: 'ブラックタイ・オプショナル / トスカーナ・シック',
  },
};
