/**
 * Utility functions for Firestore data normalization and sanitization.
 * Enforces production safety: Firestore throws "Unsupported field value: undefined"
 * if any field in a setDoc/updateDoc/addDoc payload has an undefined value.
 */

/**
 * Recursively strips all properties with `undefined` values from an object or array.
 * Preserves null, empty strings, numbers, booleans, arrays, and Date/Timestamp instances.
 */
export function sanitizeFirestoreData<T>(data: T): T {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }

  // Preserve native Date objects and Firestore Timestamp objects (which have .toDate or .seconds)
  if (data instanceof Date || typeof (data as any).toDate === 'function') {
    return data;
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key] = sanitizeFirestoreData(value);
    }
  }

  return sanitized as T;
}
