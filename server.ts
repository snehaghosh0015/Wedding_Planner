import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Wedding Assistant
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, role = 'Guest', weddingContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const contextPrompt = `
You are "EverAfter Concierge", an elegant, helpful, and charming AI Wedding Assistant for Elena & Julian's wedding celebration.
Current user role talking to you: ${role} (${role === 'Couple' ? 'Bride/Groom with full administrative access' : 'Attending Guest'}).

Current Wedding Live Context:
- Couple: Elena Vance & Julian Hayes
- Date: Saturday, September 18, 2027 at 4:30 PM CET
- Venue: Villa La Selva Estate, Tuscany, Italy (Strada di Selva 14, 53019 Castelnuovo Berardenga)
- Dress Code: Black Tie Optional / Tuscan Garden Chic (Ladies: Floor-length gowns or refined cocktail dresses; Gentlemen: Tuxedo or dark suit & tie. Block heels recommended for the garden gravel).
- Parking & Shuttles: Complimentary valet at the North Gate. Private shuttles depart Florence Grand Hotel at 3:15 PM and 3:45 PM. Return shuttles run every 45 min from 11:00 PM to 2:30 AM.
- Children Policy: Adults-only ceremony and reception (infants in arms welcome).
- Live RSVP Stats: ${weddingContext?.rsvpStats ? JSON.stringify(weddingContext.rsvpStats) : '142 Invited, 98 Confirmed, 28 Pending, 16 Declined'}
- Live Budget Stats: ${weddingContext?.budgetStats ? JSON.stringify(weddingContext.budgetStats) : 'Total Budget $75,000 | Spent $52,400 | Remaining $22,600'}
- Upcoming Vendor Due: Catering final installment ($6,800 due Aug 15).

Guidelines:
1. Tone: Warm, refined, conversational, and deeply helpful.
2. If the user asks about live data (e.g. RSVP counts, confirmed guests, remaining budget, vendor dues), pull from the Live Stats above with exact numbers.
3. If a Guest asks about logistics (parking, dress code, schedule, registry, shuttle, plus-ones), provide crisp, comforting answers.
4. If the Couple asks for brainstorming (registry gifts, signature cocktails, vows, seating tips, itinerary), provide tasteful, structured bullet suggestions.
5. Keep responses concise (under 160 words unless asked for a comprehensive list).
`;

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const isKeyConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10);

    if (!isKeyConfigured) {
      return res.json({
        reply: getFallbackAnswer(message, role, weddingContext),
        source: 'EverAfter Wedding Concierge',
      });
    }

    // Call Gemini with an 8-second timeout race
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: contextPrompt,
      },
    });

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 8000);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const reply = (response as any)?.text || getFallbackAnswer(message, role, weddingContext);
    return res.json({ reply, source: response ? 'gemini-3.8-flash' : 'EverAfter Wedding Concierge' });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error?.message || error);
    const { message, role, weddingContext } = req.body;
    return res.json({
      reply: getFallbackAnswer(message || '', role || 'Guest', weddingContext),
      source: 'fallback-rules',
    });
  }
});

function getFallbackAnswer(query: string, role: string, context: any): string {
  const q = query.toLowerCase();
  if (q.includes('dress code') || q.includes('wear')) {
    return 'The dress code is **Black Tie Optional / Tuscan Garden Chic**. Elegant floor-length dresses or sophisticated cocktail gowns for ladies, and tuxedos or dark formal suits for gentlemen. Block heels or wedges are recommended for the outdoor lawn and stone terraces!';
  }
  if (q.includes('park') || q.includes('shuttle') || q.includes('drive')) {
    return 'Complimentary valet parking is located at the Villa North Gate. For guests staying in Florence, private shuttles depart the Florence Grand Hotel lobby at 3:15 PM & 3:45 PM. Return shuttles run continuously from 11:00 PM until 2:30 AM.';
  }
  if (q.includes('confirm') || q.includes('how many guest') || q.includes('rsvp')) {
    const conf = context?.rsvpStats?.confirmed ?? 98;
    const pending = context?.rsvpStats?.pending ?? 28;
    const total = context?.rsvpStats?.invited ?? 142;
    return `Currently, **${conf} guests** have confirmed attendance out of ${total} invited (${pending} pending responses). Catering numbers are on track!`;
  }
  if (q.includes('budget') || q.includes('remaining') || q.includes('spend')) {
    const rem = context?.budgetStats?.remaining ?? 22600;
    return `You have **$${rem.toLocaleString()} remaining** in your wedding fund out of your $75,000 total budget. Your largest upcoming payment is the Villa Catering milestone ($6,800 due Aug 15).`;
  }
  if (q.includes('registry') || q.includes('gift')) {
    return 'Elena & Julian are registered for their dream Italian honeymoon fund, as well as artisanal tabletop collections at Heath Ceramics and Le Creuset. You can find direct links in the Registry tab!';
  }
  if (q.includes('time') || q.includes('when') || q.includes('schedule')) {
    return 'The ceremony commences promptly at 4:30 PM on Saturday, September 18, 2027. Welcome drinks and acoustic strings begin at 3:45 PM in the lower rose garden.';
  }
  return role === 'Couple'
    ? "I'm ready to help you plan! Ask me about your real-time RSVPs, remaining budget allocations, vendor deadlines, or creative ideas like signature cocktail pairings and seating strategies."
    : "I'm delighted to assist you with Elena & Julian's wedding celebration! Ask me anything regarding dress code, venue location, shuttle departures, or day-of timeline.";
}

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EverAfter Wedding App server running on http://localhost:${PORT}`);
  });
}

startServer();
