import { describe, expect, it } from "vitest";
import { balancedColumns, COLS } from "@/lib/lessons/layout";

describe("balancedColumns", () => {
  it("leaves fewest empty slots according to plan specifications", () => {
    expect(balancedColumns(2)).toBe(2);
    expect(balancedColumns(3)).toBe(3);
    expect(balancedColumns(4)).toBe(4);
    expect(balancedColumns(5)).toBe(5);
    expect(balancedColumns(6)).toBe(3);
    expect(balancedColumns(7)).toBe(4);
    expect(balancedColumns(8)).toBe(4);
    expect(balancedColumns(9)).toBe(3);
    expect(balancedColumns(10)).toBe(5);
    expect(balancedColumns(12)).toBe(4);
  });

  it("handles counts below or equal to min", () => {
    expect(balancedColumns(1)).toBe(1);
    expect(balancedColumns(2, 2, 5)).toBe(2);
    expect(balancedColumns(0)).toBe(1);
  });

  it("respects custom min and max ranges", () => {
    // With max=3, 4 items must be 2 columns
    expect(balancedColumns(4, 2, 3)).toBe(2);
    // With min=3, 6 items is 3 columns
    expect(balancedColumns(6, 3, 5)).toBe(3);
  });

  it("COLS lookup map provides static tailwind classes", () => {
    expect(COLS[1]).toBe("lg:grid-cols-1");
    expect(COLS[2]).toBe("lg:grid-cols-2");
    expect(COLS[3]).toBe("lg:grid-cols-3");
    expect(COLS[4]).toBe("lg:grid-cols-4");
    expect(COLS[5]).toBe("lg:grid-cols-5");
  });
});
