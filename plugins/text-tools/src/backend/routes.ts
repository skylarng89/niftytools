import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { SortTextResponse, ApiResponse } from '@niftytools/shared/types'
import { TextSorter } from './sorting.js'
import { CsvExporter } from './csv-export.js'

export interface SortTextBody {
  text: string
  method: string
  options?: {
    caseSensitive?: boolean
    removeEmpty?: boolean
    removeDuplicates?: boolean
  }
}

export async function registerTextToolsRoutes(fastify: FastifyInstance) {
  // Sort text endpoint
  fastify.post<{
    Body: SortTextBody
  }>('/text-tools/sort', {
    schema: {
      body: {
        type: 'object',
        required: ['text', 'method'],
        properties: {
          text: { type: 'string', description: 'Text to sort' },
          method: { 
            type: 'string',
            enum: [
              'alphabetical-asc',
              'alphabetical-desc', 
              'natural-asc',
              'natural-desc',
              'length-asc',
              'length-desc',
              'reverse',
              'shuffle'
            ],
            description: 'Sorting method to use'
          },
          options: {
            type: 'object',
            properties: {
              caseSensitive: { type: 'boolean', default: false },
              removeEmpty: { type: 'boolean', default: false },
              removeDuplicates: { type: 'boolean', default: false }
            }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                originalText: { type: 'string' },
                processedText: { type: 'string' },
                method: { type: 'string' },
                options: { type: 'object' },
                processedAt: { type: 'string' },
                stats: {
                  type: 'object',
                  properties: {
                    originalLines: { type: 'number' },
                    processedLines: { type: 'number' },
                    processingTime: { type: 'number' }
                  }
                }
              }
            },
            timestamp: { type: 'string' }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: SortTextBody }>, reply: FastifyReply) => {
    try {
      const { text, method, options = {} } = request.body
      
      // Validate input
      if (!text || typeof text !== 'string') {
        return reply.code(400).send({
          success: false,
          error: 'Text is required and must be a string',
          timestamp: new Date().toISOString()
        })
      }
      
      if (text.length > 1000000) { // 1MB limit
        return reply.code(400).send({
          success: false,
          error: 'Text is too large (max 1MB)',
          timestamp: new Date().toISOString()
        })
      }
      
      const startTime = Date.now()
      
      // Sort the text
      const processedText = TextSorter.sort(text, method as any, options)
      
      const processingTime = Date.now() - startTime
      const stats = TextSorter.getStats(text, processedText)
      
      const response: ApiResponse<SortTextResponse> = {
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
      
      fastify.log.info(`Text sorted using method '${method}' in ${processingTime}ms`)
      
      return reply.send(response)
    } catch (error) {
      fastify.log.error(error, 'Error sorting text')
      return reply.code(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  })
  
  // File upload endpoint
  fastify.post('/text-tools/upload', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                filename: { type: 'string' },
                size: { type: 'number' },
                mimetype: { type: 'string' },
                content: { type: 'string' }
              }
            },
            timestamp: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply) => {
    try {
      const data = await (request as any).file()
      
      if (!data) {
        return reply.code(400).send({
          success: false,
          error: 'No file uploaded',
          timestamp: new Date().toISOString()
        })
      }
      
      // Validate file type
      const allowedTypes = ['text/plain', 'text/csv', 'application/csv']
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.code(400).send({
          success: false,
          error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`,
          timestamp: new Date().toISOString()
        })
      }
      
      // Read file content
      const buffer = await data.toBuffer()
      const content = buffer.toString('utf-8')
      
      if (content.length > 1000000) { // 1MB limit
        return reply.code(400).send({
          success: false,
          error: 'File is too large (max 1MB)',
          timestamp: new Date().toISOString()
        })
      }
      
      fastify.log.info(`File uploaded: ${data.filename} (${data.mimetype}, ${buffer.length} bytes)`)
      
      return reply.send({
        success: true,
        data: {
          filename: data.filename,
          size: buffer.length,
          mimetype: data.mimetype,
          content
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      fastify.log.error(error, 'Error uploading file')
      return reply.code(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  })
  
  // Export CSV endpoint
  fastify.post<{
    Body: {
      originalText: string
      processedText: string
      method: string
      format?: 'simple' | 'comparison'
      options?: {
        includeLineNumbers?: boolean
        includeOriginalOrder?: boolean
      }
    }
  }>('/text-tools/export/csv', {
    schema: {
      body: {
        type: 'object',
        required: ['originalText', 'processedText', 'method'],
        properties: {
          originalText: { type: 'string' },
          processedText: { type: 'string' },
          method: { type: 'string' },
          format: { type: 'string', enum: ['simple', 'comparison'], default: 'simple' },
          options: {
            type: 'object',
            properties: {
              includeLineNumbers: { type: 'boolean', default: true },
              includeOriginalOrder: { type: 'boolean', default: false }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { originalText, processedText, method, format = 'simple', options = {} } = request.body
      
      let csvContent: string
      let filename: string
      
      if (format === 'comparison') {
        csvContent = CsvExporter.createComparisonCSV(originalText, processedText, method)
        filename = `text-sort-comparison-${method}-${Date.now()}.csv`
      } else {
        csvContent = CsvExporter.textToCSV(processedText, options)
        filename = `text-sort-${method}-${Date.now()}.csv`
      }
      
      reply.header('Content-Type', 'text/csv')
      reply.header('Content-Disposition', `attachment; filename="${filename}"`)
      
      return reply.send(csvContent)
    } catch (error) {
      fastify.log.error(error, 'Error exporting CSV')
      return reply.code(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      })
    }
  })
}