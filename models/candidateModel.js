import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getCandidateByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM candidateregister WHERE email = ?', [email]);
  return rows[0];
};

export const getCandidateByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM candidateregister WHERE username = ?', [username]);
  return rows[0];
};

export const getCandidateById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, contact, city, skills FROM candidateregister WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const getAllCandidates = async () => {
  const [rows] = await pool.query('SELECT id, name, email, contact, city, skills FROM candidateregister');
  return rows;
};

export const createCandidate = async (candidateData) => {
  const { name, email, contact, city, skills, username, password } = candidateData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO candidateregister (name, email, contact, city, skills, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, contact, city, skills, username, hashedPassword]
  );
  
  return result.insertId;
};

export const updateCandidate = async (id, candidateData) => {
  const { name, email, contact, city, skills } = candidateData;
  
  await pool.query(
    'UPDATE candidateregister SET name = ?, email = ?, contact = ?, city = ?, skills = ? WHERE id = ?',
    [name, email, contact, city, skills, id]
  );
  
  return true;
};

export const deleteCandidate = async (id) => {
  await pool.query('DELETE FROM candidateregister WHERE id = ?', [id]);
  return true;
};