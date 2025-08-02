import { Request, Response } from 'express'
import { TextToolsService } from '../services/TextToolsService.js'
import { FileUploadService } from '../services/FileUploadService.js'
import { CsvExportService } from '../services/CsvExportService.js'
import { Express } from 'express-serve-static-core'

// Extend Express Request type to include file property
interface FileUploadRequest extends Request {
  file?: Express.Multer.File
}

export class TextToolsController {
  static async sortText(req: Request, res: Response) {
    try {
      const result = await TextToolsService.sortText(req.body)
      res.json(result)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  }
  
  static async uploadFile(req: FileUploadRequest, res: Response) {
    try {
      const result = await FileUploadService.processUpload(req.file)
      res.json(result)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  }
  
  static async exportCsv(req: Request, res: Response) {
    try {
      const { csvContent, filename } = await CsvExportService.generateCsv(req.body)
      res.header('Content-Type', 'text/csv')
      res.header('Content-Disposition', `attachment; filename="${filename}"`)
      res.send(csvContent)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  }
}