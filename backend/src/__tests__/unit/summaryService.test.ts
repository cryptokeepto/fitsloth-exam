/**
 * Summary Service Unit Tests
 * Tests for Weekly Summary feature logic
 */

import { isValidDateFormat } from '../../services/summaryService';

describe('summaryService', () => {
  describe('isValidDateFormat', () => {
    it('should return true for valid YYYY-MM-DD format', () => {
      expect(isValidDateFormat('2024-01-15')).toBe(true);
      expect(isValidDateFormat('2024-12-31')).toBe(true);
      expect(isValidDateFormat('2023-06-01')).toBe(true);
    });

    it('should return false for invalid date formats', () => {
      expect(isValidDateFormat('01-15-2024')).toBe(false);
      expect(isValidDateFormat('15/01/2024')).toBe(false);
      expect(isValidDateFormat('2024/01/15')).toBe(false);
    });

    it('should return false for incomplete dates', () => {
      expect(isValidDateFormat('2024-01')).toBe(false);
      expect(isValidDateFormat('2024')).toBe(false);
    });

    it('should return false for invalid month', () => {
      expect(isValidDateFormat('2024-13-01')).toBe(false);
      expect(isValidDateFormat('2024-00-15')).toBe(false);
    });

    it('should return false for invalid day', () => {
      expect(isValidDateFormat('2024-01-32')).toBe(false);
      expect(isValidDateFormat('2024-01-00')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidDateFormat('')).toBe(false);
    });

    it('should handle leap year dates', () => {
      expect(isValidDateFormat('2024-02-29')).toBe(true); // 2024 is leap year
    });
  });
});
