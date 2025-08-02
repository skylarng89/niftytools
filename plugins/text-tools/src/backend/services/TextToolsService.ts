import { TextSorter } from '../sorting.js'
import type { SortTextBody } from '../routes.js'

export class TextToolsService {
  static async sortText(body: SortTextBody) {
    const { text, method, options = {} } = body
    
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string')
    }
    
    if (text.length > 1000000) { // 1MB limit
      throw new Error('Text is too large (max 1MB)')
    }
    
    const startTime = Date.now()
    
    // Sort the text
    const processedText = TextSorter.sort(text, method as any, options)
    
    const processingTime = Date.now() - startTime
    const stats = TextSorter.getStats(text, processedText)
    
    return {
      success: true,
      data: {
        originalText: text,
        processedText,
        method: method as any,
        options,
        processedAt: new Date().toISOString(),
        stats: {
          originalLines: stats.originalLines,
          processedLines: stats.processedLines,
          processingTime
        }
      },
      timestamp: new Date().toISOString()
    }
  }
}