/**
 * Deep freeze utility for immutable data structures.
 * No dependencies, pure function.
 */

/**
 * Deep freeze an object (recursive, handles arrays/objects).
 * 
 * @param obj - Object to freeze
 * @returns Deeply frozen object
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  // Freeze the object itself
  Object.freeze(obj);
  
  // Recursively freeze properties
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      // Only freeze if not already frozen
      if (!Object.isFrozen(value)) {
        deepFreeze(value);
      }
    }
  });
  
  return obj;
}
