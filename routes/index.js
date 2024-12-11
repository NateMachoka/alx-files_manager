import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// GET /status - Check if Redis and DB are alive
router.get('/status', AppController.getStatus);
// GET /stats - Get number of users and files
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

export default router;
