import * as candidateModel from '../models/candidateModel.js';


export const getProfile = async (req, res) => {
  try {
    const candidate = await candidateModel.getCandidateById(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, email, contact, city, skills } = req.body;
    
    
    const existingProfile = await candidateModel.getCandidateById(req.user.id);
    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    
    await candidateModel.updateCandidate(req.user.id, {
      name, email, contact, city, skills
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};


export const deleteProfile = async (req, res) => {
  try {
   
    const existingProfile = await candidateModel.getCandidateById(req.user.id);
    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    
    await candidateModel.deleteCandidate(req.user.id);
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await candidateModel.getAllCandidates();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Error fetching candidates' });
  }
};


export const getCandidateById = async (req, res) => {
  try {
    const candidate = await candidateModel.getCandidateById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate' });
  }
};


export const addCandidate = async (req, res) => {
  try {
    const { name, email, skills, contact, city } = req.body;
    
   
    const candidateId = await candidateModel.createCandidate({
      name, email, skills, contact, city,
      username: email, 
      password: Math.random().toString(36).slice(-8) 
    });
    
    res.json({ message: 'Candidate added successfully', id: candidateId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding candidate', error });
  }
};


export const updateCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, city, skills } = req.body;
    
   
    const existingCandidate = await candidateModel.getCandidateById(id);
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    
    if (req.user.type !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can update other candidates' });
    }
    
   
    await candidateModel.updateCandidate(id, {
      name, email, contact, city, skills
    });
    
    res.json({ message: 'Candidate updated successfully' });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: 'Error updating candidate' });
  }
};


export const deleteCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const existingCandidate = await candidateModel.getCandidateById(id);
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
   
    if (req.user.type !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can delete other candidates' });
    }
    
   
    await candidateModel.deleteCandidate(id);
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Error deleting candidate' });
  }
}; 