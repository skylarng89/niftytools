import type { PluginManifest } from '@niftytools/shared/types'

export const textToolsManifest: PluginManifest = {
  id: 'text-tools',
  name: 'Text Tools',
  description: 'A collection of text manipulation and processing tools',
  version: '0.1.0',
  author: 'NiftyTools Team',
  category: 'text',
  tags: ['text', 'sorting', 'manipulation', 'processing'],
  
  // Plugin capabilities
  capabilities: {
    backend: true,
    frontend: true,
    database: false,
    storage: false,
  },
  
  // API endpoints this plugin provides
  endpoints: [
    {
      method: 'POST',
      path: '/api/text-tools/sort',
      description: 'Sort text using various methods',
      public: true,
    },
    {
      method: 'POST',
      path: '/api/text-tools/upload',
      description: 'Upload text file for processing',
      public: true,
    },
    {
      method: 'GET',
      path: '/api/text-tools/export/:id',
      description: 'Export processed text as CSV',
      public: true,
    },
  ],
  
  // Frontend routes this plugin provides
  routes: [
    {
      path: '/tools/text/sort',
      name: 'sort-text',
      component: 'SortText',
      title: 'Sort Text',
      description: 'Sort text in various orders and formats',
      public: true,
    },
  ],
  
  // Configuration schema for this plugin
  configSchema: {
    maxFileSize: {
      type: 'number',
      default: 10485760, // 10MB
      description: 'Maximum file size for uploads in bytes',
    },
    allowedFileTypes: {
      type: 'array',
      default: ['text/plain', 'text/csv'],
      description: 'Allowed MIME types for file uploads',
    },
    maxTextLength: {
      type: 'number',
      default: 1000000, // 1M characters
      description: 'Maximum text length for processing',
    },
  },
  
  // Dependencies on other plugins
  dependencies: [],
  
  // Plugin lifecycle hooks
  hooks: {
    onInstall: 'onInstallHook',
    onEnable: 'onEnableHook',
    onDisable: 'onDisableHook',
    onUninstall: 'onUninstallHook',
  },
}