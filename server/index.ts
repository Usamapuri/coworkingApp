import express from 'express';
import { registerRoutes } from './routes.js';

const app = express();

// Add JSON body parser middleware
app.use(express.json());

// Add URL-encoded body parser middleware for form data
app.use(express.urlencoded({ extended: true }));

// Initialize server
async function initializeServer() {
  // Register all routes
  const server = await registerRoutes(app);
  
  // For local development
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
  
  return server;
}

// Initialize the server
initializeServer().catch(console.error);

// For Vercel serverless functions
export default app;
