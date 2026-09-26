/**
 * Math utilities for ultra-smooth 60 FPS zero-ghosting circular angular tracking
 */

export function lerpAngle(current: number, target: number, factor: number = 0.26): number {
  let diff = (target - current) % (2 * Math.PI);
  if (diff < -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return current + diff * factor;
}

export function normalizeAngle(rad: number): number {
  let norm = rad % (2 * Math.PI);
  if (norm < 0) norm += 2 * Math.PI;
  return norm;
}

export function angleToFrameIndex(rad: number, numFrames: number = 64): number {
  const norm = normalizeAngle(rad);
  return Math.round((norm / (2 * Math.PI)) * numFrames) % numFrames;
}

export function radToDeg(rad: number): number {
  const norm = normalizeAngle(rad);
  return (norm * 180) / Math.PI;
}

export function getCompassDirection(deg: number): {
  code: string;
  name: string;
  frameIndex: number;
} {
  // Normalize to [0, 360)
  let d = deg % 360;
  if (d < 0) d += 360;

  if (d >= 337.5 || d < 22.5) return { code: 'E', name: 'Right', frameIndex: 0 };
  if (d >= 22.5 && d < 67.5) return { code: 'SE', name: 'Down-Right', frameIndex: 8 };
  if (d >= 67.5 && d < 112.5) return { code: 'S', name: 'Down', frameIndex: 16 };
  if (d >= 112.5 && d < 157.5) return { code: 'SW', name: 'Down-Left', frameIndex: 24 };
  if (d >= 157.5 && d < 202.5) return { code: 'W', name: 'Left', frameIndex: 32 };
  if (d >= 202.5 && d < 247.5) return { code: 'NW', name: 'Up-Left', frameIndex: 40 };
  if (d >= 247.5 && d < 292.5) return { code: 'N', name: 'Up', frameIndex: 48 };
  return { code: 'NE', name: 'Up-Right', frameIndex: 56 };
}
