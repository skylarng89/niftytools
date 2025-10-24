import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Service URLs from environment variables
const TEXT_TOOLS_SERVICE = process.env.TEXT_TOOLS_SERVICE_URL || 'http://localhost:3001';

// Health check
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// Route to Text Tools Service
app.use(
  '/api/text-tools',
  createProxyMiddleware({
    target: TEXT_TOOLS_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/text-tools': '', // Remove /api/text-tools prefix when forwarding
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info(`Proxying request`, {
        method: req.method,
        url: req.originalUrl,
        target: `${TEXT_TOOLS_SERVICE}${req.path}`
      });
      
      // Re-stream parsed body for POST/PUT requests
      if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      logger.error('Proxy error', { error: err.message, stack: err.stack });
      res.status(502).json({
        error: 'Service unavailable',
        message: 'Unable to reach the text-tools service',
      });
    },
  })
);

// Fallback route
app.use('*', (req, res) => {
  logger.warn('Route not found', { url: req.originalUrl });
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`📡 Text Tools Service: ${TEXT_TOOLS_SERVICE}`);
});
