import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { ClientRequest, IncomingMessage } from 'http';
import { Socket } from 'net';
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
const TEXT_TOOLS_PYTHON_URL = process.env.TEXT_TOOLS_PYTHON_URL || 'http://localhost:3002';

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
    target: TEXT_TOOLS_PYTHON_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/text-tools': '', // Remove /api/text-tools prefix when forwarding
    },
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, res: Response) => {
        const expressReq = req as Request;
        logger.info(`Proxying request`, {
          method: expressReq.method,
          url: expressReq.originalUrl,
          target: `${TEXT_TOOLS_PYTHON_URL}${expressReq.path}`,
          backend: 'python'
        });
        
        // Re-stream parsed body for POST/PUT requests
        if (expressReq.body && (expressReq.method === 'POST' || expressReq.method === 'PUT')) {
          const bodyData = JSON.stringify(expressReq.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (err: Error, req: IncomingMessage, res: Response | Socket) => {
        logger.error('Proxy error', { error: err.message, stack: err.stack });
        // Only send JSON response if res is an Express Response (not a Socket)
        if ('status' in res && typeof res.status === 'function') {
          res.status(502).json({
            error: 'Service unavailable',
            message: 'Unable to reach the text-tools service',
          });
        }
      },
    },
  })
);

// Fallback route - Express 5 doesn't support '*', use a catch-all middleware instead
app.use((req, res) => {
  logger.warn('Route not found', { url: req.originalUrl });
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`🐍 Python Backend: ${TEXT_TOOLS_PYTHON_URL}`);
});
