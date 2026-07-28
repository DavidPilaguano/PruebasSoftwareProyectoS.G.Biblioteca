export const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const textOr = (
  value: string | null | undefined,
  fallback: string,
): string => value || fallback;

export const numberOr = (
  value: number | null | undefined,
  fallback: number,
): number => value || fallback;
