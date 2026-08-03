import { describe, expect, it } from "vitest";

describe("P0-G deliberate failing PR", () => {
  it("forces p0f-unit to fail so the aggregate gate can be observed", () => {
    expect("deliberate failure").toBe("passing result");
  });
});
