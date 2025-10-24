import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    status: 'ok',
    service: 'text-tools-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/', routes);

// Error handling
app.use((req, res) => {
  logger.warn('Route not found', { url: req.originalUrl });
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  logger.info(`🔧 Text Tools Service running on port ${PORT}`);
});
