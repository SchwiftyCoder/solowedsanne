'use client';

import { useState } from 'react';
import { X, Play, Square } from 'lucide-react';
import { ActiveShift } from '../_lib/types';
import { formatHoursClock, parseHoursInput } from '../_lib/format';

export type ShiftPlatform = 'uber' | 'lyft' | 'both';

function Field({
  label,
  value,
  onChange,
  placeholder,
  text = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  text?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type={text ? 'text' : 'number'}
        inputMode={text ? undefined : 'decimal'}
        step={text ? undefined : '0.01'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg bg-slate-900 border border-slate-600 px-3 py-3 text-base text-white focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
      />
    </label>
  );
}

export function StartShiftModal({
  onStart,
  onClose,
}: {
  onStart: (startOdometer: number | null) => void;
  onClose: () => void;
}) {
  const [odometer, setOdometer] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-slate-800 border border-slate-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Start shift</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <Field label="Start odometer (optional)" value={odometer} onChange={setOdometer} placeholder="e.g. 84210" />
        <button
          onClick={() => onStart(odometer === '' ? null : parseFloat(odometer) || 0)}
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold py-3 hover:bg-emerald-400"
        >
          <Play size={18} /> Start shift now
        </button>
      </div>
    </div>
  );
}

export function EndShiftModal({
  active,
  onEnd,
  onDiscard,
  onClose,
}: {
  active: ActiveShift;
  onEnd: (data: { hours: number; miles: number | null; fuel: number; misc: number; platform: ShiftPlatform }) => void;
  onDiscard: () => void;
  onClose: () => void;
}) {
  const [platform, setPlatform] = useState<ShiftPlatform>('both');
  const [endOdometer, setEndOdometer] = useState('');
  const [fuel, setFuel] = useState('');
  const [misc, setMisc] = useState('');
  const [hours, setHours] = useState(() =>
    formatHoursClock((Date.now() - active.startedAt) / 3600000)
  );

  const startOdo = active.startOdometer;
  const endOdo = endOdometer === '' ? null : parseFloat(endOdometer) || 0;
  const miles = startOdo != null && endOdo != null && endOdo > startOdo ? endOdo - startOdo : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl bg-slate-800 border border-slate-700 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-white">End shift</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Started {new Date(active.startedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          {startOdo != null && ` · odometer ${startOdo.toLocaleString()}`}
        </p>

        <div className="space-y-3">
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">Which app were you driving?</span>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['uber', 'Uber', 'bg-cyan-500 text-cyan-950 border-cyan-500'],
                ['lyft', 'Lyft', 'bg-pink-500 text-pink-950 border-pink-500'],
                ['both', 'Both', 'bg-slate-200 text-slate-900 border-slate-200'],
              ] as const).map(([value, label, activeCls]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(value)}
                  className={`text-sm py-2 rounded-lg border font-medium transition-colors ${
                    platform === value ? activeCls : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {platform === 'both' && (
              <p className="text-[11px] text-slate-500 mt-1">Hours will be split evenly between Uber and Lyft.</p>
            )}
          </div>
          <Field
            label={startOdo != null ? 'End odometer' : 'End odometer (no start reading logged)'}
            value={endOdometer}
            onChange={setEndOdometer}
            placeholder={startOdo != null ? `> ${startOdo}` : 'e.g. 84390'}
          />
          {miles != null && <p className="text-xs text-sky-400">Shift miles: {miles.toLocaleString()} mi</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fuel cost ($)" value={fuel} onChange={setFuel} placeholder="0.00" />
            <Field label="Misc expenses ($)" value={misc} onChange={setMisc} placeholder="0.00" />
          </div>
          <Field label="Hours — HH:MM, auto from timer" value={hours} onChange={setHours} placeholder="e.g. 8:30" text />
        </div>

        <button
          onClick={() =>
            onEnd({
              hours: parseHoursInput(hours),
              miles,
              fuel: parseFloat(fuel) || 0,
              misc: parseFloat(misc) || 0,
              platform,
            })
          }
          className="mt-5 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 text-emerald-950 font-semibold py-3 hover:bg-emerald-400"
        >
          <Square size={16} /> End shift & save
        </button>
        <button onClick={onDiscard} className="mt-2 w-full text-xs text-red-400 hover:text-red-300 py-2">
          Discard shift without saving
        </button>
      </div>
    </div>
  );
}
