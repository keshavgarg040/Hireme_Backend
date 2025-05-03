import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getRecruiterByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM recruitersregister WHERE email = ?', [email]);
  return rows[0];
};

export const createRecruiter = async (recruiterData) => {
  const { name, email, password } = recruiterData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO recruitersregister (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  
  return result.insertId;
};