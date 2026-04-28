export type SpinOption = {
  text: string;
  label: string;
  backgroundColor: string;
  textColor?: string;
  weight?: number;
};

export type SpeedLevel = "Low" | "Medium" | "High";
export type FrictionLevel = "Low" | "Medium" | "High";

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

export const DURATION_ESTIMATES = {
  "Low-Low": [7.67, 11.58] as const,
  "Low-Medium": [4.15, 5.94] as const,
  "Low-High": [2.13, 3.1] as const,
  "Medium-Low": [8.64, 13.1] as const,
  "Medium-Medium": [4.64, 6.62] as const,
  "Medium-High": [2.36, 3.38] as const,
  "High-Low": [8.84, 13.47] as const,
  "High-Medium": [4.72, 6.78] as const,
  "High-High": [2.38, 3.41] as const,
};

const MAX_OFFSET_TIME = 0.3;
const HARD_VELOCITY_LIMIT = 2;

type PhysicsParameters = {
  v: number;
  k: number;
  theta_target: number;
};

type SpinPhases = {
  offset: number;
  t_offset: number;
  theta_phys: number;
  T_phys: number;
};

export type PhysicsSpinTarget = {
  finalTarget: number;
  totalDurationMs: number;
  offsetRatio: number;
  offsetDurationMs: number;
  physicsDurationMs: number;
  physicsEasing: (progress: number) => number;
};

export const calculateResultFromAngle = (
  angle: number,
  options: SpinOption[],
): string => {
  const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 1), 0);
  const pointerRelative = (0 - angle + 360) % 360;
  let acc = 0;

  for (let i = 0; i < options.length; i++) {
    const angleSize = ((options[i].weight || 1) / totalWeight) * 360;
    if (acc + angleSize > pointerRelative) {
      return options[i].label || options[i].text;
    }
    acc += angleSize;
  }

  return options[0]?.label || options[0]?.text || "";
};

export const getSecureRandom = (): number => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  }

  return Math.random();
};

function samplePhysicsParameters(
  speedLevel: SpeedLevel = "Medium",
  frictionLevel: FrictionLevel = "Medium",
): PhysicsParameters {
  const [vMin, vMax] = SPEED_RANGES[speedLevel];
  const [kMin, kMax] = FRICTION_RANGES[frictionLevel];

  const v = vMin + getSecureRandom() * (vMax - vMin);
  const k = kMin + getSecureRandom() * (kMax - kMin);
  const theta_target = getSecureRandom() * 360;

  return { v, k, theta_target };
}

function computePhysicsRange(v: number, k: number, T: number): number {
  return (v / k) * (1 - Math.exp(-k * T));
}

function timeToHardLimit(v: number, k: number, hardLimit: number): number {
  if (v <= hardLimit) return 0;
  return -Math.log(hardLimit / v) / k;
}

function calculateSpinPhases(
  spinTime: number,
  params: PhysicsParameters,
  maxRetries = 10,
): SpinPhases | null {
  const T = spinTime / 1000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const theta_phys_initial = computePhysicsRange(params.v, params.k, T);
    const theta_phys_mod = theta_phys_initial % 360;
    const offset = (params.theta_target - theta_phys_mod + 360) % 360;
    const t_offset = offset / params.v;

    if (t_offset > MAX_OFFSET_TIME) {
      params.theta_target = getSecureRandom() * 360;
      continue;
    }

    const T_phys = T - t_offset;
    if (T_phys <= 0) {
      params.theta_target = getSecureRandom() * 360;
      continue;
    }

    const theta_phys = computePhysicsRange(params.v, params.k, T_phys);

    return {
      offset,
      t_offset,
      theta_phys,
      T_phys,
    };
  }

  const theta_phys = computePhysicsRange(params.v, params.k, T);
  return {
    offset: 0,
    t_offset: 0,
    theta_phys,
    T_phys: T,
  };
}

function createPhysicsEasing(k: number, T_phys_seconds: number) {
  return (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    const normK = k * T_phys_seconds;
    return (1 - Math.exp(-normK * t)) / (1 - Math.exp(-normK));
  };
}

export const generatePhysicsSpinTarget = (
  currentAngle = 0,
  speedLevel: SpeedLevel = "Medium",
  frictionLevel: FrictionLevel = "Medium",
): PhysicsSpinTarget => {
  const params = samplePhysicsParameters(speedLevel, frictionLevel);
  const durationKey = `${speedLevel}-${frictionLevel}` as keyof typeof DURATION_ESTIMATES;
  const [minDuration, maxDuration] = DURATION_ESTIMATES[durationKey];
  const estimatedDuration = ((minDuration + maxDuration) / 2) * 1000;
  const phases = calculateSpinPhases(estimatedDuration, params);

  if (!phases) {
    const rounds = 5 + getSecureRandom() * 2;
    const finalTarget = currentAngle + 360 * rounds + getSecureRandom() * 360;
    return {
      finalTarget,
      totalDurationMs: estimatedDuration,
      offsetRatio: 0,
      offsetDurationMs: 0,
      physicsDurationMs: estimatedDuration,
      physicsEasing: (t) => 1 - Math.pow(1 - t, 2),
    };
  }

  const { offset, t_offset, T_phys } = phases;
  const timeToHardLimitSeconds = timeToHardLimit(
    params.v,
    params.k,
    HARD_VELOCITY_LIMIT,
  );
  const actualPhysicsTime = Math.min(T_phys, timeToHardLimitSeconds);
  const actualTheta_phys = computePhysicsRange(
    params.v,
    params.k,
    actualPhysicsTime,
  );
  const totalDistance = offset + actualTheta_phys;
  const finalTarget = currentAngle + totalDistance;
  const totalDurationMs = (t_offset + actualPhysicsTime) * 1000;

  return {
    finalTarget,
    totalDurationMs,
    offsetRatio: totalDistance === 0 ? 0 : offset / totalDistance,
    offsetDurationMs: t_offset * 1000,
    physicsDurationMs: actualPhysicsTime * 1000,
    physicsEasing: createPhysicsEasing(params.k, actualPhysicsTime),
  };
};
