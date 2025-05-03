import * as applicationModel from '../models/applicationModel.js';
import * as requirementModel from '../models/requirementModel.js';

export const setupApplicationsTable = async (req, res) => {
  try {
    await applicationModel.setupApplicationsTable();
    res.json({ message: 'Job applications table created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ message: 'Error setting up job applications table', error: error.message });
  }
};


export const applyForJob = async (req, res) => {
  try {
    const requirementId = req.params.id;

    if (req.user.type !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }

   
    const requirement = await requirementModel.getRequirementById(requirementId);
    if (!requirement) {
      return res.status(404).json({ message: 'Job not found' });
    }

  
    const existingApplication = await applicationModel.getApplicationByCandidateAndRequirement(
      req.user.id, requirementId
    );
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    
    await applicationModel.createApplication(req.user.id, requirementId);
    res.status(201).json({ message: 'Applied successfully' });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Failed to apply for job', error: error.message });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    if (req.user.type !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can view their applications' });
    }

    const applications = await applicationModel.getApplicationsByCandidateId(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    
    if (req.user.type !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can view all applications' });
    }

    const applications = await applicationModel.getAllApplications();
    res.json(applications);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications data' });
  }
};


export const debugDatabaseStructure = async (req, res) => {
  try {
    const pool = (await import('../config/db.js')).default;
    
   
    const [tables] = await pool.query('SHOW TABLES');
    
   
    let applicationStructure = [];
    try {
      [applicationStructure] = await pool.query('DESCRIBE job_applications');
    } catch (err) {
      console.log('Error fetching job_applications structure:', err.message);
    }
    
    
    let constraints = [];
    try {
      [constraints] = await pool.query(`
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_SCHEMA = ? AND TABLE_NAME = 'job_applications'
      `, [process.env.DB_NAME]);
    } catch (err) {
      console.log('Error fetching constraints:', err.message);
    }
    
    res.json({
      tables,
      applicationStructure,
      constraints
    });
  } catch (error) {
    console.error('Database structure check error:', error);
    res.status(500).json({ message: 'Error checking database structure', error: error.message });
  }
}; 