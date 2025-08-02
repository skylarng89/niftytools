export class HealthModel {
  static getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '0.1.0'
    }
  }
  
  static getApiInfo() {
    return {
      name: 'NiftyTools API',
      version: '0.1.0',
      description: 'A collection of useful development utilities',
      endpoints: [
        '/health - Health check',
        '/api - API information',
        '/docs - API documentation'
      ]
    }
  }
}