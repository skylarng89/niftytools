import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiResponse, SortTextRequest, SortTextResponse } from '@niftytools/shared'

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  // Text Tools API
  async sortText(request: SortTextRequest): Promise<ApiResponse<SortTextResponse>> {
    const response = await this.client.post('/text-tools/sort', request)
    return response.data
  }

  async uploadFile(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await this.client.post('/text-tools/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async exportCsv(data: {
    originalText: string
    processedText: string
    method: string
    format?: 'simple' | 'comparison'
    options?: {
      includeLineNumbers?: boolean
      includeOriginalOrder?: boolean
    }
  }): Promise<Blob> {
    const response = await this.client.post('/text-tools/export/csv', data, {
      responseType: 'blob'
    })
    return response.data
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health')
    return response.data
  }
}

// Default instance
export const apiClient = new ApiClient()

export default apiClient