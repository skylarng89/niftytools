import { HealthModel } from '../models/HealthModel.js'

export class HealthService {
  static getHealthStatus() {
    return HealthModel.getStatus()
  }
  
  static getApiInformation() {
    return HealthModel.getApiInfo()
  }
}