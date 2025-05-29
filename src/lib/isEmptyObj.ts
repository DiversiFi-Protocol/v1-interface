// Check if an object is empty
export function isEmptyObj(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}
