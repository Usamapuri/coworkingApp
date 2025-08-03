import express from 'express';
import { registerRoutes } from './routes.js';

// CRITICAL DEBUG - Server starting
console.log('🚨 CRITICAL DEBUG - SERVER INDEX.TS LOADED');
console.log('🚨 CRITICAL DEBUG - SERVER INDEX.TS LOADED');

const app = express();

// Add JSON body parser middleware
app.use(express.json());

// Add URL-encoded body parser middleware for form data
app.use(express.urlencoded({ extended: true }));

// Initialize server
async function initializeServer() {
  // Register all routes
  const server = await registerRoutes(app);
  
  // Start server for both development and production (for Railway deployment)
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
  
  return server;
}

// Initialize the server
initializeServer().catch(console.error);

// For Vercel serverless functions
export default app;
