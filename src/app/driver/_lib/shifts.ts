import { Shift, emptyPlatformTotals, emptyVariableExpenses } from './types';

export function newShiftId(): string {
  return `shift_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyShift(date: string): Shift {
  return {
    id: newShiftId(),
    date,
    uber: emptyPlatformTotals(),
    lyft: emptyPlatformTotals(),
    odometerMiles: null,
    hours: 0,
    expenses: emptyVariableExpenses(),
  };
}
