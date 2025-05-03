import * as requirementModel from '../models/requirementModel.js';


export const getAllRequirements = async (req, res) => {
  try {
    const requirements = await requirementModel.getAllRequirements();
    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requirements', error });
  }
};


export const createRequirement = async (req, res) => {
  try {
    const { position, location, company, description, salary, skills_required, experience } = req.body;
    
    const requirementId = await requirementModel.createRequirement({
      position, location, company, description, salary, skills_required, experience
    });
    
    res.json({ message: 'Requirement added successfully', id: requirementId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding requirement', error });
  }
};


export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { position, location, company, description, salary, skills_required, experience } = req.body;
    
    
    const existingRequirement = await requirementModel.getRequirementById(id);
    if (!existingRequirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    await requirementModel.updateRequirement(id, {
      position, location, company, description, salary, skills_required, experience
    });
    
    res.json({ message: 'Requirement updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating requirement', error });
  }
};


export const deleteRequirement = async (req, res) => {
  try {
    
    const existingRequirement = await requirementModel.getRequirementById(req.params.id);
    if (!existingRequirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    await requirementModel.deleteRequirement(req.params.id);
    res.json({ message: 'Requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting requirement', error });
  }
}; 