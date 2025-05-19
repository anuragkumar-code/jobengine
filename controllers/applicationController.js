const db = require('../models');
const openaiService = require('../services/openaiService');
const jobScraperService = require('../services/jobScraperService');
const Application = db.Application;
const Job = db.Job;
const User = db.User;

exports.createApplication = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    
    const job = await Job.findByPk(jobId);
    const user = await User.findByPk(userId);
    
    if (!job || !user) {
      return res.status(404).json({ message: 'Job or user not found' });
    }
    
    // Generate cover letter
    const coverLetter = await openaiService.generateCoverLetter(
      { title: job.title, company: job.company, description: job.description },
      { name: user.name, resumeData: user.resumeData, skills: user.skills }
    );
    
    // Tailor resume
    const customizedResume = await openaiService.tailorResume(
      user.resumeData,
      job.description
    );
    
    // Create application
    const application = await Application.create({
      JobId: jobId,
      UserId: userId,
      coverLetter,
      customizedResume,
      status: 'ready'
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

exports.submitApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { credentials } = req.body;
    
    const application = await Application.findByPk(applicationId, {
      include: [Job, User]
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update status
    application.status = 'submitted';
    application.submissionDate = new Date();
    
    // Submit application through job platform
    const result = await jobScraperService.submitApplication(
      application.Job,
      application,
      application.User,
      credentials
    );
    
    if (result.success) {
      application.applicationFeedback = result.message;
      await application.save();
      res.status(200).json({ message: 'Application submitted successfully', application });
    } else {
      application.status = 'failed';
      application.applicationFeedback = result.message;
      await application.save();
      res.status(400).json({ message: 'Failed to submit application', details: result.message });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};