import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/math-problem-generator';

// ===========================
// Middleware Configuration
// ===========================

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression middleware
app.use(compression());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ===========================
// MongoDB Connection
// ===========================

const connectDatabase = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDatabase, 5000);
  }
};

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✓ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ Mongoose disconnected from MongoDB');
});

// ===========================
// Health Check Endpoint
// ===========================

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  mongodb: {
    status: 'connected' | 'disconnected';
    message: string;
  };
  environment: string;
}

app.get('/health', (req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const mongoMessage = 
    mongoStatus === 'connected' 
      ? 'MongoDB connection is active' 
      : 'MongoDB connection is inactive';

  const healthResponse: HealthCheckResponse = {
    status: mongoStatus === 'connected' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      status: mongoStatus as 'connected' | 'disconnected',
      message: mongoMessage,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  const statusCode = mongoStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthResponse);
});

// ===========================
// API Routes Placeholder
// ===========================

// TODO: Import and mount API routes here
// app.use('/api/problems', problemRoutes);
// app.use('/api/users', userRoutes);

// ===========================
// Error Handling Middleware
// ===========================

// 404 Not Found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  console.error('Error:', {
    message: err.message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ...(isDevelopment && { stack: err.stack }),
  });

  // Mongoose validation error handling
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Duplicate field value entered',
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose cast error handling
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid data format',
      timestamp: new Date().toISOString(),
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack }),
  });
});

// ===========================
// Server Startup
// ===========================

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║  Math Problem Generator API Server   ║
╚══════════════════════════════════════╝
Server running at: http://localhost:${PORT}
Health Check: http://localhost:${PORT}/health
Environment: ${process.env.NODE_ENV || 'development'}
Database: ${MONGODB_URI}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;
