import type { Express, Router } from 'express'
import type { Plugin, PluginConfig } from '@niftytools/shared/types'
import { textToolsManifest } from '../plugin.manifest.js'
import { registerTextToolsRoutes } from './routes.js'

export class TextToolsPlugin implements Plugin {
  manifest = textToolsManifest
  
  registerBackend(app: Express | Router, _config: PluginConfig): void {
    // Register all text tools routes directly on the app
    registerTextToolsRoutes(app as Router)
    
    console.log(`Text Tools plugin registered with ${this.manifest.endpoints.length} endpoints`)
  }
  
  async install(): Promise<void> {
    // Plugin installation logic
    console.log('Installing Text Tools plugin...')
  }
  
  async enable(): Promise<void> {
    // Plugin enable logic
    console.log('Enabling Text Tools plugin...')
  }
  
  async disable(): Promise<void> {
    // Plugin disable logic
    console.log('Disabling Text Tools plugin...')
  }
  
  async uninstall(): Promise<void> {
    // Plugin uninstall logic
    console.log('Uninstalling Text Tools plugin...')
  }
}

export default TextToolsPlugin