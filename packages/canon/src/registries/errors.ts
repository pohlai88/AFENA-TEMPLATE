/**
 * Registry-specific errors
 */

export class EntityContractRegistryError extends Error {
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'EntityContractRegistryError';
  }
}
