import { describe, it, expect } from 'vitest';
import { assessTimeline } from '../domain/risk/timeline';

describe('assessTimeline', () => {
  it('identifies overlap throughout range', () => {
    const res = assessTimeline({
      applicable: true,
      x: { min: 10, max: 10 },
      y: { min: 3, max: 3 },
      z: { min: 8, max: 8 }
    });
    expect(res.state).toBe('overlap-throughout-range');
    if (res.state !== 'needs-context' && res.state !== 'not-applicable') {
      expect(res.overlap).toEqual({ min: 5, max: 5 });
    }
  });

  it('identifies outside-assumed-horizon', () => {
    const res = assessTimeline({
      applicable: true,
      x: { min: 1, max: 1 },
      y: { min: 1, max: 1 },
      z: { min: 8, max: 8 }
    });
    expect(res.state).toBe('outside-assumed-horizon');
    if (res.state !== 'needs-context' && res.state !== 'not-applicable') {
      expect(res.overlap).toEqual({ min: -6, max: -6 });
    }
  });

  it('identifies at-boundary', () => {
    const res = assessTimeline({
      applicable: true,
      x: { min: 5, max: 5 },
      y: { min: 3, max: 3 },
      z: { min: 8, max: 8 }
    });
    expect(res.state).toBe('at-boundary');
    if (res.state !== 'needs-context' && res.state !== 'not-applicable') {
      expect(res.overlap).toEqual({ min: 0, max: 0 });
    }
  });

  it('identifies overlap-possible-or-boundary', () => {
    const res = assessTimeline({
      applicable: true,
      x: { min: 5, max: 10 },
      y: { min: 1, max: 3 },
      z: { min: 8, max: 12 }
    });
    expect(res.state).toBe('overlap-possible-or-boundary');
    if (res.state !== 'needs-context' && res.state !== 'not-applicable') {
      expect(res.overlap).toEqual({ min: -6, max: 5 });
    }
  });

  it('identifies overlap-throughout-range with ranges', () => {
    const res = assessTimeline({
      applicable: true,
      x: { min: 10, max: 12 },
      y: { min: 2, max: 4 },
      z: { min: 5, max: 8 }
    });
    expect(res.state).toBe('overlap-throughout-range');
    if (res.state !== 'needs-context' && res.state !== 'not-applicable') {
      expect(res.overlap).toEqual({ min: 4, max: 11 });
    }
  });

  it('identifies needs-context', () => {
    const res = assessTimeline({
      applicable: true,
      x: null,
      y: { min: 2, max: 2 },
      z: { min: 8, max: 8 }
    });
    expect(res.state).toBe('needs-context');
  });

  it('identifies not-applicable', () => {
    const res = assessTimeline({
      applicable: false,
      x: { min: 10, max: 10 },
      y: null,
      z: null
    });
    expect(res.state).toBe('not-applicable');
  });

  it('throws on invalid input', () => {
    expect(() => assessTimeline({
      applicable: true,
      x: { min: -1, max: 2 },
      y: { min: 1, max: 1 },
      z: { min: 5, max: 5 }
    })).toThrowError('Invalid year range');
  });
});
