import { MAX_BODY_LENGTH } from "./constants";

export type ValidationResult = { ok: true } | { ok: false; error: string };

/**
 * Count Unicode code points, matching Postgres `char_length`. `"👍".length`
 * is 2 (UTF-16 code units) but `char_length` is 1.
 */
export function countChars(value: string): number {
  return Array.from(value).length;
}

export function validateBody(body: string): ValidationResult {
  if (body.trim().length === 0) {
    return { ok: false, error: "Write something before sharing." };
  }

  if (countChars(body) > MAX_BODY_LENGTH) {
    return {
      ok: false,
      error: `Keep it under ${MAX_BODY_LENGTH} characters.`,
    };
  }

  return { ok: true };
}
