import { Request, Response } from 'express';
import { TextToolsService } from '../services/TextToolsService';
import { FileUploadService } from '../services/FileUploadService';
import { CsvExportService } from '../services/CsvExportService';
import logger from '../utils/logger';

export class TextToolsController {
  static async sortText(req: Request, res: Response) {
    try {
      logger.info('Sorting text requested', { algorithm: req.body.algorithm });
      const result = await TextToolsService.sortText(req.body);
      logger.info('Text sorting completed', { algorithm: req.body.algorithm, lines: result.data.stats.processedLines });
      res.json(result);
    } catch (error) {
      logger.error('Text sorting failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  static async uploadFile(req: Request, res: Response) {
    try {
      logger.info('File upload requested');
      const result = await FileUploadService.processUpload(req.file);
      logger.info('File upload processed', { filename: req.file?.originalname, size: req.file?.size });
      res.json(result);
    } catch (error) {
      logger.error('File upload failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  static async exportCsv(req: Request, res: Response) {
    try {
      logger.info('CSV export requested');
      const { csvContent, filename } = await CsvExportService.generateCsv(req.body);
      logger.info('CSV export generated', { filename, size: csvContent.length });
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } catch (error) {
      logger.error('CSV export failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
