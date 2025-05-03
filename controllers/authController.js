import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { validationResult } from 'express-validator';
import * as candidateModel from '../models/candidateModel.js';
import * as recruiterModel from '../models/recruiterModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, contact, city, skills, username, password } = req.body;

    const existingEmail = await candidateModel.getCandidateByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await candidateModel.getCandidateByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    await candidateModel.createCandidate({
      name, email, contact, city, skills, username, password
    });

    res.status(201).json({ message: 'Candidate registered successfully' });
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ message: 'Error registering candidate' });
  }
};

export const loginCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const candidate = await candidateModel.getCandidateByEmail(email);
    if (!candidate) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, candidate.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: candidate.id, email, type: 'candidate' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerRecruiter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await recruiterModel.getRecruiterByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const recruiterId = await recruiterModel.createRecruiter({
      name, email, password
    });

    const token = jwt.sign(
      { id: recruiterId, email, type: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginRecruiter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const recruiter = await recruiterModel.getRecruiterByEmail(email);
    if (!recruiter) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, recruiter.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: recruiter.id, email, type: 'recruiter' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};