import { describe, expect, it } from "vitest";
import { unwrapDefault } from "./moduleInterop";

describe("unwrapDefault", () => {
  it("returns direct constructors", () => {
    class Direct {}
    expect(unwrapDefault<typeof Direct>(Direct)).toBe(Direct);
  });

  it("unwraps nested CommonJS defaults", () => {
    class Nested {}
    expect(unwrapDefault<typeof Nested>({ default: { default: Nested } })).toBe(Nested);
  });
});
