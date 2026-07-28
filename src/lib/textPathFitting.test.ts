import { describe, expect, it } from "bun:test";
import { layoutWheelSectors } from "./textPathFitting";

describe("web wheel sector layout", () => {
  it("turns weighted options into complete SVG sectors", () => {
    const options = [
      { text: "Tea", weight: 1, color: "red" },
      { text: "Coffee", weight: 3, color: "blue" },
    ];
    const sectors = layoutWheelSectors(options, "test");

    expect(sectors.map((sector) => sector.clipPathId)).toEqual([
      "test-clip-0",
      "test-clip-1",
    ]);
    expect(sectors[0].textPaths[0]).toMatchObject({
      id: "test-text-0-0",
      text: "Tea",
    });
    expect(sectors[1].path).toContain("A 216 216 0 1 1");
    expect(sectors[1].option).toBe(options[1]);
  });
});
