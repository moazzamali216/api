import express from 'express';
import ServerlessHttp from 'serverless-http';

const app = express();

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins (or specify 'http://localhost:3000' for stricter control)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow these methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow specific headers like Content-Type
  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();  // Return a No Content response for OPTIONS requests
  }
  next();
});

// Your main API endpoint
app.get('/.netlify/functions/api', (req, res) => {
  return res.json({
    message: 'hello world!'
  });
});

// Wrap the Express app with ServerlessHttp to handle Lambda functions
const handler = ServerlessHttp(app);

// Export the handler to be used by Netlify
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
