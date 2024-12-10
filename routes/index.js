import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// GET /status - Check if Redis and DB are alive
router.get('/status', AppController.getStatus);
// GET /stats - Get number of users and files
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

export default router;
