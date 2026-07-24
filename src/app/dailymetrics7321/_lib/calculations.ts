import { addDays, daysBetweenInclusive, endOfMonth, endOfWeek, isDateInRange, startOfDay, startOfMonth, startOfWeek } from './dates';
import { FixedExpense, Settings, Shift } from './types';

export function shiftGross(shift: Shift): number {
  return (
    shift.uber.fare + shift.uber.tips + shift.uber.bonus +
    shift.lyft.fare + shift.lyft.tips + shift.lyft.bonus
  );
}

export function shiftPlatformGross(shift: Shift, platform: 'uber' | 'lyft'): number {
  const p = shift[platform];
  return p.fare + p.tips + p.bonus;
}

export function shiftVariableExpenseTotal(shift: Shift): number {
  const e = shift.expenses;
  return e.gas + e.carWash + e.meals + e.other;
}

export function shiftMiles(shift: Shift): number {
  if (shift.odometerMiles != null) return shift.odometerMiles;
  return shift.uber.distanceMiles + shift.lyft.distanceMiles;
}

export function weeklyAmountOf(expense: FixedExpense): number {
  const amount = expense.amount || 0;
  return expense.cadence === 'monthly' ? (amount * 12) / 52 : amount;
}

export function fixedExpensesWeeklyTotal(fixedExpenses: FixedExpense[]): number {
  return fixedExpenses.reduce((sum, e) => sum + weeklyAmountOf(e), 0);
}

export function proratedFixedExpensesForDays(fixedExpenses: FixedExpense[], days: number): number {
  return (fixedExpensesWeeklyTotal(fixedExpenses) / 7) * days;
}

export type PeriodSummary = {
  shifts: Shift[];
  gross: number;
  uberGross: number;
  lyftGross: number;
  variableExpenses: number;
  proratedFixedExpenses: number;
  netIncome: number;
  miles: number;
  mileageDeduction: number;
  hours: number;
  netHourlyRate: number;
  daysWorked: number;
};

export function summarizeShifts(shifts: Shift[], fixedExpenses: FixedExpense[], periodDays: number): PeriodSummary {
  const gross = shifts.reduce((s, sh) => s + shiftGross(sh), 0);
  const uberGross = shifts.reduce((s, sh) => s + shiftPlatformGross(sh, 'uber'), 0);
  const lyftGross = shifts.reduce((s, sh) => s + shiftPlatformGross(sh, 'lyft'), 0);
  const variableExpenses = shifts.reduce((s, sh) => s + shiftVariableExpenseTotal(sh), 0);
  const proratedFixedExpenses = proratedFixedExpensesForDays(fixedExpenses, periodDays);
  const netIncome = gross - variableExpenses - proratedFixedExpenses;
  const miles = shifts.reduce((s, sh) => s + shiftMiles(sh), 0);
  const hours = shifts.reduce((s, sh) => s + (sh.hours || 0), 0);
  const netHourlyRate = hours > 0 ? netIncome / hours : 0;

  return {
    shifts,
    gross,
    uberGross,
    lyftGross,
    variableExpenses,
    proratedFixedExpenses,
    netIncome,
    miles,
    mileageDeduction: 0, // filled in by caller with settings.mileageRate
    hours,
    netHourlyRate,
    daysWorked: new Set(shifts.map((s) => s.date)).size,
  };
}

export function filterShiftsInRange(shifts: Shift[], start: Date, end: Date): Shift[] {
  return shifts.filter((s) => isDateInRange(s.date, start, end));
}

export type PacingStatus = 'ahead' | 'on-track' | 'behind';

export type PacingResult = {
  periodLabel: 'week' | 'month';
  start: Date;
  end: Date;
  shifts: Shift[];
  goal: number;
  earned: number;
  progressPct: number;
  expectedPct: number;
  status: PacingStatus;
  daysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  shortfall: number;
  requiredDailyIncome: number;
  requiredHours: number | null;
  netHourlyRate: number;
};

export function computePacing(
  periodLabel: 'week' | 'month',
  today: Date,
  allShifts: Shift[],
  fixedExpenses: FixedExpense[],
  goal: number,
  weekStartsOn: 0 | 1
): PacingResult {
  const start = periodLabel === 'week' ? startOfWeek(today, weekStartsOn) : startOfMonth(today);
  const end = periodLabel === 'week' ? endOfWeek(today, weekStartsOn) : endOfMonth(today);
  const daysTotal = daysBetweenInclusive(start, end);

  const todayClamped = startOfDay(today) > end ? end : startOfDay(today) < start ? start : startOfDay(today);
  const daysElapsed = daysBetweenInclusive(start, todayClamped);
  const daysRemaining = Math.max(daysTotal - daysElapsed, 0);

  const periodShifts = filterShiftsInRange(allShifts, start, end);
  const summary = summarizeShifts(periodShifts, fixedExpenses, daysTotal);
  const earned = summary.netIncome;

  const expectedPct = Math.min((daysElapsed / daysTotal) * 100, 100);
  const progressPct = goal > 0 ? Math.min((earned / goal) * 100, 999) : 0;

  const shortfallToGoal = goal - earned;
  const expectedSoFar = goal * (daysElapsed / daysTotal);
  const isBehind = earned < expectedSoFar - 0.01;
  const isAhead = earned > expectedSoFar + 0.01;
  const status: PacingStatus = shortfallToGoal <= 0 ? 'ahead' : isBehind ? 'behind' : isAhead ? 'ahead' : 'on-track';

  const recentShifts = allShifts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 7);
  const recentSummary = summarizeShifts(recentShifts, fixedExpenses, recentShifts.length || 1);
  const netHourlyRate = recentSummary.netHourlyRate;

  const requiredDailyIncome = daysRemaining > 0 ? Math.max(shortfallToGoal, 0) / daysRemaining : 0;
  const requiredHours = shortfallToGoal > 0 && netHourlyRate > 0 ? shortfallToGoal / netHourlyRate : null;

  return {
    periodLabel,
    start,
    end,
    shifts: periodShifts,
    goal,
    earned,
    progressPct,
    expectedPct,
    status,
    daysTotal,
    daysElapsed,
    daysRemaining,
    shortfall: Math.max(shortfallToGoal, 0),
    requiredDailyIncome,
    requiredHours,
    netHourlyRate,
  };
}

export function mileageDeduction(miles: number, settings: Settings): number {
  return miles * settings.mileageRate;
}

export { addDays };
