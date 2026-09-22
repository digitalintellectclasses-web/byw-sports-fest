import { describe, it, expect } from 'vitest';
import { getRankColor, calculatePoints } from './utils';

describe('utils', () => {
  describe('getRankColor', () => {
    it('returns gold classes for 1st place (index 0)', () => {
      const result = getRankColor(0);
      expect(result).toContain('amber-100');
      expect(result).toContain('amber-700');
    });

    it('returns silver classes for 2nd place (index 1)', () => {
      const result = getRankColor(1);
      expect(result).toContain('slate-100');
      expect(result).toContain('slate-700');
    });

    it('returns bronze classes for 3rd place (index 2)', () => {
      const result = getRankColor(2);
      expect(result).toContain('orange-100');
      expect(result).toContain('orange-800');
    });

    it('returns default translucent classes for 4th place and beyond', () => {
      const result = getRankColor(3);
      expect(result).toContain('bg-white/80');
      expect(result).toContain('backdrop-blur-lg');
    });
  });

  describe('calculatePoints', () => {
    it('calculates points correctly with no penalties', () => {
      expect(calculatePoints(3, 0)).toBe(150);
    });

    it('calculates points correctly with penalties', () => {
      expect(calculatePoints(3, 20)).toBe(130);
    });

    it('can return negative points if penalties exceed wins', () => {
      expect(calculatePoints(0, 50)).toBe(-50);
    });
  });
});
