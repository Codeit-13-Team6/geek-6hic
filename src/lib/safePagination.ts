export function safeOffset(raw?: number): number {
  return Number.isFinite(raw) && (raw ?? 0) >= 0 ? (raw ?? 0) : 0;
}

export function safeLimit(raw?: number, defaultVal = 10): number {
  return Number.isFinite(raw) && (raw ?? 0) > 0 ? (raw ?? defaultVal) : defaultVal;
}
