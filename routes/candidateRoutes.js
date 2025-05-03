import express from 'express';
import * as candidateController from '../controllers/candidateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, candidateController.getProfile);
router.put('/profile', authenticateToken, candidateController.updateProfile);
router.delete('/profile', authenticateToken, candidateController.deleteProfile);

router.get('/', authenticateToken, candidateController.getAllCandidates);
router.get('/:id', authenticateToken, candidateController.getCandidateById);
router.post('/', authenticateToken, candidateController.addCandidate);
router.put('/:id', authenticateToken, candidateController.updateCandidateById);
router.delete('/:id', authenticateToken, candidateController.deleteCandidateById);

export default router;