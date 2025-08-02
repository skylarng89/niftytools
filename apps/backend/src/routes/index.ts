import express from 'express'
import { HealthController } from '../controllers/HealthController.js'

const healthRoutes = express.Router()

// Health check endpoint
healthRoutes.get('/health', HealthController.getHealth)

// API info endpoint
healthRoutes.get('/api', HealthController.getApiInfo)

export default healthRoutes