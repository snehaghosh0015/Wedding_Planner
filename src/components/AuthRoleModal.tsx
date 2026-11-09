import React, { useState } from 'react';
import { X, Check, Shield, User, Mail, Sparkles } from 'lucide-react';
import { UserRole } from '../types/wedding';

interface AuthRoleModalProps {
  currentRole: UserRole;
  currentUserName: string;
  onSelectRole: (role: UserRole, name: string, email: string) => void;
  onClose: () => void;
}

export const AuthRoleModal: React.FC<AuthRoleModalProps> = ({
  currentRole,
  currentUserName,
  onSelectRole,
  onClose,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'apple' | 'email'>('google');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('Guest');

  const presetProfiles = [
    {
      role: 'Couple' as UserRole,
      name: 'Elena & Julian',
      email: 'elena.julian@wedding.com',
      avatarColor: 'bg-rose-600',
      description: 'Admin Access — Full control over budget, guest approvals, timeline & settings.',
    },
    {
      role: 'Guest' as UserRole,
      name: 'Sofia Rossi',
      email: 'sofia.rossi@example.com',
      avatarColor: 'bg-amber-600',
      description: 'Contributor Access — Submit RSVP, upload live album photos & post 24h stories.',
    },
    {
      role: 'Guest' as UserRole,
      name: 'David Chen',
      email: 'david.chen@example.com',
      avatarColor: 'bg-stone-700',
      description: 'Viewer Access — View event logistics, map directions & chat with AI concierge.',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    onSelectRole(customRole, customName.trim(), customEmail.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-700 font-semibold">
              Authentication & RBAC
            </span>
            <h3 className="text-lg font-serif text-stone-900 mt-0.5">
              Select or Switch Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Provider Selector (Google, Apple, Email) */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Simulated Secure Authentication Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'google', name: 'Google' },
              { id: 'apple', name: 'Apple ID' },
              { id: 'email', name: 'Email Link' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  selectedProvider === p.id
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">
            Quick Switch Active Persona:
          </label>

          <div className="space-y-2">
            {presetProfiles.map((profile, i) => {
              const isSelected =
                currentRole === profile.role && currentUserName === profile.name;

              return (
                <div
                  key={i}
                  onClick={() => {
                    onSelectRole(profile.role, profile.name, profile.email);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/60 ring-1 ring-rose-600/30'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${profile.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}
                  >
                    {profile.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {profile.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          profile.role === 'Couple'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {profile.role} Role
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      {profile.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Login Form */}
        <div className="pt-2 border-t border-stone-100">
          <details className="text-xs text-stone-600 group">
            <summary className="font-semibold cursor-pointer text-stone-700 hover:text-stone-900">
              Or sign in with custom credentials...
            </summary>
            <form onSubmit={handleCustomSubmit} className="mt-3 space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomRole('Guest')}
                  className={`flex-1 py-1.5 text-xs rounded-xl border ${
                    customRole === 'Guest'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  Guest
                </button>
                <button
                  type="button"
                  onClick={() => setCustomRole('Couple')}
                  className={`flex-1 py-1.5 text-xs rounded-xl border ${
                    customRole === 'Couple'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  Couple (Admin)
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl text-xs"
              >
                Sign In
              </button>
            </form>
          </details>
        </div>
      </div>
    </div>
  );
};
