import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Ensure the database client is connected
      const usersCollection = dbClient.collection('users');
      if (!usersCollection) {
        return res.status(500).json({ error: 'Database not ready' });
      }

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password securely using SHA-1 (though consider bcrypt for better security in production)
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      
      // Insert the new user into the database
      const result = await usersCollection.insertOne({ email, password: hashedPassword });

      return res.status(201).json({
        id: result.insertedId,
        email
      });
    } catch (error) {
      console.error('Error in postNew:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
