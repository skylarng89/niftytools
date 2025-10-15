import { Request, Response } from 'express';
import { TextToolsService } from '../services/TextToolsService';
import { FileUploadService } from '../services/FileUploadService';
import { CsvExportService } from '../services/CsvExportService';

export class TextToolsController {
  static async sortText(req: Request, res: Response) {
    try {
      const result = await TextToolsService.sortText(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  static async uploadFile(req: Request, res: Response) {
    try {
      const result = await FileUploadService.processUpload(req.file);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  static async exportCsv(req: Request, res: Response) {
    try {
      const { csvContent, filename } = await CsvExportService.generateCsv(req.body);
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
