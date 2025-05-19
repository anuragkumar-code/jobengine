const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  async analyzeJobMatch(jobDescription, userProfile) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system", 
            content: "You are an expert job matching AI that analyzes job descriptions and determines how well a candidate matches with the job requirements."
          },
          {
            role: "user",
            content: `Job Description: ${jobDescription}\n\nCandidate Profile: ${JSON.stringify(userProfile)}\n\nAnalyze this job for the candidate. Return a JSON with the following fields: relevanceScore (0-100), keyMatches (array of matching skills), missingSkills (array of skills the candidate is missing), recommendedApproach (string with personalized advice).`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing job match:', error);
      throw error;
    }
  }

  async generateCoverLetter(jobDetails, userProfile) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system", 
            content: "You are an expert in writing personalized, compelling cover letters that highlight relevant experience and skills."
          },
          {
            role: "user",
            content: `Create a professional cover letter for the following job: ${JSON.stringify(jobDetails)}.\n\nUse the candidate's profile: ${JSON.stringify(userProfile)}.\n\nThe cover letter should be personalized for this specific job position, highlight the most relevant skills and experiences, and express genuine interest in the company. Keep it to around 350-400 words maximum.`
          }
        ]
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw error;
    }
  }
  
  async tailorResume(resumeData, jobDescription) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system", 
            content: "You are an expert in optimizing resumes to highlight the most relevant skills and experiences for specific job descriptions."
          },
          {
            role: "user",
            content: `Original Resume: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}\n\nOptimize this resume for the job description. Return a JSON with the updated resume sections, highlighting the most relevant experiences and skills, and possibly reordering or emphasizing certain parts to better match the job requirements.`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIService();
