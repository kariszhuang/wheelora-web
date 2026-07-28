import { describe, expect, it } from "bun:test";
import {
  calculateFairPhysicsSpinPlan,
  getTapSpinSpeed,
  normalizePhysicsAngle,
} from "./spinLogic";

describe("app-matched wheel physics", () => {
  it("lands exactly on the selected fair target", () => {
    const plan = calculateFairPhysicsSpinPlan(359.99, "Medium", "Medium", 180);
    expect(normalizePhysicsAngle(plan.finalTarget)).toBeCloseTo(180, 10);
    expect(plan.v).toBe(1600);
    expect(plan.k).toBe(1.25);
  });

  it("boosts repeated taps without changing the configured first-spin speed", () => {
    expect(getTapSpinSpeed(false, "Low")).toBe("Low");
    expect(getTapSpinSpeed(true, "Low")).toBe("High");
  });
});
