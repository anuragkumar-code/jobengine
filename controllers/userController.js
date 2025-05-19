const db = require('../models');
const Job = db.Job;
const User = db.User;

exports.createUser = async (req, res) => {
  try {
    const { name, email, resumeData, skills, preferences } = req.body;

    const newUser = await User.create({
      name,
      email,
      resumeData,
      skills,
      preferences,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, resumeData, skills, preferences } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ name, email, resumeData, skills, preferences });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const { resumeData } = req.body; // Assume resumeData contains structured text or extracted fields for now

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ resumeData });

    res.json({ message: 'Resume uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};
