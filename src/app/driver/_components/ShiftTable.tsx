'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Shift } from '../_lib/types';
import { shiftGross, shiftMiles, shiftVariableExpenseTotal } from '../_lib/calculations';
import { formatCurrency, formatMiles, formatHours } from '../_lib/format';
import { formatShortDate, formatWeekdayShort } from '../_lib/dates';

export default function ShiftTable({
  shifts,
  onEdit,
  onDelete,
}: {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
}) {
  if (shifts.length === 0) {
    return (
      <div className="rounded-xl bg-slate-800 border border-slate-700 p-8 text-center text-slate-500 text-sm">
        No days logged yet. Use Start shift or Log day to add your first entry.
      </div>
    );
  }

  const sorted = shifts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
      {/* Mobile: card list */}
      <div className="sm:hidden divide-y divide-slate-700">
        {sorted.map((s) => (
          <div key={s.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">
                {formatWeekdayShort(s.date)} {formatShortDate(s.date)}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(s)} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(s.id)} className="p-1.5 rounded-md hover:bg-slate-700 text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-slate-500">Uber</span>
              <span className="text-right text-cyan-300">{formatCurrency(s.uber.fare + s.uber.tips + s.uber.bonus)}</span>
              <span className="text-slate-500">Lyft</span>
              <span className="text-right text-pink-300">{formatCurrency(s.lyft.fare + s.lyft.tips + s.lyft.bonus)}</span>
              <span className="text-slate-500">Gross</span>
              <span className="text-right text-white font-medium">{formatCurrency(shiftGross(s))}</span>
              <span className="text-slate-500">Expenses</span>
              <span className="text-right text-slate-300">{formatCurrency(shiftVariableExpenseTotal(s))}</span>
              <span className="text-slate-500">Miles</span>
              <span className="text-right text-slate-300">{formatMiles(shiftMiles(s))}</span>
              <span className="text-slate-500">Hours</span>
              <span className="text-right text-slate-300">{formatHours(s.hours)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-700">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Uber</th>
            <th className="px-4 py-3 font-medium">Lyft</th>
            <th className="px-4 py-3 font-medium">Gross</th>
            <th className="px-4 py-3 font-medium">Expenses</th>
            <th className="px-4 py-3 font-medium">Miles</th>
            <th className="px-4 py-3 font-medium">Hours</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sorted.map((s) => (
            <tr key={s.id} className="hover:bg-slate-700/30">
              <td className="px-4 py-3 text-slate-200 whitespace-nowrap">
                {formatWeekdayShort(s.date)} {formatShortDate(s.date)}
              </td>
              <td className="px-4 py-3 text-cyan-300">{formatCurrency(s.uber.fare + s.uber.tips + s.uber.bonus)}</td>
              <td className="px-4 py-3 text-pink-300">{formatCurrency(s.lyft.fare + s.lyft.tips + s.lyft.bonus)}</td>
              <td className="px-4 py-3 text-white font-medium">{formatCurrency(shiftGross(s))}</td>
              <td className="px-4 py-3 text-slate-300">{formatCurrency(shiftVariableExpenseTotal(s))}</td>
              <td className="px-4 py-3 text-slate-300">{formatMiles(shiftMiles(s))}</td>
              <td className="px-4 py-3 text-slate-300">{formatHours(s.hours)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onEdit(s)} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(s.id)} className="p-1.5 rounded-md hover:bg-slate-700 text-red-400">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
