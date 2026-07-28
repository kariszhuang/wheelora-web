export type SpinOption = {
  text: string;
  label: string;
  backgroundColor: string;
  textColor?: string;
  weight?: number;
};

export const FRICTION_RANGES = {
  Low: [0.5, 0.8] as const,
  Medium: [1.0, 1.5] as const,
  High: [2.0, 3.0] as const,
};

export const SPEED_RANGES = {
  Low: [600, 800] as const,
  Medium: [1500, 1700] as const,
  High: [4000, 6000] as const,
};

export const FIXED_SPEED_VALUES = { Low: 700, Medium: 1600, High: 5000 } as const;
export const FIXED_FRICTION_VALUES = { Low: 0.65, Medium: 1.25, High: 2.5 } as const;

export const DURATION_ESTIMATES = {
  "Low-Low": [9.01, 9.53], "Low-Medium": [4.69, 5.2], "Low-High": [2.34, 2.86],
  "Medium-Low": [10.28, 10.51], "Medium-Medium": [5.35, 5.57], "Medium-High": [2.67, 2.9],
  "High-Low": [12.04, 12.11], "High-Medium": [6.26, 6.33], "High-High": [3.13, 3.2],
} as const;

export type SpeedLevel = keyof typeof SPEED_RANGES;
export type FrictionLevel = keyof typeof FRICTION_RANGES;

export const getTapSpinSpeed = (
  isAlreadySpinning: boolean,
  configuredSpeed: SpeedLevel,
): SpeedLevel => isAlreadySpinning ? "High" : configuredSpeed;

type PhysicsPlan = {
  v: number;
  k: number;
  thetaTarget: number;
  offset: number;
  offsetDurationMs: number;
  physicsDurationMs: number;
  finalTarget: number;
};

export type PhysicsSpinTarget = {
  finalTarget: number;
  totalDurationMs: number;
  offsetRatio: number;
  offsetDurationMs: number;
  physicsDurationMs: number;
  physicsEasing: (progress: number) => number;
};

const HARD_VELOCITY_LIMIT = 2;

export const normalizePhysicsAngle = (value: number) => ((value % 360) + 360) % 360;

export const calculateResultFromAngle = (angle: number, options: SpinOption[]): string => {
  const totalWeight = options.reduce((sum, option) => sum + (option.weight || 1), 0);
  const pointerRelative = (360 - normalizePhysicsAngle(angle)) % 360;
  let accumulated = 0;

  for (const option of options) {
    accumulated += ((option.weight || 1) / totalWeight) * 360;
    if (accumulated > pointerRelative) return option.label || option.text;
  }

  return options[0]?.label || options[0]?.text || "";
};

export const getSecureRandom = (): number => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  }
  return Math.random();
};

const computePhysicsRange = (velocity: number, friction: number, duration: number) =>
  (velocity / friction) * (1 - Math.exp(-friction * duration));

const timeToHardLimit = (velocity: number, friction: number) =>
  velocity <= HARD_VELOCITY_LIMIT ? 0 : -Math.log(HARD_VELOCITY_LIMIT / velocity) / friction;

export function calculateFairPhysicsSpinPlan(
  currentAngle = 0,
  speedLevel: SpeedLevel = "Medium",
  frictionLevel: FrictionLevel = "Medium",
  targetAngle = getSecureRandom() * 360,
): PhysicsPlan {
  const v = FIXED_SPEED_VALUES[speedLevel];
  const k = FIXED_FRICTION_VALUES[frictionLevel];
  const physicsDurationMs = timeToHardLimit(v, k) * 1000;
  const thetaPhys = computePhysicsRange(v, k, physicsDurationMs / 1000);
  const thetaTarget = normalizePhysicsAngle(targetAngle);
  const offset = normalizePhysicsAngle(thetaTarget - normalizePhysicsAngle(currentAngle + thetaPhys));
  const offsetDurationMs = (offset / v) * 1000;

  return {
    v,
    k,
    thetaTarget,
    offset,
    offsetDurationMs,
    physicsDurationMs,
    finalTarget: currentAngle + offset + thetaPhys,
  };
}

export const generatePhysicsSpinTarget = (
  currentAngle = 0,
  speedLevel: SpeedLevel = "Medium",
  frictionLevel: FrictionLevel = "Medium",
): PhysicsSpinTarget => {
  const plan = calculateFairPhysicsSpinPlan(currentAngle, speedLevel, frictionLevel);
  const totalDistance = plan.finalTarget - currentAngle;

  return {
    finalTarget: plan.finalTarget,
    totalDurationMs: plan.offsetDurationMs + plan.physicsDurationMs,
    offsetRatio: totalDistance === 0 ? 0 : plan.offset / totalDistance,
    offsetDurationMs: plan.offsetDurationMs,
    physicsDurationMs: plan.physicsDurationMs,
    physicsEasing: (progress) => {
      if (progress <= 0) return 0;
      if (progress >= 1) return 1;
      const normalizedFriction = plan.k * (plan.physicsDurationMs / 1000);
      return (1 - Math.exp(-normalizedFriction * progress)) / (1 - Math.exp(-normalizedFriction));
    },
  };
};
