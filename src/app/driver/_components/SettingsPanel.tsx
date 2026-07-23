'use client';

import { Settings } from '../_lib/types';

export default function SettingsPanel({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (settings: Settings) => void;
}) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 sm:p-5">
      <h3 className="text-sm font-medium text-slate-300 mb-3">Goals & settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Weekly goal</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              value={settings.weeklyGoal}
              onChange={(e) => onChange({ ...settings, weeklyGoal: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg bg-slate-900 border border-slate-600 pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Monthly goal</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
            <input
              type="number"
              value={settings.monthlyGoal}
              onChange={(e) => onChange({ ...settings, monthlyGoal: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg bg-slate-900 border border-slate-600 pl-6 pr-2 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">IRS mileage rate ($/mi)</span>
          <input
            type="number"
            step="0.01"
            value={settings.mileageRate}
            onChange={(e) => onChange({ ...settings, mileageRate: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Week starts on</span>
          <select
            value={settings.weekStartsOn}
            onChange={(e) => onChange({ ...settings, weekStartsOn: Number(e.target.value) as 0 | 1 })}
            className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
          </select>
        </label>
      </div>
    </div>
  );
}
