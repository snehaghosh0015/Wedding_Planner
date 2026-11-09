import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Calendar, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Server, 
  Smartphone,
  GitBranch
} from 'lucide-react';

export const ArchitecturalSpecViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'database' | 'rbac' | 'milestones'>('stack');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchemaCode = `-- PostgreSQL / Drizzle ORM Relational Schema for EverAfter

CREATE TYPE user_role AS ENUM ('couple_admin', 'guest_contributor');
CREATE TYPE rsvp_status AS ENUM ('invited', 'confirmed', 'pending', 'declined');
CREATE TYPE expense_category AS ENUM (
  'venue', 'catering', 'outfits', 'photography', 
  'flowers_decor', 'entertainment', 'stationery', 'favors'
);

-- 1. Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role user_role DEFAULT 'guest_contributor',
  auth_provider VARCHAR(32) NOT NULL, -- 'google', 'apple', 'email'
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wedding Event Master Record
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_title VARCHAR(120) NOT NULL, -- 'Elena Vance & Julian Hayes'
  event_date TIMESTAMPTZ NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  venue_address TEXT NOT NULL,
  venue_lat NUMERIC(9, 6),
  venue_lng NUMERIC(9, 6),
  total_budget NUMERIC(12, 2) NOT NULL DEFAULT 75000.00,
  dress_code VARCHAR(120),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Guest Management & RSVP
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  status rsvp_status DEFAULT 'pending',
  table_number INT,
  dietary_requirements VARCHAR(64) DEFAULT 'None',
  has_plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name VARCHAR(120),
  plus_one_dietary VARCHAR(64),
  attending_ceremony BOOLEAN DEFAULT FALSE,
  attending_reception BOOLEAN DEFAULT FALSE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_guests_wedding_status ON guests(wedding_id, status);

-- 4. Budget Tracking & Vendor Dues
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category expense_category NOT NULL,
  vendor_name VARCHAR(180) NOT NULL,
  estimated_cost NUMERIC(10, 2) NOT NULL,
  actual_cost NUMERIC(10, 2) NOT NULL,
  paid_amount NUMERIC(10, 2) DEFAULT 0.00,
  due_date DATE NOT NULL,
  is_paid BOOLEAN GENERATED ALWAYS AS (paid_amount >= actual_cost) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_expenses_wedding_due ON expenses(wedding_id, due_date, is_paid);

-- 5. Our Sweet Story Milestones
CREATE TABLE story_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  milestone_date DATE NOT NULL,
  location VARCHAR(180),
  description TEXT NOT NULL,
  quote TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  sort_order INT DEFAULT 0
);

-- 6. Shared Live Wedding Album
CREATE TABLE album_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
  uploader_name VARCHAR(120) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 24-Hour Ephemeral Stories (Automatic TTL Expiry)
CREATE TABLE ephemeral_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL,
  media_url TEXT NOT NULL,
  text_caption VARCHAR(280),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);
CREATE INDEX idx_stories_active ON ephemeral_stories(wedding_id, expires_at);`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Engineering Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            System Architecture & Technical Spec
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Full-stack specifications, database schemas, tech stack trade-offs, RBAC matrices, and MVP milestones.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl overflow-x-auto scrollbar-none self-start sm:self-auto">
          {[
            { id: 'stack', label: 'Tech Stack Matrix', icon: Layers },
            { id: 'database', label: 'Database Schemas', icon: Database },
            { id: 'rbac', label: 'Security & RBAC', icon: ShieldCheck },
            { id: 'milestones', label: 'MVP Milestones', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Tech Stack Comparison & Architecture */}
      {activeTab === 'stack' && (
        <div className="space-y-6">
          {/* Architecture Diagram Overview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-rose-600" />
              EverAfter End-to-End System Architecture
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              EverAfter is engineered as a mobile-first, high-performance wedding platform designed to handle intermittent mobile network connectivity at picturesque remote venues, real-time guest media uploads, and sub-second AI concierge queries.
            </p>

            {/* Architecture Flow Box */}
            <div className="bg-stone-900 text-stone-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto space-y-3 leading-relaxed border border-stone-800">
              <div className="text-rose-400 font-bold">// HIGH-LEVEL COMPONENT TOPOLOGY</div>
              <div>
                [ CLIENT TIER ]<br />
                ├─ Mobile-First Web SPA (React 19 + Tailwind CSS + Motion)<br />
                └─ Cross-Platform Native App (React Native / Expo iOS & Android)
              </div>
              <div>
                [ EDGE / API GATEWAY ]<br />
                ├─ Authentication: OAuth 2.0 (Google, Apple Sign-In, Email Magic Links)<br />
                ├─ Express / Cloud Run API Gateway with Rate-Limiting & JWT Validation<br />
                └─ CDN & Image Optimization (WebP / AVIF transformation at edge)
              </div>
              <div>
                [ REAL-TIME & DATA TIER ]<br />
                ├─ Relational Core: PostgreSQL (Supabase / Cloud SQL) with Drizzle ORM<br />
                ├─ Real-Time Stream: WebSocket / SSE subscriptions for Live Album & 24h Stories<br />
                └─ Ephemeral Cleaner: Cron job / Cloud Tasks (hourly TTL deletion for 24h stories)
              </div>
              <div>
                [ AI & EXTERNAL SERVICES ]<br />
                ├─ AI Assistant: Server-Side @google/genai SDK (Gemini 3.8 Flash)<br />
                ├─ Geo & Mapping: Google Maps JavaScript API + Directions API<br />
                └─ Push Notifications: Firebase Cloud Messaging (FCM) & Apple APNs
              </div>
            </div>
          </div>

          {/* Deep-Dive Tech Stack Trade-Off Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Frontend Comparison */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-serif text-stone-900">
                  Mobile Framework: React Native (Expo) vs. Flutter
                </h4>
              </div>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    RECOMMENDED: React Native + Expo
                  </span>
                  <p>
                    <strong>Why:</strong> 90%+ code and TypeScript business logic reuse (budget math, RSVP schemas, validation) between the Web PWA and native iOS/Android builds. Expo EAS enables rapid Over-The-Air (OTA) updates during the wedding week without App Store approval delays.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <span className="font-bold text-stone-800 block">
                    Alternative: Flutter (Dart)
                  </span>
                  <p>
                    <strong>Pros:</strong> High-performance Skia/Impeller rendering engine, 60fps animations out of the box.<br />
                    <strong>Cons:</strong> Inability to share TypeScript types/logic with the web app; double code-maintenance burden for a startup team.
                  </p>
                </div>
              </div>
            </div>

            {/* Backend & DB Comparison */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-serif text-stone-900">
                  Backend: Supabase vs. Firebase vs. Custom Node.js
                </h4>
              </div>

              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    RECOMMENDED: Supabase (PostgreSQL + Realtime + Auth)
                  </span>
                  <p>
                    <strong>Why:</strong> Relational integrity is essential for wedding budgets, guest plus-ones, and vendor dues calculations (joins, foreign keys, aggregations). Supabase provides built-in Row Level Security (RLS), real-time changefeed subscriptions, and generous storage for photos.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <span className="font-bold text-stone-800 block">
                    Alternative: Firebase Firestore
                  </span>
                  <p>
                    <strong>Pros:</strong> Instant offline caching, zero configuration.<br />
                    <strong>Cons:</strong> NoSQL document joins make multi-category budget calculations and complex guest queries difficult and expensive at scale.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schemas */}
      {activeTab === 'database' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-rose-600" />
                  Production PostgreSQL Database Schema (Drizzle ORM)
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Normalized 7-table relational schema with strict foreign keys, enums, and optimized indices.
                </p>
              </div>

              <button
                onClick={() => handleCopy('sql', sqlSchemaCode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
              >
                {copiedSection === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-stone-950 text-stone-200 rounded-2xl font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed border border-stone-800 scrollbar-thin">
              {sqlSchemaCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Security & RBAC */}
      {activeTab === 'rbac' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              Role-Based Access Control (RBAC) & Permission Matrix
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              EverAfter enforces strict separation between the administrative "Couple" role and attendee "Guest" role.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-700 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Feature Domain</th>
                    <th className="p-3">Couple (Admin)</th>
                    <th className="p-3">Guest (Contributor)</th>
                    <th className="p-3">Security Enforcement Layer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Total Budget & Expenses</td>
                    <td className="p-3 text-emerald-700 font-medium">Read / Write / Delete / Adjust</td>
                    <td className="p-3 text-rose-700 font-medium">No Access (Hidden)</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">Database RLS: (auth.uid = wedding.couple_id)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Guest List & RSVPs</td>
                    <td className="p-3 text-emerald-700 font-medium">Full Directory & Table Seating</td>
                    <td className="p-3 text-amber-700 font-medium">Own RSVP & Plus-One only</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">RLS: (auth.email = guest.email)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Live Wedding Album</td>
                    <td className="p-3 text-emerald-700 font-medium">Upload, Tag, Moderate, Delete Any</td>
                    <td className="p-3 text-emerald-700 font-medium">Upload, Like, Delete Own Photos</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">Storage Policies: Max 25MB per image</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">24h Disappearing Stories</td>
                    <td className="p-3 text-emerald-700 font-medium">Post Official Couple Announcements</td>
                    <td className="p-3 text-emerald-700 font-medium">Post Guest Moments (Wedding Week)</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">Cron worker expires records at 24h</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">AI Wedding Assistant</td>
                    <td className="p-3 text-emerald-700 font-medium">Budget pull, Vendor dues, Brainstorming</td>
                    <td className="p-3 text-emerald-700 font-medium">Logistics, FAQ, Dress code, Directions</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">Server Proxy: Context filter by JWT role</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Honeymoon Matchmaker</td>
                    <td className="p-3 text-emerald-700 font-medium">Budget sync & itinerary planning</td>
                    <td className="p-3 text-stone-400 font-medium">Optional view (Read-only)</td>
                    <td className="p-3 text-stone-500 font-mono text-[11px]">Client UI route gate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Step-by-Step MVP Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-600" />
                Step-by-Step Implementation Roadmap for EverAfter MVP
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                A 10-week agile delivery plan structured into five high-impact engineering milestones.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 1 (Weeks 1-2)',
                  title: 'Core Infrastructure, Auth & Role Foundations',
                  badge: 'Complete in Demo',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                  items: [
                    'Database provisioning (PostgreSQL schema with migrations via Drizzle)',
                    'Multi-provider Auth integration (Google OAuth, Apple Sign-In, Passwordless Magic Link)',
                    'JWT claims with role tagging (Couple Admin vs Guest Contributor)',
                    'Design System: Typography scale, high-touch mobile navigation & responsive layout',
                  ],
                },
                {
                  phase: 'Phase 2 (Weeks 3-4)',
                  title: 'Logistics, Dynamic RSVP & Google Maps Integration',
                  badge: 'Complete in Demo',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                  items: [
                    'Google Maps Platform integration with interactive venue pin and turn-by-turn routing',
                    'Guest directory with instant multi-criteria filter (Invited, Confirmed, Pending, Declined)',
                    'Two-way RSVP form supporting plus-one guest capture and dietary requirements',
                    'Table seating assignment view and automated attendance counters',
                  ],
                },
                {
                  phase: 'Phase 3 (Weeks 5-6)',
                  title: 'Financial Management & Vendor Dues Tracker',
                  badge: 'Complete in Demo',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                  items: [
                    'Interactive total budget modifier with immediate category allocation recalculations',
                    'Upcoming vendor installments timeline with overdue and due soon alerts',
                    'Itemized expense management with paid amount toggles',
                    'Real-time remaining fund metric synced with Honeymoon module',
                  ],
                },
                {
                  phase: 'Phase 4 (Weeks 7-8)',
                  title: 'Multimedia Hub, Live Album & 24h Ephemeral Stories',
                  badge: 'Complete in Demo',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                  items: [
                    'Cloud Storage bucket with image compression & CDN distribution',
                    '24-Hour Disappearing Stories feature with interactive viewer, progress bars & reactions',
                    'Live Wedding Album photo grid with tag filters, photo uploads, and like tallies',
                    'Chronological "Our Sweet Story" milestone timeline with couple quotes',
                  ],
                },
                {
                  phase: 'Phase 5 (Weeks 9-10)',
                  title: 'Gemini AI Assistant, Honeymoon Matchmaker & MVP Launch',
                  badge: 'Complete in Demo',
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                  items: [
                    'Server-side Express endpoint with @google/genai SDK (Gemini 3.8 Flash)',
                    'Dynamic context injection (live RSVP counts, remaining budget, venue instructions)',
                    'Honeymoon Matchmaker algorithm matching travel vibes & remaining funds',
                    'End-to-end regression testing, unit tests, and production deployment',
                  ],
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/50 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-rose-800">
                      {m.phase} — {m.title}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <ul className="text-xs text-stone-600 space-y-1 pl-4 list-disc">
                    {m.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
