import dbClient from './utils/db';

// Wait for connection to MongoDB
const waitConnection = async () => {
  let attempts = 0;
  while (attempts < 10) {
    attempts += 1;
    const isConnected = await dbClient.isAlive();
    if (isConnected) {
      return true;
    } else {
      console.log('Waiting for DB connection...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }
  }
  return false;
};

(async () => {
  // Log initial connection status (false initially)
  console.log(await dbClient.isAlive());
  
  // Wait for the connection to succeed
  const isConnected = await waitConnection();
  console.log(isConnected); // Logs 'true' after a successful connection

  // Fetch and log number of users and files
  console.log(await dbClient.nbUsers()); // Log number of users in the 'users' collection
  console.log(await dbClient.nbFiles()); // Log number of files in the 'files' collection
})();
