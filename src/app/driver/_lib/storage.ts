import { ActiveShift, DEFAULT_SETTINGS, FixedExpense, Settings, Shift } from './types';

const SHIFTS_KEY = 'driver-earnings:shifts';
const FIXED_EXPENSES_KEY = 'driver-earnings:fixedExpenses';
const SETTINGS_KEY = 'driver-earnings:settings';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadShifts(): Shift[] {
  return read<Shift[]>(SHIFTS_KEY, []);
}

export function saveShifts(shifts: Shift[]) {
  write(SHIFTS_KEY, shifts);
}

const DEFAULT_FIXED_EXPENSES: FixedExpense[] = [
  { id: 'car-payment', name: 'Car Payment', amount: 0, cadence: 'weekly' },
  { id: 'fuel', name: 'Fuel', amount: 0, cadence: 'weekly' },
  { id: 'insurance', name: 'Insurance (incl. rideshare endorsement)', amount: 270, cadence: 'monthly' },
  { id: 'car-wash', name: 'Car Washes', amount: 25, cadence: 'monthly' },
  { id: 'phone', name: 'Phone Bill', amount: 0, cadence: 'monthly' },
];

export function loadFixedExpenses(): FixedExpense[] {
  const stored = read<(FixedExpense & { weeklyAmount?: number })[]>(FIXED_EXPENSES_KEY, DEFAULT_FIXED_EXPENSES);
  // migrate entries saved before cadence support
  return stored.map((e) => ({
    id: e.id,
    name: e.name,
    amount: e.amount ?? e.weeklyAmount ?? 0,
    cadence: e.cadence ?? 'weekly',
  }));
}

export function saveFixedExpenses(expenses: FixedExpense[]) {
  write(FIXED_EXPENSES_KEY, expenses);
}

const ACTIVE_SHIFT_KEY = 'driver-earnings:activeShift';

export function loadActiveShift(): ActiveShift | null {
  return read<ActiveShift | null>(ACTIVE_SHIFT_KEY, null);
}

export function saveActiveShift(active: ActiveShift | null) {
  if (typeof window === 'undefined') return;
  if (active == null) {
    window.localStorage.removeItem(ACTIVE_SHIFT_KEY);
  } else {
    write(ACTIVE_SHIFT_KEY, active);
  }
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings);
}
