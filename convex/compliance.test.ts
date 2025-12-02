import { describe, it, expect } from "vitest";
import { calculateComplianceStatus } from "./compliance";

const DAYS_MS = 24 * 60 * 60 * 1000;

/**
 * Tests for calculateComplianceStatus
 * Per spec CH-0001:
 * - on_track: > 60 days remaining
 * - upcoming: 60 to 30 days remaining (the "Secretary Trigger")
 * - due_soon: < 30 days remaining (ACTION REQUIRED)
 * - overdue: past deadline
 */
describe("calculateComplianceStatus", () => {
  const now = Date.now();

  describe("on_track status (> 60 days)", () => {
    it("returns on_track for 90 days remaining", () => {
      const dueDate = now + 90 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("on_track");
    });

    it("returns on_track for 61 days remaining", () => {
      const dueDate = now + 61 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("on_track");
    });
  });

  describe("upcoming status (60-30 days)", () => {
    it("returns upcoming for exactly 60 days remaining (boundary)", () => {
      const dueDate = now + 60 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("upcoming");
    });

    it("returns upcoming for 45 days remaining (per spec scenario)", () => {
      const dueDate = now + 45 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("upcoming");
    });

    it("returns upcoming for 30 days remaining (boundary)", () => {
      const dueDate = now + 30 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("upcoming");
    });
  });

  describe("due_soon status (< 30 days)", () => {
    it("returns due_soon for 29 days remaining", () => {
      const dueDate = now + 29 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("due_soon");
    });

    it("returns due_soon for 20 days remaining (per spec scenario)", () => {
      const dueDate = now + 20 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("due_soon");
    });

    it("returns due_soon for 1 day remaining", () => {
      const dueDate = now + 1 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("due_soon");
    });

    it("returns due_soon for due today (0 days)", () => {
      const dueDate = now;
      expect(calculateComplianceStatus(dueDate, now)).toBe("due_soon");
    });
  });

  describe("overdue status (past deadline)", () => {
    it("returns overdue for 1 day past (per spec scenario)", () => {
      const dueDate = now - 1 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("overdue");
    });

    it("returns overdue for 30 days past", () => {
      const dueDate = now - 30 * DAYS_MS;
      expect(calculateComplianceStatus(dueDate, now)).toBe("overdue");
    });
  });

  describe("null handling", () => {
    it("returns null for undefined due date", () => {
      expect(calculateComplianceStatus(undefined, now)).toBe(null);
    });
  });
});
