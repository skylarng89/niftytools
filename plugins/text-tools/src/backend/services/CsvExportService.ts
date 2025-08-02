import { CsvExporter } from '../csv-export.js'

export class CsvExportService {
  static async generateCsv(body: any) {
    const { originalText, processedText, method, format = 'simple', options = {} } = body
    
    let csvContent: string
    let filename: string
    
    if (format === 'comparison') {
      csvContent = CsvExporter.createComparisonCSV(originalText, processedText, method)
      filename = `text-sort-comparison-${method}-${Date.now()}.csv`
    } else {
      csvContent = CsvExporter.textToCSV(processedText, options)
      filename = `text-sort-${method}-${Date.now()}.csv`
    }
    
    return { csvContent, filename }
  }
}