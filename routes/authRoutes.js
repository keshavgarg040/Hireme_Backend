import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/candidate/register', authController.registerCandidate);
router.post('/candidate/login', authController.loginCandidate);

router.post('/recruiter/register', authController.registerRecruiter);
router.post('/recruiter/login', authController.loginRecruiter);

export default router;