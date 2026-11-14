import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  Scan, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Camera, 
  UserCheck, 
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { Guest } from '../types/wedding';
import { OliveBranchFlourish } from './RomanticFlourish';
import { convertTimeCET, SupportedCurrency, SupportedLanguage, SupportedTimezone } from '../utils/globalization';

interface WeddingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  onCheckInGuest?: (guestId: string) => void;
  selectedTimezone?: SupportedTimezone;
  selectedLanguage?: SupportedLanguage;
}

export const WeddingCardModal: React.FC<WeddingCardModalProps> = ({
  isOpen,
  onClose,
  guests,
  onCheckInGuest,
  selectedTimezone = 'CET',
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'scanner'>('card');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<Guest | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateScan = (guest: Guest) => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(guest);
      onCheckInGuest?.(guest.id);
    }, 1100);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = guests.find(
      (g) =>
        g.name.toLowerCase().includes(manualCode.toLowerCase()) ||
        g.id.toLowerCase() === manualCode.toLowerCase()
    );
    if (found) {
      setScannedResult(found);
      onCheckInGuest?.(found.id);
    } else {
      alert(`No guest found matching pass code "${manualCode}". Try searching "Sofia" or "Liam".`);
    }
  };

  const localCeremonyTime = convertTimeCET('4:30 PM', selectedTimezone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header (Hidden in Print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Official Wedding Card & QR Pass
              </h3>
              <p className="text-xs text-stone-300">
                Print heirloom stationery or scan guest passes for VIP estate check-in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Toggle (Hidden in Print) */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 py-2.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'card'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Wedding Invitation Card
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-rose-700" />
              <span>QR Scanner & Check-In</span>
            </button>
          </div>

          {activeTab === 'card' && (
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Wedding Card</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-100/60">
          {activeTab === 'card' ? (
            <div className="max-w-xl mx-auto space-y-4">
              {/* THE WEDDING CARD - Styled for Screen & Optimized for Print */}
              <div 
                id="printable-wedding-card"
                className="bg-[#FCFAF7] border-2 border-amber-600/30 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-center text-stone-900 print:shadow-none print:border print:m-0 print:p-8"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(245, 238, 225, 0.7) 0%, rgba(252, 250, 247, 1) 70%)',
                }}
              >
                {/* Ornamental Gold Corner Accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/50 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/50 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/50 rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500/50 rounded-br-sm pointer-events-none" />

                {/* Wax Seal Crest */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden shadow-md border-2 border-amber-300 mb-4 bg-rose-900">
                  <img
                    src="/src/assets/images/vintage_wax_seal_crest_1794235743246.jpg"
                    alt="Official E&J Wax Seal Crest"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Subtitle */}
                <p className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-rose-900 uppercase font-semibold">
                  Together With Their Families
                </p>

                {/* Couple Names */}
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2 tracking-tight">
                  Elena Vance
                </h1>
                <div className="flex items-center justify-center gap-3 my-1">
                  <span className="h-px w-10 bg-amber-400" />
                  <span className="font-serif italic text-amber-700 text-lg">&</span>
                  <span className="h-px w-10 bg-amber-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                  Julian Hayes
                </h1>

                {/* Invitation text */}
                <p className="font-serif italic text-stone-700 text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">
                  Request the honour of your presence at the celebration of their holy marriage and lifelong union.
                </p>

                <OliveBranchFlourish className="mx-auto w-36 h-6 text-amber-700/60 my-4" />

                {/* Date & Schedule */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 my-4 space-y-1.5 max-w-md mx-auto">
                  <div className="font-serif font-bold text-stone-900 text-base sm:text-lg flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-800" />
                    <span>Saturday, September 18, 2027</span>
                  </div>
                  <div className="text-xs font-mono text-stone-700 flex items-center justify-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Ceremony at 4:30 PM CET</span>
                    {selectedTimezone !== 'CET' && (
                      <span className="text-rose-800 font-semibold">
                        ({localCeremonyTime} {selectedTimezone})
                      </span>
                    )}
                  </div>
                </div>

                {/* Venue Details */}
                <div className="space-y-1 max-w-md mx-auto text-xs text-stone-700">
                  <div className="flex items-center justify-center gap-1.5 font-semibold text-stone-900">
                    <MapPin className="w-3.5 h-3.5 text-rose-700" />
                    <span>Villa La Selva Estate</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Strada di Selva 14 · Castelnuovo Berardenga (Siena), Tuscany, Italy
                  </p>
                  <p className="text-[11px] font-mono text-rose-900 pt-1">
                    Attire: Black Tie Optional · Tuscan Garden Chic
                  </p>
                </div>

                {/* Official QR Code Pass */}
                <div className="mt-6 pt-5 border-t border-amber-200/80 flex flex-col items-center">
                  <div className="p-2.5 bg-white rounded-2xl border border-stone-200 shadow-sm inline-block">
                    {/* SVG High-Contrast QR Pattern */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-24 h-24 sm:w-28 sm:h-28 text-stone-900"
                      fill="currentColor"
                    >
                      {/* Outer frame markers */}
                      <rect x="0" y="0" width="28" height="28" fill="#1C1917" rx="3" />
                      <rect x="4" y="4" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="8" y="8" width="12" height="12" fill="#1C1917" rx="1" />

                      <rect x="72" y="0" width="28" height="28" fill="#1C1917" rx="3" />
                      <rect x="76" y="4" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="80" y="8" width="12" height="12" fill="#1C1917" rx="1" />

                      <rect x="0" y="72" width="28" height="28" fill="#1C1917" rx="3" />
                      <rect x="4" y="76" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="8" y="80" width="12" height="12" fill="#1C1917" rx="1" />

                      {/* Data dots simulating guest pass & URL */}
                      <rect x="34" y="6" width="6" height="6" />
                      <rect x="44" y="6" width="6" height="6" />
                      <rect x="56" y="6" width="6" height="6" />
                      <rect x="34" y="16" width="6" height="6" />
                      <rect x="48" y="16" width="6" height="6" />
                      <rect x="60" y="16" width="6" height="6" />

                      <rect x="6" y="34" width="6" height="6" />
                      <rect x="16" y="34" width="6" height="6" />
                      <rect x="34" y="34" width="6" height="6" />
                      <rect x="46" y="34" width="8" height="8" />
                      <rect x="60" y="34" width="6" height="6" />
                      <rect x="72" y="34" width="6" height="6" />
                      <rect x="86" y="34" width="6" height="6" />

                      <rect x="6" y="46" width="6" height="6" />
                      <rect x="18" y="46" width="6" height="6" />
                      <rect x="34" y="46" width="6" height="6" />
                      <rect x="74" y="46" width="6" height="6" />
                      <rect x="86" y="46" width="6" height="6" />

                      <rect x="6" y="58" width="6" height="6" />
                      <rect x="34" y="58" width="6" height="6" />
                      <rect x="46" y="58" width="6" height="6" />
                      <rect x="60" y="58" width="6" height="6" />
                      <rect x="74" y="58" width="6" height="6" />

                      <rect x="34" y="74" width="6" height="6" />
                      <rect x="46" y="74" width="6" height="6" />
                      <rect x="60" y="74" width="6" height="6" />
                      <rect x="74" y="74" width="6" height="6" />
                      <rect x="86" y="74" width="6" height="6" />

                      <rect x="34" y="86" width="6" height="6" />
                      <rect x="48" y="86" width="6" height="6" />
                      <rect x="62" y="86" width="6" height="6" />
                      <rect x="76" y="86" width="6" height="6" />
                    </svg>
                  </div>
                  <p className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mt-2">
                    Official Estate Gate QR Pass · Scan at Entrance
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs print:hidden">
                <span className="text-xs text-stone-600 font-medium">
                  Direct Guest Access Link: <code className="text-rose-900 font-mono">everafter.wedding/elena-julian</code>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://everafter.wedding/elena-julian?pass=VIP');
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-rose-800 text-white hover:bg-rose-900 flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Card</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: QR CODE SCANNER & GUEST CHECK-IN */
            <div className="max-w-xl mx-auto space-y-5">
              {/* Camera Scanner Viewfinder */}
              <div className="bg-stone-900 rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-xl border border-stone-800">
                <div className="relative w-64 h-64 mx-auto rounded-2xl border-2 border-dashed border-rose-500/70 bg-stone-950 flex flex-col items-center justify-center overflow-hidden">
                  {/* Scanning laser animation */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e] animate-bounce" />
                  )}

                  <Camera className="w-12 h-12 text-stone-500 mb-2" />
                  <p className="text-xs text-stone-300 font-mono">
                    {isScanning ? 'Decoding invitation pass...' : 'Align Wedding QR Pass in View'}
                  </p>
                  <span className="text-[10px] text-stone-500 font-mono mt-1">
                    Auto-focus 30 FPS · Estate Check-In
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-stone-300">
                    Live Optical Pass Reader Ready
                  </span>
                </div>
              </div>

              {/* Scanned Result Banner */}
              {scannedResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Guest Verified & Checked In!
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                      CONFIRMED VIP
                    </span>
                  </div>

                  <div className="flex items-start justify-between pt-1">
                    <div>
                      <h4 className="text-base font-serif font-bold text-stone-900">
                        {scannedResult.name}
                      </h4>
                      <p className="text-xs text-stone-600">
                        Dietary: {scannedResult.dietary} · {scannedResult.notes || 'Honored Guest'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Assigned Table</span>
                      <span className="text-sm font-bold font-serif text-rose-900">
                        Table {scannedResult.tableNumber || 1}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Quick Scan buttons for testing */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-800 font-bold">
                    Simulate Quick Scan With Registered Guests
                  </h4>
                  <span className="text-[11px] text-stone-500">Click to scan pass</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {guests.slice(0, 4).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleSimulateScan(g)}
                      className="p-2.5 rounded-xl border border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-900">{g.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono">
                          Pass: #{g.id.toUpperCase()} · Table {g.tableNumber || 1}
                        </p>
                      </div>
                      <Scan className="w-4 h-4 text-rose-700" />
                    </button>
                  ))}
                </div>

                {/* Manual Code input */}
                <form onSubmit={handleManualSearch} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter guest name or pass ID..."
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Check In
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between print:hidden">
          <p className="text-xs text-stone-500">
            Elena & Julian · Villa La Selva Estate, Tuscany
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
