import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Log errors from the Redis client
    this.client.on('error', (err) => console.error(`Redis Client Error: ${err.message}`));

    // Promisify Redis methods for asynchronous use
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value of a key from Redis.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} The value or null if not found.
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Sets a key-value pair in Redis with an expiration.
   * @param {string} key - The key to set.
   * @param {string|number} value - The value to set.
   * @param {number} duration - The expiration time in seconds.
   */
  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   */
  async del(key) {
    await this.delAsync(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
