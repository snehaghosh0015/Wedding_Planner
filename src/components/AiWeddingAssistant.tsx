import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Calendar, 
  RefreshCw, 
  DollarSign, 
  Users,
  Lightbulb
} from 'lucide-react';
import { UserRole } from '../types/wedding';

interface AiWeddingAssistantProps {
  userRole: UserRole;
  weddingContext: {
    rsvpStats: any;
    budgetStats: any;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const AiWeddingAssistant: React.FC<AiWeddingAssistantProps> = ({
  userRole,
  weddingContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: userRole === 'Couple'
        ? `Hello Elena & Julian! I am your EverAfter Concierge. I have full real-time access to your wedding data (RSVP numbers, remaining budget, vendor payment deadlines). Ask me to pull live stats or brainstorm ideas for registry, vows, or seating arrangements!`
        : `Welcome to Elena & Julian's wedding celebration! I am the EverAfter Concierge. Ask me anything about the dress code, parking and shuttle times, ceremony schedule, or Italian travel recommendations.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const couplePrompts = [
    'How many guests have confirmed so far?',
    'What is our remaining wedding budget?',
    'Suggest 5 creative wedding registry ideas',
    'Recommend signature cocktail recipes for Tuscany',
    'When is our next vendor payment due?',
  ];

  const guestPrompts = [
    'What is the dress code?',
    'Where do I park & is there a shuttle?',
    'What time does the ceremony begin?',
    'Are children allowed at the wedding?',
    'Where are Elena & Julian registered?',
  ];

  const activePrompts = userRole === 'Couple' ? couplePrompts : guestPrompts;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: userRole,
          weddingContext,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'm here to assist you with all wedding details! Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: "I am having trouble reaching the concierge server right now. In short: The ceremony starts at 4:30 PM on Sept 18 at Villa La Selva, and dress code is Black Tie Optional / Tuscan Garden Chic!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Intelligent Concierge
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            AI Wedding Assistant
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Powered by Gemini 3.8 Flash with live app data synchronization and wedding FAQ grounding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Persona: {userRole === 'Couple' ? 'Couple Admin Brainstorm' : 'Guest Logistics FAQ'}</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900">
                EverAfter Concierge
              </h3>
              <p className="text-[11px] text-stone-500 flex items-center gap-1">
                <span>Grounding:</span>
                <span className="text-emerald-700 font-medium">Elena & Julian Tuscan Celebration</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'reset',
                  sender: 'assistant',
                  text: userRole === 'Couple'
                    ? "Chat reset. How can I help you streamline planning today?"
                    : "Chat reset. What wedding questions can I answer for you?",
                  timestamp: 'Just now',
                },
              ]);
            }}
            title="Reset Chat"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : 'bg-white text-stone-800 border border-stone-200/90 shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-400 font-mono">
                <span>{msg.timestamp}</span>
                {msg.source && (
                  <span>· {msg.source}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-2xl border border-stone-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-spin" />
              <span>Consulting wedding schedule & live registries...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[11px] text-stone-400 font-mono shrink-0 mr-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" /> Quick:
          </span>
          {activePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-xs bg-white hover:bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              userRole === 'Couple'
                ? "Ask about guests, budget balance, registry ideas..."
                : "Ask about dress code, venue location, parking..."
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-stone-50/50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
