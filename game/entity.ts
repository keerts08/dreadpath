import { EntityState, NoiseLevel } from "./types";

const NOISE_VALUE: Record<NoiseLevel, number> = {
  none: 0,
  low: 3,
  medium: 7,
  high: 13,
};

export interface EntityTickInput {
  entity: EntityState;
  noise: NoiseLevel;
  dangerLevel: 0 | 1 | 2 | 3;
  isHidden: boolean;
  hideStreak: number;
}

export interface EntityTickResult {
  entity: EntityState;
  closeCall: boolean;
  foundWhileHidden: boolean;
  captured: boolean;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function tickEntity(input: EntityTickInput): EntityTickResult {
  const { entity, noise, dangerLevel, isHidden, hideStreak } = input;
  let { distance, alertness } = entity;

  const noiseValue = NOISE_VALUE[noise];
  alertness = clamp(
    alertness + noiseValue * (1 + dangerLevel * 0.35) - 1.5,
    0,
    100,
  );

  let closeCall = false;
  let foundWhileHidden = false;

  if (isHidden) {
    const recover = 9 + Math.random() * 6;
    distance = clamp(distance + recover, 0, 100);
    const findChance = alertness > 75 ? 0.05 + hideStreak * 0.02 : 0.01;
    if (Math.random() < findChance) {
      foundWhileHidden = true;
    } else if (alertness > 55 && Math.random() < 0.35) {
      closeCall = true;
    }
  } else {
    const base = 2 + Math.random() * 1.0;
    const alertPull = alertness / 28;
    const dangerPull = dangerLevel * 0.4;
    const wander = Math.random() < 0.2 ? -(Math.random() * 4) : 0;
    distance = clamp(distance - base - alertPull - dangerPull - wander, 0, 100);
  }

  const captured = !isHidden && distance <= 0;

  return {
    entity: { distance, alertness, lastEvent: entity.lastEvent },
    closeCall,
    foundWhileHidden,
    captured,
  };
}

export type TensionBand = "far" | "noticed" | "close" | "veryClose" | "chase";

export function tensionBand(distance: number): TensionBand {
  if (distance > 70) return "far";
  if (distance > 45) return "noticed";
  if (distance > 25) return "close";
  if (distance > 10) return "veryClose";
  return "chase";
}
