
/**
 * AI Job Application Agent Implementation Guide
 * 
 * This system uses OpenAI's API to automate job applications on Indeed and LinkedIn.
 * 
 * Key Features:
 * - Job search and scraping from Indeed and LinkedIn
 * - AI-powered job matching analysis
 * - Automated cover letter generation
 * - Resume customization for each job
 * - Application submission automation
 * 
 * Setup Instructions:
 * 
 * 1. Prerequisites:
 *    - Node.js and npm installed
 *    - MySQL database server
 *    - OpenAI API key
 * 
 * 2. Environment Setup:
 *    Create a .env file with the following variables:
 *    ```
 *    PORT=5000
 *    DB_HOST=localhost
 *    DB_USER=root
 *    DB_PASSWORD=yourpassword
 *    DB_NAME=job_application_ai
 *    OPENAI_API_KEY=your_openai_key
 *    ```
 * 
 * 3. Database Setup:
 *    - Create MySQL database named 'job_application_ai'
 *    - The Sequelize models will handle table creation
 * 
 * 4. Installation:
 *    ```
 *    npm install
 *    ```
 * 
 * 5. Running the application:
 *    - Backend: `node server.js`
 * 
 */