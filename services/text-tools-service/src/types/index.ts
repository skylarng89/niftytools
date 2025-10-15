export type SortMethod =
  | 'alphabetical-asc'
  | 'alphabetical-desc'
  | 'natural-asc'
  | 'natural-desc'
  | 'length-asc'
  | 'length-desc'
  | 'reverse'
  | 'shuffle';

export interface SortOptions {
  caseSensitive?: boolean;
  removeEmpty?: boolean;
  removeDuplicates?: boolean;
}

export interface SortTextBody {
  text: string;
  method: SortMethod;
  options?: SortOptions;
}

export interface ExportCsvBody {
  originalText: string;
  processedText: string;
  method: SortMethod;
  format?: 'simple' | 'comparison';
  options?: {
    includeLineNumbers?: boolean;
    includeOriginalOrder?: boolean;
  };
}
