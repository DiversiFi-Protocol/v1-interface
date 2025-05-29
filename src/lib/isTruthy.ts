/**
 * Type-preserving truthy check that narrows the type while preserving the original type
 * @param value - The value to check
 * @returns A type predicate that narrows the type while preserving the original type
 */
export const isTruthy = <T>(n?: T | false | null | undefined | 0): n is T => Boolean(n);
