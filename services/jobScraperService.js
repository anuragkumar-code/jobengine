const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class JobScraperService {
  async searchIndeedJobs(query, location, limit = 20) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      
      await page.goto(`https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`);
      
      await page.waitForSelector('.jobsearch-ResultsList');
      
      const jobListings = await page.evaluate(() => {
        const listings = [];
        const jobCards = document.querySelectorAll('.job_seen_beacon');
        
        jobCards.forEach(card => {
          try {
            const titleElement = card.querySelector('.jobTitle a');
            const companyElement = card.querySelector('.companyName');
            const locationElement = card.querySelector('.companyLocation');
            const snippetElement = card.querySelector('.job-snippet');
            
            if (titleElement) {
              listings.push({
                title: titleElement.innerText.trim(),
                company: companyElement ? companyElement.innerText.trim() : 'Unknown',
                location: locationElement ? locationElement.innerText.trim() : 'Unknown',
                description: snippetElement ? snippetElement.innerText.trim() : '',
                jobUrl: titleElement.href,
                source: 'indeed'
              });
            }
          } catch (e) {
            console.error('Error parsing job card:', e);
          }
        });
        
        return listings;
      });
      
      await browser.close();
      return jobListings.slice(0, limit);
    } catch (error) {
      console.error('Error searching Indeed jobs:', error);
      throw error;
    }
  }
  
  async searchLinkedInJobs(query, location, limit = 20) {
    try {
      
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      
      await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
      
      await page.waitForSelector('.jobs-search__results-list');
      
      const jobListings = await page.evaluate(() => {
        const listings = [];
        const jobCards = document.querySelectorAll('.jobs-search__results-list li');
        
        jobCards.forEach(card => {
          try {
            const titleElement = card.querySelector('.base-search-card__title');
            const companyElement = card.querySelector('.base-search-card__subtitle');
            const locationElement = card.querySelector('.job-search-card__location');
            const linkElement = card.querySelector('a.base-card__full-link');
            
            if (titleElement && linkElement) {
              listings.push({
                title: titleElement.innerText.trim(),
                company: companyElement ? companyElement.innerText.trim() : 'Unknown',
                location: locationElement ? locationElement.innerText.trim() : 'Unknown',
                description: '', 
                jobUrl: linkElement.href,
                source: 'linkedin'
              });
            }
          } catch (e) {
            console.error('Error parsing LinkedIn job card:', e);
          }
        });
        
        return listings;
      });
      
      await browser.close();
      return jobListings.slice(0, limit);
    } catch (error) {
      console.error('Error searching LinkedIn jobs:', error);
      throw error;
    }
  }
  
  async getFullJobDescription(jobUrl, source) {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      
      await page.goto(jobUrl);
      
      let description = '';
      
      if (source === 'indeed') {
        await page.waitForSelector('#jobDescriptionText');
        description = await page.$eval('#jobDescriptionText', el => el.innerText);
      } else if (source === 'linkedin') {
        await page.waitForSelector('.show-more-less-html__markup');
        description = await page.$eval('.show-more-less-html__markup', el => el.innerText);
      }
      
      await browser.close();
      return description;
    } catch (error) {
      console.error(`Error getting full job description from ${source}:`, error);
      throw error;
    }
  }
  
  async submitApplication(job, application, user, credentials) {
    // dummy implementation for now    
    try {
      if (job.source === 'indeed') {
        return await this.submitIndeedApplication(job, application, user, credentials);
      } else if (job.source === 'linkedin') {
        return await this.submitLinkedInApplication(job, application, user, credentials);
      }
      
      throw new Error(`Unsupported job source: ${job.source}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }
  
  async submitIndeedApplication(job, application, user, credentials) {
    try {
      const browser = await puppeteer.launch({ headless: false }); 
      const page = await browser.newPage();
      
      await page.goto(job.jobUrl);
      
      await page.waitForSelector('.jobsearch-IndeedApplyButton-newDesign');
      await page.click('.jobsearch-IndeedApplyButton-newDesign');
      
      await page.waitForSelector('input[name="email"]');
      await page.type('input[name="email"]', credentials.email);
      
      await page.click('button[type="submit"]');
      
      await page.waitForSelector('.ia-JobApplication-success');
      
      await browser.close();
      
      return {
        success: true,
        message: 'Application submitted successfully to Indeed'
      };
    } catch (error) {
      console.error('Error submitting Indeed application:', error);
      throw error;
    }
  }
  
  async submitLinkedInApplication(job, application, user, credentials) {
    // Placeholder - implement LinkedIn-specific application flow
    return { success: false, message: 'LinkedIn application submission not yet implemented' };
  }
}

module.exports = new JobScraperService();
