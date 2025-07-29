// Common API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// File upload types
export interface FileUpload {
  filename: string
  mimetype: string
  size: number
  buffer: Buffer
}

export interface FileUploadResponse {
  id: string
  filename: string
  size: number
  mimetype: string
  uploadedAt: string
}

// Text processing types
export interface TextProcessingRequest {
  text: string
  method: string
  options?: Record<string, any>
}

export interface TextProcessingResponse {
  originalText: string
  processedText: string
  method: string
  options: Record<string, any>
  processedAt: string
  stats: {
    originalLines: number
    processedLines: number
    processingTime: number
  }
}

// Sort text specific types
export type SortMethod = 
  | 'alphabetical-asc'
  | 'alphabetical-desc'
  | 'natural-asc'
  | 'natural-desc'
  | 'length-asc'
  | 'length-desc'
  | 'reverse'
  | 'shuffle'

export interface SortTextRequest extends TextProcessingRequest {
  method: SortMethod
  options?: {
    caseSensitive?: boolean
    removeEmpty?: boolean
    removeDuplicates?: boolean
  }
}

export interface SortTextResponse extends TextProcessingResponse {
  method: SortMethod
}