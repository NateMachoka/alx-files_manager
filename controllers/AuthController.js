import { MongoClient } from 'mongodb';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Function to authenticate user by email and password
const authenticateUser = async (email, password) => {
  // Hash the password and check if a user exists with this email and hashed password
  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
  const user = await MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db(process.env.DB_DATABASE);
      return db.collection('users').findOne({ email, password: hashedPassword });
    });

  return user;
};

class AuthController {
  // Connect endpoint
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract and decode the Basic Auth credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a new token
    const token = uuidv4();
    const redisKey = `auth_${token}`;

    // Store the user ID in Redis for 24 hours
    await redisClient.set(redisKey, user._id.toString(), 'EX', 86400);

    return res.status(200).json({ token });
  }

  // Disconnect endpoint
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const redisKey = `auth_${token}`;

    // Retrieve the user from Redis using the token
    const userId = await redisClient.get(redisKey);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Remove the token from Redis to log the user out
    await redisClient.del(redisKey);

    return res.status(204).send();
  }
}

export default AuthController;
