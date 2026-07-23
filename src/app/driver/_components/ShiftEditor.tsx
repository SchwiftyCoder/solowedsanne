'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Shift } from '../_lib/types';
import { formatHoursClock, parseHoursInput } from '../_lib/format';

function NumberField({
  label,
  value,
  onChange,
  step = '0.01',
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
      />
    </label>
  );
}

export default function ShiftEditor({
  shift,
  onSave,
  onDelete,
  onClose,
}: {
  shift: Shift;
  onSave: (shift: Shift) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Shift>(structuredClone(shift));
  const [hoursText, setHoursText] = useState(shift.hours > 0 ? formatHoursClock(shift.hours) : '');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-800 border border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Day entry — {draft.date}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <label className="flex flex-col gap-1 mb-4">
          <span className="text-xs text-slate-500">Date</span>
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className="rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Uber</p>
            <NumberField label="Earnings" value={draft.uber.fare} onChange={(n) => setDraft({ ...draft, uber: { ...draft.uber, fare: n } })} />
            <NumberField label="Tips" value={draft.uber.tips} onChange={(n) => setDraft({ ...draft, uber: { ...draft.uber, tips: n } })} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide">Lyft</p>
            <NumberField label="Earnings" value={draft.lyft.fare} onChange={(n) => setDraft({ ...draft, lyft: { ...draft.lyft, fare: n } })} />
            <NumberField label="Tips" value={draft.lyft.tips} onChange={(n) => setDraft({ ...draft, lyft: { ...draft.lyft, tips: n } })} />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">Hours worked (HH:MM)</span>
            <input
              type="text"
              value={hoursText}
              onChange={(e) => {
                setHoursText(e.target.value);
                setDraft({ ...draft, hours: parseHoursInput(e.target.value) });
              }}
              placeholder="e.g. 8:30"
              className="rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
            />
          </label>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Variable expenses</p>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Gas" value={draft.expenses.gas} onChange={(n) => setDraft({ ...draft, expenses: { ...draft.expenses, gas: n } })} />
            <NumberField label="Meals" value={draft.expenses.meals} onChange={(n) => setDraft({ ...draft, expenses: { ...draft.expenses, meals: n } })} />
            <NumberField label="Other" value={draft.expenses.other} onChange={(n) => setDraft({ ...draft, expenses: { ...draft.expenses, other: n } })} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => onDelete(draft.id)}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10"
          >
            <Trash2 size={16} /> Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </button>
            <button
              onClick={() => onSave(draft)}
              className="text-sm px-4 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-medium hover:bg-emerald-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
