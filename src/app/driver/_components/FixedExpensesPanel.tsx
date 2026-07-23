'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExpenseCadence, FixedExpense } from '../_lib/types';
import { formatCurrency } from '../_lib/format';
import { fixedExpensesWeeklyTotal } from '../_lib/calculations';
import InfoTip from './InfoTip';

export default function FixedExpensesPanel({
  expenses,
  onChange,
}: {
  expenses: FixedExpense[];
  onChange: (expenses: FixedExpense[]) => void;
}) {
  const [newName, setNewName] = useState('');

  function update(id: string, patch: Partial<FixedExpense>) {
    onChange(expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(expenses.filter((e) => e.id !== id));
  }

  function add() {
    const name = newName.trim();
    if (!name) return;
    onChange([...expenses, { id: `fe_${Date.now()}`, name, amount: 0, cadence: 'weekly' }]);
    setNewName('');
  }

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
          Recurring overhead
          <InfoTip text="Costs you pay whether or not you drive — insurance, car payment, phone, weekly fuel budget. Monthly amounts are converted to weekly (×12 ÷ 52), then spread across all 7 days and subtracted from your net income." />
        </h3>
        <span className="text-sm text-slate-400">≈ {formatCurrency(fixedExpensesWeeklyTotal(expenses))}/wk</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Weekly or monthly costs, prorated into each day&apos;s net income.
      </p>

      <div className="space-y-2">
        {expenses.map((e) => (
          <div key={e.id} className="flex items-center gap-2">
            <input
              value={e.name}
              onChange={(ev) => update(e.id, { name: ev.target.value })}
              className="flex-1 min-w-0 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
            <div className="relative w-24 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={e.amount}
                onChange={(ev) => update(e.id, { amount: parseFloat(ev.target.value) || 0 })}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={e.cadence}
              onChange={(ev) => update(e.id, { cadence: ev.target.value as ExpenseCadence })}
              className="w-20 shrink-0 rounded-lg bg-slate-900 border border-slate-600 px-2 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="weekly">/wk</option>
              <option value="monthly">/mo</option>
            </select>
            <button onClick={() => remove(e.id)} className="p-2 rounded-md hover:bg-slate-700 text-red-400 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add cost (e.g. Fuel, Car Payment)"
          className="flex-1 min-w-0 rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
        />
        <button onClick={add} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 shrink-0">
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
