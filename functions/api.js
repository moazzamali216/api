import express from 'express';
import ServerlessHttp from 'serverless-http';
import fs from 'fs';
import path from 'path';

const app = express();

// Enable Express to parse JSON bodies
app.use(express.json());

// Define a path to store the message (optional: you can also store in a database)
const messageFilePath = path.join(__dirname, 'message.json');

// Middleware to set CORS headers
app.use((req, res, next) => {
  const allowedOrigin = 'http://localhost:3000';  // Your React app origin (can be 'https://your-frontend.com' for production)

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);  // Allow requests from localhost
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow these methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow specific headers like Content-Type

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();  // Return No Content for OPTIONS requests (CORS preflight)
  }
  next();
});

// Function to get the message from the file (if it exists)
const getMessage = () => {
  if (fs.existsSync(messageFilePath)) {
    const data = fs.readFileSync(messageFilePath, 'utf8');
    return JSON.parse(data).message;
  }
  return 'hello world!';  // Default message if the file doesn't exist
};

// Endpoint to get the current message
app.get('/.netlify/functions/api', (req, res) => {
  const message = getMessage();
  return res.json({ message });
});

// Endpoint to update the message
app.post('/.netlify/functions/api', (req, res) => {
  const { message } = req.body;

  // Ensure the message is provided
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Save the new message to the file
  try {
    fs.writeFileSync(messageFilePath, JSON.stringify({ message }));
    return res.status(200).json({ message: 'Message updated successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ error: 'Failed to update message' });
  }
});

// Wrap the Express app with ServerlessHttp to handle Lambda functions
const handler = ServerlessHttp(app);

// Export the handler to be used by Netlify
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
