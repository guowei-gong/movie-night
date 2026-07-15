export function unwrapDefault<T>(moduleValue: unknown): T {
  let value = moduleValue;
  for (let depth = 0; depth < 3 && typeof value !== "function"; depth += 1) {
    if (!value || typeof value !== "object" || !("default" in value)) break;
    value = (value as { default: unknown }).default;
  }
  return value as T;
}
