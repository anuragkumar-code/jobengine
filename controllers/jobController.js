const db = require('../models');
const jobScraperService = require('../services/jobScraperService');
const openaiService = require('../services/openaiService');
const Job = db.Job;
const User = db.User;

exports.searchJobs = async (req, res) => {
  try {
    const { query, location, sources, limit } = req.body;
    const jobResults = [];
    
    if (!sources || sources.includes('indeed')) {
      const indeedJobs = await jobScraperService.searchIndeedJobs(query, location, limit);
      jobResults.push(...indeedJobs);
    }
    
    if (!sources || sources.includes('linkedin')) {
      const linkedinJobs = await jobScraperService.searchLinkedInJobs(query, location, limit);
      jobResults.push(...linkedinJobs);
    }
    
    // Save jobs to database
    for (const job of jobResults) {
      await Job.findOrCreate({
        where: { jobUrl: job.jobUrl },
        defaults: job
      });
    }
    
    res.status(200).json(jobResults);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ message: 'Failed to search jobs', error: error.message });
  }
};

exports.analyzeJobMatch = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    
    const job = await Job.findByPk(jobId);
    const user = await User.findByPk(userId);
    
    if (!job || !user) {
      return res.status(404).json({ message: 'Job or user not found' });
    }
    
    // Get full job description if needed
    if (!job.description || job.description.length < 100) {
      job.description = await jobScraperService.getFullJobDescription(job.jobUrl, job.source);
      await job.save();
    }
    
    // Analyze match with OpenAI
    const analysis = await openaiService.analyzeJobMatch(job.description, {
      skills: user.skills,
      resumeData: user.resumeData
    });
    
    // Update job with analysis
    job.relevanceScore = analysis.relevanceScore;
    job.status = 'analyzed';
    await job.save();
    
    res.status(200).json({ job, analysis });
  } catch (error) {
    console.error('Error analyzing job match:', error);
    res.status(500).json({ message: 'Failed to analyze job match', error: error.message });
  }
};


exports.getRecommendedJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    // For now, just return all jobs for demo
    const jobs = await db.Job.findAll({
      limit: 10,
      order: [['relevanceScore', 'DESC']],
    });
    res.json(jobs);
  } catch (error) {
    console.error('Error getting recommended jobs:', error);
    res.status(500).json({ message: 'Failed to get recommended jobs' });
  }
};
