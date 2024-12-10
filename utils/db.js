// db.js
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // Create a MongoDB connection URI
    const uri = `mongodb://${host}:${port}`;

    // Remove the useUnifiedTopology option
    this.client = new MongoClient(uri);
    this.database = database;
  }

  /**
   * Checks if the MongoDB client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (err) {
      console.error(`MongoDB connection error: ${err.message}`);
      return false;
    }
  }

  async nbUsers() {
    try {
      const db = this.client.db(this.database);
      const usersCollection = db.collection('users');
      return await usersCollection.countDocuments();
    } catch (err) {
      console.error(`Error counting users: ${err.message}`);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const db = this.client.db(this.database);
      const filesCollection = db.collection('files');
      return await filesCollection.countDocuments();
    } catch (err) {
      console.error(`Error counting files: ${err.message}`);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;

