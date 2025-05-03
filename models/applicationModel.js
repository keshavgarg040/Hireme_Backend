import pool from '../config/db.js';


export const setupApplicationsTable = async () => {
  try {
  
    try {
      await pool.query('DROP TABLE IF EXISTS job_applications');
    } catch (err) {
      console.log('Error dropping table:', err.message);
    }
    
    
    await pool.query(`
      CREATE TABLE job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id INT NOT NULL,
        requirement_id INT NOT NULL,
        applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        UNIQUE KEY unique_application (candidate_id, requirement_id),
        FOREIGN KEY (candidate_id) REFERENCES candidateregister(id) ON DELETE CASCADE,
        FOREIGN KEY (requirement_id) REFERENCES requirements(id) ON DELETE CASCADE
      )
    `);
    
    return true;
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
};


export const getApplicationByCandidateAndRequirement = async (candidateId, requirementId) => {
  const [rows] = await pool.query(
    'SELECT * FROM job_applications WHERE candidate_id = ? AND requirement_id = ?',
    [candidateId, requirementId]
  );
  return rows[0];
};


export const createApplication = async (candidateId, requirementId) => {
  const [result] = await pool.query(
    'INSERT INTO job_applications (candidate_id, requirement_id) VALUES (?, ?)',
    [candidateId, requirementId]
  );
  return result.insertId;
};


export const getApplicationsByCandidateId = async (candidateId) => {
  const [rows] = await pool.query(`
    SELECT r.*, ja.applied_date, ja.status
    FROM job_applications ja
    JOIN requirements r ON ja.requirement_id = r.id
    WHERE ja.candidate_id = ?
    ORDER BY ja.applied_date DESC
  `, [candidateId]);
  
  return rows;
};


export const getAllApplications = async () => {
  const [rows] = await pool.query(`
    SELECT candidate_id, requirement_id, applied_date, status
    FROM job_applications
    ORDER BY applied_date DESC
  `);
  
  return rows;
}; 