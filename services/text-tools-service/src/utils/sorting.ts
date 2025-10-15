import type { SortMethod, SortOptions } from '../types';

/**
 * Sort text lines using various methods
 */
export class TextSorter {
  static sort(text: string, method: SortMethod, options: SortOptions = {}): string {
    let lines = text.split('\n');
    
    // Apply preprocessing options
    if (options.removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }
    
    if (options.removeDuplicates) {
      lines = [...new Set(lines)];
    }
    
    // Apply sorting method
    switch (method) {
      case 'alphabetical-asc':
        lines = this.sortAlphabetical(lines, 'asc', options.caseSensitive);
        break;
      case 'alphabetical-desc':
        lines = this.sortAlphabetical(lines, 'desc', options.caseSensitive);
        break;
      case 'natural-asc':
        lines = this.sortNatural(lines, 'asc', options.caseSensitive);
        break;
      case 'natural-desc':
        lines = this.sortNatural(lines, 'desc', options.caseSensitive);
        break;
      case 'length-asc':
        lines = this.sortByLength(lines, 'asc');
        break;
      case 'length-desc':
        lines = this.sortByLength(lines, 'desc');
        break;
      case 'reverse':
        lines = lines.reverse();
        break;
      case 'shuffle':
        lines = this.shuffle(lines);
        break;
      default:
        throw new Error(`Unknown sort method: ${method}`);
    }
    
    return lines.join('\n');
  }
  
  /**
   * Alphabetical sorting
   */
  private static sortAlphabetical(lines: string[], direction: 'asc' | 'desc', caseSensitive = false): string[] {
    return lines.sort((a, b) => {
      const strA = caseSensitive ? a : a.toLowerCase();
      const strB = caseSensitive ? b : b.toLowerCase();
      
      if (direction === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  }
  
  /**
   * Natural sorting (handles numbers within strings properly)
   * e.g., "item10" comes after "item2"
   */
  private static sortNatural(lines: string[], direction: 'asc' | 'desc', caseSensitive = false): string[] {
    return lines.sort((a, b) => {
      const strA = caseSensitive ? a : a.toLowerCase();
      const strB = caseSensitive ? b : b.toLowerCase();
      
      const result = strA.localeCompare(strB, undefined, {
        numeric: true,
        sensitivity: caseSensitive ? 'case' : 'base'
      });
      
      return direction === 'asc' ? result : -result;
    });
  }
  
  /**
   * Sort by character length
   */
  private static sortByLength(lines: string[], direction: 'asc' | 'desc'): string[] {
    return lines.sort((a, b) => {
      const lengthDiff = a.length - b.length;
      if (lengthDiff === 0) {
        // If lengths are equal, sort alphabetically as secondary sort
        return a.localeCompare(b);
      }
      return direction === 'asc' ? lengthDiff : -lengthDiff;
    });
  }
  
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private static shuffle(lines: string[]): string[] {
    const shuffled = [...lines];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Get statistics about the sorting operation
   */
  static getStats(originalText: string, processedText: string) {
    const originalLines = originalText.split('\n');
    const processedLines = processedText.split('\n');
    
    return {
      originalLines: originalLines.length,
      processedLines: processedLines.length,
      originalCharacters: originalText.length,
      processedCharacters: processedText.length,
      removedLines: originalLines.length - processedLines.length,
    };
  }
}
