import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Load all routes from routes/index.js
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
