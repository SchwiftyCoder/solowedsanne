'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

export default function DriverLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/driver/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.replace('/driver');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Wrong password.');
      setLoading(false);
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full bg-slate-800 border border-slate-700 p-3 mb-3">
            <Lock size={22} className="text-emerald-400" />
          </div>
          <h1 className="text-lg font-bold text-white">Driver Earnings</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-base text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold py-3 hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
