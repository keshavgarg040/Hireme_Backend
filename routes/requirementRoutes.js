import express from 'express';
import * as requirementController from '../controllers/requirementController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticateToken, requirementController.getAllRequirements);
router.post('/', authenticateToken, requirementController.createRequirement);
router.put('/:id', authenticateToken, requirementController.updateRequirement);
router.delete('/:id', authenticateToken, requirementController.deleteRequirement);

export default router; 