/**
 * CSV Export utilities for text tools
 */
export class CsvExporter {
  /**
   * Convert sorted text to CSV format
   */
  static textToCSV(text: string, options: { 
    includeLineNumbers?: boolean
    includeOriginalOrder?: boolean
  } = {}): string {
    const lines = text.split('\n')
    const headers: string[] = []
    const rows: string[][] = []
    
    // Build headers
    if (options.includeLineNumbers) {
      headers.push('Line Number')
    }
    if (options.includeOriginalOrder) {
      headers.push('Original Order')
    }
    headers.push('Text')
    
    // Build rows
    lines.forEach((line, index) => {
      const row: string[] = []
      
      if (options.includeLineNumbers) {
        row.push((index + 1).toString())
      }
      if (options.includeOriginalOrder) {
        row.push((index + 1).toString()) // This would be the original position in a real implementation
      }
      row.push(this.escapeCsvValue(line))
      
      rows.push(row)
    })
    
    // Combine headers and rows
    const csvLines = [headers.join(','), ...rows.map(row => row.join(','))]
    return csvLines.join('\n')
  }
  
  /**
   * Escape CSV values (handle quotes, commas, newlines)
   */
  private static escapeCsvValue(value: string): string {
    // If the value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }
  
  /**
   * Create comparison CSV between original and sorted text
   */
  static createComparisonCSV(originalText: string, sortedText: string, method: string): string {
    const originalLines = originalText.split('\n')
    const sortedLines = sortedText.split('\n')
    
    const headers = ['Line Number', 'Original Text', 'Sorted Text', 'Sort Method']
    const rows: string[][] = []
    
    const maxLines = Math.max(originalLines.length, sortedLines.length)
    
    for (let i = 0; i < maxLines; i++) {
      const row = [
        (i + 1).toString(),
        this.escapeCsvValue(originalLines[i] || ''),
        this.escapeCsvValue(sortedLines[i] || ''),
        i === 0 ? method : '' // Only show method on first row
      ]
      rows.push(row)
    }
    
    const csvLines = [headers.join(','), ...rows.map(row => row.join(','))]
    return csvLines.join('\n')
  }
}