import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  }
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:3002']
})

await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
})

await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
})

await fastify.register(multipart, {
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
})

// Swagger documentation
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'NiftyTools API',
      description: 'API documentation for NiftyTools - A collection of useful development utilities',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
})

await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
})

// Health check endpoint
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '0.1.0',
  }
})

// Basic API info endpoint
fastify.get('/api', async () => {
  return {
    name: 'NiftyTools API',
    version: '0.1.0',
    description: 'A collection of useful development utilities',
    endpoints: [
      '/health - Health check',
      '/api - API information',
      '/docs - API documentation',
    ],
  }
})

// Register plugins
import { TextToolsPlugin } from '@niftytools/text-tools-plugin'

// Initialize and register text tools plugin
const textToolsPlugin = new TextToolsPlugin()
await textToolsPlugin.registerBackend(fastify, {})

fastify.log.info('All plugins registered successfully')

const start = async () => {
  try {
    const port = parseInt(process.env.API_PORT || '3000')
    const host = process.env.HOST || '0.0.0.0'
    
    await fastify.listen({ port, host })
    fastify.log.info(`🚀 Server running on http://${host}:${port}`)
    fastify.log.info(`📚 API docs available at http://${host}:${port}/docs`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()