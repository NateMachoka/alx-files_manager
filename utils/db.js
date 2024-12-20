import { MongoClient } from 'mongodb';

const { DB_HOST = 'localhost' } = process.env;
const { DB_PORT = 27017 } = process.env;
const { DB_DATABASE = 'files_manager' } = process.env;

// Include the database name in the URL
const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

class DBClient {
  constructor() {
    this.client = null; // MongoClient instance
    this.db = null; // Database instance
    this.usersCollection = null; // Users collection instance
    this.filesCollection = null; // Files collection instance

    this.init();
  }

  async init() {
    console.log('DB Host:', DB_HOST);
    console.log('DB Port:', DB_PORT);
    console.log('DB Database:', DB_DATABASE);
    try {
      this.client = await MongoClient.connect(DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      this.db = this.client.db(DB_DATABASE);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  isAlive() {
    return this.db !== null;
  }

  async nbUsers() {
    if (!this.isAlive()) {
      console.warn('Database not initialized yet');
      return 0;
    }
    return this.usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.isAlive()) {
      console.warn('Database not initialized yet');
      return 0;
    }
    return this.filesCollection.countDocuments();
  }

  collection(name) {
    if (!this.isAlive()) {
      console.error('Database is not initialized');
      return null;
    }
    return this.db.collection(name);
  }
}

const dbClient = new DBClient();
export default dbClient;
