import { CsvExporter } from '../utils/csv-export';
import type { ExportCsvBody } from '../types';

export class CsvExportService {
  static async generateCsv(body: ExportCsvBody) {
    const { originalText, processedText, method, format = 'simple', options = {} } = body;
    
    let csvContent: string;
    let filename: string;
    
    if (format === 'comparison') {
      csvContent = CsvExporter.createComparisonCSV(originalText, processedText, method);
      filename = `text-sort-comparison-${method}-${Date.now()}.csv`;
    } else {
      csvContent = CsvExporter.textToCSV(processedText, options);
      filename = `text-sort-${method}-${Date.now()}.csv`;
    }
    
    return { csvContent, filename };
  }
}
