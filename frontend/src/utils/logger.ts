// Get log level from environment variable, default to 'INFO'
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'INFO';

// Log levels in order of severity
const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

// Check if a log level should be logged based on the current LOG_LEVEL
const shouldLog = (level: string): boolean => {
  const currentLevelIndex = LOG_LEVELS.indexOf(LOG_LEVEL as any);
  const messageLevelIndex = LOG_LEVELS.indexOf(level as any);
  
  // If LOG_LEVEL is not a valid level, log everything
  if (currentLevelIndex === -1) return true;
  
  // Log if message level is at or above current level
  return messageLevelIndex >= currentLevelIndex;
};

// Logger interface
export interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// Logger implementation
class FrontendLogger implements Logger {
  private async sendLog(level: string, message: string, meta?: any): Promise<void> {
    // Check if this log level should be logged
    if (!shouldLog(level)) return;
    
    try {
      // In a browser environment, send logs to the backend
      await fetch('/api/text-tools/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, message, meta }),
      });
    } catch (error) {
      // If we can't send to backend, just log to console
      console.error('Failed to send log to backend:', error);
    }
  }
  
  info(message: string, meta?: any): void {
    if (shouldLog('INFO')) {
      console.log(`[INFO] ${message}`, meta || '');
      this.sendLog('INFO', message, meta);
    }
  }
  
  warn(message: string, meta?: any): void {
    if (shouldLog('WARN')) {
      console.warn(`[WARN] ${message}`, meta || '');
      this.sendLog('WARN', message, meta);
    }
  }
  
  error(message: string, meta?: any): void {
    if (shouldLog('ERROR')) {
      console.error(`[ERROR] ${message}`, meta || '');
      this.sendLog('ERROR', message, meta);
    }
  }
  
  debug(message: string, meta?: any): void {
    if (shouldLog('DEBUG')) {
      console.debug(`[DEBUG] ${message}`, meta || '');
      this.sendLog('DEBUG', message, meta);
    }
  }
}

// Export singleton instance
export default new FrontendLogger();
