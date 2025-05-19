const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

// Search for jobs
router.post('/search', jobController.searchJobs);

// Get job details
router.get('/:id', jobController.getJobById);

// Analyze job match with user profile
router.get('/:jobId/analyze/:userId', jobController.analyzeJobMatch);

// Get recommended jobs for user
router.get('/recommended/:userId', jobController.getRecommendedJobs);

module.exports = router;