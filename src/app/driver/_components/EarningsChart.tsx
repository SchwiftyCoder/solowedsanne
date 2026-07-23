'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatShortDate } from '../_lib/dates';
import { shiftPlatformGross } from '../_lib/calculations';
import { Shift } from '../_lib/types';
import { formatCurrency } from '../_lib/format';

export default function EarningsChart({ shifts }: { shifts: Shift[] }) {
  const data = shifts
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(-14)
    .map((s) => ({
      date: formatShortDate(s.date),
      Uber: Math.round(shiftPlatformGross(s, 'uber') * 100) / 100,
      Lyft: Math.round(shiftPlatformGross(s, 'lyft') * 100) / 100,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 sm:p-5 h-72 flex items-center justify-center text-slate-500 text-sm">
        Log a day to see Uber vs Lyft earnings.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 sm:p-5">
      <h3 className="text-sm font-medium text-slate-300 mb-3">Uber vs Lyft (last 14 days)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e5e5e5' }}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Uber" fill="#1FBAD6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Lyft" fill="#FF00BF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
