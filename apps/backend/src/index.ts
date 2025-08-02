import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
const port = parseInt(process.env.API_PORT || '3000')
const host = process.env.HOST || '0.0.0.0'

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:3002']
}))

app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NiftyTools API',
      version: '0.1.0',
      description: 'API documentation for NiftyTools - A collection of useful development utilities'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Import routes
import healthRoutes from './routes/index.js'

// Register core routes
app.use('/', healthRoutes)

// Register plugins
import { TextToolsPlugin } from '@niftytools/text-tools-plugin'

// Initialize and register text tools plugin
const textToolsPlugin = new TextToolsPlugin()
textToolsPlugin.registerBackend(app, {})

console.log('All plugins registered successfully')

app.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`)
  console.log(`📚 API docs available at http://${host}:${port}/docs`)
})