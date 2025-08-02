import type { Express, Router } from 'express'

// Plugin system types
export interface PluginManifest {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  tags: string[]
  capabilities: PluginCapabilities
  endpoints: PluginEndpoint[]
  routes: PluginRoute[]
  configSchema: Record<string, PluginConfigField>
  dependencies: string[]
  hooks: PluginHooks
}

export interface PluginCapabilities {
  backend: boolean
  frontend: boolean
  database: boolean
  storage: boolean
}

export interface PluginEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  public: boolean
  permissions?: string[]
}

export interface PluginRoute {
  path: string
  name: string
  component: string
  title: string
  description: string
  public: boolean
  permissions?: string[]
}

export interface PluginConfigField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  default: any
  description: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: any[]
  }
}

export interface PluginHooks {
  onInstall?: string
  onEnable?: string
  onDisable?: string
  onUninstall?: string
  onRequest?: string
  onResponse?: string
}

// Plugin instance interface
export interface Plugin {
  manifest: PluginManifest
  registerBackend?: (app: Express | Router, config: PluginConfig) => void
  registerFrontend?: () => any
  install?: () => Promise<void>
  enable?: () => Promise<void>
  disable?: () => Promise<void>
  uninstall?: () => Promise<void>
}

export interface PluginConfig {
  [key: string]: any
}

// Plugin registry
export interface PluginRegistry {
  plugins: Map<string, Plugin>
  register(plugin: Plugin): void
  unregister(pluginId: string): void
  get(pluginId: string): Plugin | undefined
  getAll(): Plugin[]
  getByCategory(category: string): Plugin[]
}

// Plugin manager interface
export interface PluginManager {
  registry: PluginRegistry
  loadPlugin(pluginPath: string): Promise<Plugin>
  enablePlugin(pluginId: string): Promise<void>
  disablePlugin(pluginId: string): Promise<void>
  getPluginConfig(pluginId: string): PluginConfig
  setPluginConfig(pluginId: string, config: PluginConfig): Promise<void>
}