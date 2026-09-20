export type YearRange = { min: number; max: number };
export type TimelineResult =
  | { state: 'needs-context'; missing: string[] }
  | { state: 'not-applicable'; reason: string }
  | {
      state: 'overlap-throughout-range' | 'outside-assumed-horizon'
        | 'at-boundary' | 'overlap-possible-or-boundary';
      overlap: YearRange;
      slack: YearRange;
    };

function checkedRange(value: YearRange): YearRange {
  if (!Number.isFinite(value.min) || !Number.isFinite(value.max)
      || value.min < 0 || value.max < value.min) {
    throw new Error('Invalid year range');
  }
  return value;
}

export function assessTimeline(input: {
  applicable: boolean | null;
  x: YearRange | null;
  y: YearRange | null;
  z: YearRange | null;
}): TimelineResult {
  if (input.applicable === false) {
    return { state: 'not-applicable', reason: 'Confidentiality timing model does not apply' };
  }
  const missing: string[] = [];
  if (input.applicable === null) missing.push('applicability');
  if (input.x === null) missing.push('dataLifetimeYears');
  if (input.y === null) missing.push('migrationYears');
  if (input.z === null) missing.push('quantumHorizonYears');
  if (missing.length) return { state: 'needs-context', missing };
  const x = checkedRange(input.x!);
  const y = checkedRange(input.y!);
  const z = checkedRange(input.z!);
  const overlap = { min: x.min + y.min - z.max, max: x.max + y.max - z.min };
  const slack = { min: -overlap.max, max: -overlap.min };
  const epsilon = 1e-9;
  const lo = Math.abs(overlap.min) < epsilon ? 0 : overlap.min;
  const hi = Math.abs(overlap.max) < epsilon ? 0 : overlap.max;
  const state = lo > 0 ? 'overlap-throughout-range'
    : hi < 0 ? 'outside-assumed-horizon'
    : lo === 0 && hi === 0 ? 'at-boundary'
    : 'overlap-possible-or-boundary';
  return { state, overlap, slack };
}
