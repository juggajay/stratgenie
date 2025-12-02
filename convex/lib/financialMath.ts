/**
 * Financial calculation utilities for levy distribution.
 * Uses the Largest Remainder Method for fair cent distribution.
 */

export interface LotEntitlement {
  lotId: string;
  unitEntitlement: number;
}

export interface LevyAllocation {
  lotId: string;
  amount: bigint; // in cents
}

/**
 * Distribute a budget across lots based on unit entitlements using the
 * Largest Remainder Method (also known as Hamilton's method).
 *
 * This ensures:
 * 1. Each lot pays their fair share based on entitlement percentage
 * 2. The sum of all allocations exactly equals the total budget
 * 3. Rounding is handled fairly by giving extra cents to lots with
 *    the largest decimal remainders
 *
 * @param totalCents - Total budget in cents (must be positive)
 * @param lots - Array of lots with their unit entitlements
 * @returns Array of allocations with amounts in cents
 * @throws Error if totalCents <= 0 or lots array is empty
 */
export function distributeBudget(
  totalCents: bigint,
  lots: LotEntitlement[]
): LevyAllocation[] {
  // Validation
  if (totalCents <= 0n) {
    throw new Error("Total budget must be greater than zero");
  }

  if (lots.length === 0) {
    throw new Error("At least one lot is required for levy distribution");
  }

  // Calculate total unit entitlement
  const totalEntitlement = lots.reduce(
    (sum, lot) => sum + lot.unitEntitlement,
    0
  );

  if (totalEntitlement <= 0) {
    throw new Error("Total unit entitlement must be greater than zero");
  }

  // Step 1: Calculate exact shares and floor values
  const allocationsWithRemainders = lots.map((lot) => {
    // Calculate exact share as a number for precision
    const exactShare =
      (Number(totalCents) * lot.unitEntitlement) / totalEntitlement;

    // Floor to get base amount in cents
    const flooredAmount = BigInt(Math.floor(exactShare));

    // Calculate decimal remainder for tie-breaking
    const remainder = exactShare - Math.floor(exactShare);

    return {
      lotId: lot.lotId,
      amount: flooredAmount,
      remainder,
    };
  });

  // Step 2: Calculate how many extra cents need to be distributed
  const sumOfFloors = allocationsWithRemainders.reduce(
    (sum, a) => sum + a.amount,
    0n
  );
  let remainingCents = totalCents - sumOfFloors;

  // Step 3: Sort by remainder descending (largest remainder gets extra cent first)
  const sortedByRemainder = [...allocationsWithRemainders].sort(
    (a, b) => b.remainder - a.remainder
  );

  // Step 4: Distribute remaining cents one at a time to lots with largest remainders
  const finalAllocations = new Map<string, bigint>();

  // Initialize with floored amounts
  for (const allocation of allocationsWithRemainders) {
    finalAllocations.set(allocation.lotId, allocation.amount);
  }

  // Add extra cents to lots with largest remainders
  let idx = 0;
  while (remainingCents > 0n) {
    const lotId = sortedByRemainder[idx % sortedByRemainder.length].lotId;
    const currentAmount = finalAllocations.get(lotId)!;
    finalAllocations.set(lotId, currentAmount + 1n);
    remainingCents -= 1n;
    idx++;
  }

  // Convert map back to array in original order
  return lots.map((lot) => ({
    lotId: lot.lotId,
    amount: finalAllocations.get(lot.lotId)!,
  }));
}

/**
 * Validate that a levy distribution sums to the expected total.
 * Useful for debugging and testing.
 */
export function validateDistribution(
  allocations: LevyAllocation[],
  expectedTotal: bigint
): { valid: boolean; actual: bigint; difference: bigint } {
  const actual = allocations.reduce((sum, a) => sum + a.amount, 0n);
  return {
    valid: actual === expectedTotal,
    actual,
    difference: actual - expectedTotal,
  };
}

/**
 * Calculate the percentage share for a given unit entitlement.
 */
export function calculatePercentageShare(
  unitEntitlement: number,
  totalEntitlement: number
): number {
  if (totalEntitlement <= 0) return 0;
  return (unitEntitlement / totalEntitlement) * 100;
}

/**
 * Format cents as a currency string (AUD).
 */
export function formatCentsAsAUD(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(dollars);
}
