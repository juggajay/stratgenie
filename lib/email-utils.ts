/**
 * Email utility functions.
 */

/**
 * Basic email validation.
 * Checks for standard email format.
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  // Basic regex that catches most valid email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Normalize email address (lowercase, trim).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
