/**
 * A generic in-memory cache with time-to-live (TTL) support.
 * @template T The type of the cached values.
 */
export class Cache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();

  /**
   * @param ttl Time-to-live for cache entries in milliseconds (default: 5 minutes).
   */
  constructor(private ttl: number = 1000 * 60 * 5) {}

  /**
   * Stores a value in the cache with an expiration time.
   * @param key The key under which the value is stored.
   * @param value The value to store.
   */
  public set(key: string, value: T): void {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { value, expiresAt });
    setTimeout(() => this.cache.delete(key), this.ttl);
  }

  /**
   * Retrieves a value from the cache if it hasn't expired.
   * @param key The key of the value to retrieve.
   * @returns The cached value or undefined if not found or expired.
   */
  public get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Checks if a key exists in the cache and is not expired.
   * @param key The key to check.
   * @returns True if the key exists and is valid, otherwise false.
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Deletes a key from the cache.
   * @param key The key to delete.
   * @returns True if the key was deleted, otherwise false.
   */
  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache.
   */
  public clear(): void {
    this.cache.clear();
  }
}