export type Platform = 'uber' | 'lyft';

export type PlatformTotals = {
  fare: number;
  tips: number;
  bonus: number;
  distanceMiles: number;
  trips: number;
  hours: number;
};

export function emptyPlatformTotals(): PlatformTotals {
  return { fare: 0, tips: 0, bonus: 0, distanceMiles: 0, trips: 0, hours: 0 };
}

export type VariableExpenses = {
  gas: number;
  carWash: number;
  meals: number;
  other: number;
};

export function emptyVariableExpenses(): VariableExpenses {
  return { gas: 0, carWash: 0, meals: 0, other: 0 };
}

export type Shift = {
  id: string;
  date: string; // YYYY-MM-DD
  uber: PlatformTotals;
  lyft: PlatformTotals;
  odometerMiles: number | null;
  hours: number;
  expenses: VariableExpenses;
  notes?: string;
};

export type ExpenseCadence = 'weekly' | 'monthly';

export type FixedExpense = {
  id: string;
  name: string;
  amount: number;
  cadence: ExpenseCadence;
};

export type Settings = {
  weeklyGoal: number;
  monthlyGoal: number;
  mileageRate: number; // dollars per mile
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
};

export type ActiveShift = {
  startedAt: number; // epoch ms
  startOdometer: number | null;
};

export const DEFAULT_SETTINGS: Settings = {
  weeklyGoal: 1000,
  monthlyGoal: 4000,
  mileageRate: 0.67,
  weekStartsOn: 1,
};
