import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  // GET /status - Check if Redis and DB are alive
  static async getStatus(req, res) {
    try {
      const redisStatus = redisClient.isAlive();
      const dbStatus = await dbClient.isAlive();

      return res.status(200).json({
        redis: redisStatus,
        db: dbStatus,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error checking status' });
    }
  }

  // GET /stats - Get number of users and files in DB
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      return res.status(200).json({
        users: usersCount,
        files: filesCount,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving stats' });
    }
  }
}

export default AppController;
