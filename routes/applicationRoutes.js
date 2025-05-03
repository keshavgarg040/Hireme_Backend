import express from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.post('/setup', authenticateToken, applicationController.setupApplicationsTable);
router.post('/apply/:id', authenticateToken, applicationController.applyForJob);
router.get('/my-applications', authenticateToken, applicationController.getMyApplications);
router.get('/all-applications', authenticateToken, applicationController.getAllApplications);
router.get('/debug/db-structure', authenticateToken, applicationController.debugDatabaseStructure);

export default router; 