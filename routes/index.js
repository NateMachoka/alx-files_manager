import express from 'express';
import AppController from '../controllers/AppController.js';

const router = express.Router();

// GET /status - Check if Redis and DB are alive
router.get('/status', AppController.getStatus);

// GET /stats - Get number of users and files
router.get('/stats', AppController.getStats);

export default router;

