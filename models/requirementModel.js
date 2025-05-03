import pool from '../config/db.js';

export const getAllRequirements = async () => {
  const [rows] = await pool.query('SELECT * FROM requirements');
  return rows;
};

export const getRequirementById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM requirements WHERE id = ?', [id]);
  return rows[0];
};

export const createRequirement = async (requirementData) => {
  const { position, location, company, description, salary, skills_required, experience } = requirementData;
  
  const [result] = await pool.query(
    'INSERT INTO requirements (position, location, company, description, salary, skills_required, experience) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [position, location, company, description, salary, skills_required, experience]
  );
  
  return result.insertId;
};

export const updateRequirement = async (id, requirementData) => {
  const { position, location, company, description, salary, skills_required, experience } = requirementData;
  
  await pool.query(
    'UPDATE requirements SET position = ?, location = ?, company = ?, description = ?, salary = ?, skills_required = ?, experience = ? WHERE id = ?',
    [position, location, company, description, salary, skills_required, experience, id]
  );
  
  return true;
};

export const deleteRequirement = async (id) => {
  await pool.query('DELETE FROM requirements WHERE id = ?', [id]);
  return true;
};