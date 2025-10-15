import { TextSorter } from '../utils/sorting';
import type { SortTextBody } from '../types';

export class TextToolsService {
  static async sortText(body: SortTextBody) {
    const { text, method, options = {} } = body;
    
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }
    
    if (text.length > 10000000) { // 10MB limit
      throw new Error('Text is too large (max 10MB)');
    }
    
    const startTime = Date.now();
    
    // Sort the text
    const processedText = TextSorter.sort(text, method, options);
    
    const processingTime = Date.now() - startTime;
    const stats = TextSorter.getStats(text, processedText);
    
    return {
      success: true,
      data: {
        originalText: text,
        processedText,
        method,
        options,
        processedAt: new Date().toISOString(),
        stats: {
          originalLines: stats.originalLines,
          processedLines: stats.processedLines,
          processingTime
        }
      },
      timestamp: new Date().toISOString()
    };
  }
}
