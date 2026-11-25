import { describe, expect, it } from "vitest";
import { MAX_BODY_LENGTH } from "./constants";
import { countChars, validateBody } from "./validation";

describe("countChars", () => {
  it("counts code points, not UTF-16 code units", () => {
    expect(countChars("👍")).toBe(1);
    expect(countChars("👍👍")).toBe(2);
    expect(countChars("é")).toBe(1);
  });
});

describe("validateBody", () => {
  it("accepts a normal message", () => {
    expect(validateBody("Hello wall")).toEqual({ ok: true });
  });

  it("rejects an empty message", () => {
    expect(validateBody("")).toEqual({
      ok: false,
      error: "Write something before sharing.",
    });
  });

  it("rejects a whitespace-only message", () => {
    expect(validateBody("   \n ")).toEqual({
      ok: false,
      error: "Write something before sharing.",
    });
  });

  it("accepts exactly the maximum length", () => {
    expect(validateBody("a".repeat(MAX_BODY_LENGTH))).toEqual({ ok: true });
  });

  it("rejects one character over the maximum", () => {
    expect(validateBody("a".repeat(MAX_BODY_LENGTH + 1)).ok).toBe(false);
  });

  it("counts emoji as single characters toward the limit", () => {
    expect(validateBody("👍".repeat(MAX_BODY_LENGTH))).toEqual({ ok: true });
    expect(validateBody("👍".repeat(MAX_BODY_LENGTH + 1)).ok).toBe(false);
  });
});
