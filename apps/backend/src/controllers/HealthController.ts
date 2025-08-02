import { Request, Response } from 'express'
import { HealthService } from '../services/HealthService.js'

export class HealthController {
  static getHealth(req: Request, res: Response) {
    const healthData = HealthService.getHealthStatus()
    res.json(healthData)
  }
  
  static getApiInfo(req: Request, res: Response) {
    const apiInfo = HealthService.getApiInformation()
    res.json(apiInfo)
  }
}