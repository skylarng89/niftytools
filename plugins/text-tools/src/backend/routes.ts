import express from 'express'
import { TextToolsController } from './controllers/TextToolsController.js'
import multer from 'multer'

const upload = multer()

export interface SortTextBody {
  text: string
  method: string
  options?: {
    caseSensitive?: boolean
    removeEmpty?: boolean
    removeDuplicates?: boolean
  }
}

export function registerTextToolsRoutes(router: express.Router) {
  // Sort text endpoint
  router.post('/text-tools/sort', TextToolsController.sortText)
  
  // File upload endpoint
  router.post('/text-tools/upload', upload.single('file'), TextToolsController.uploadFile)
  
  // Export CSV endpoint
  router.post('/text-tools/export/csv', TextToolsController.exportCsv)
}