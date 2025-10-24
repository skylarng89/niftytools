import fs from 'fs';
import path from 'path';

// Get log level from environment variable, default to 'INFO'
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

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

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../../logs/gateway');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get current date string for log file naming
const getCurrentDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

// Get current timestamp for log entries
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Get log file path for current date
const getLogFilePath = (): string => {
  return path.join(logsDir, `gateway-${getCurrentDate()}.log`);
};

// Clean up old log files (keep last 7 days)
const cleanupOldLogs = (): void => {
  try {
    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
      if (file.startsWith('gateway-') && file.endsWith('.log')) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 7 days
        if (now - stats.mtime.getTime() > sevenDaysInMillis) {
          fs.unlinkSync(filePath);
          console.log(`[LOGGER] Deleted old log file: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error('[LOGGER] Failed to cleanup old logs:', error);
  }
};

// Write log entry to file
const writeLog = (level: string, message: string, meta?: any): void => {
  // Check if this log level should be logged
  if (!shouldLog(level)) return;
  
  const timestamp = getCurrentTimestamp();
  const logEntry = meta 
    ? `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}\n`
    : `${timestamp} [${level}] ${message}\n`;
  
  const logFilePath = getLogFilePath();
  
  try {
    // Clean up old logs once a day (check if it's a new day)
    const currentDate = getCurrentDate();
    const dateMarkerFile = path.join(logsDir, `.last_cleanup`);
    let lastCleanupDate = '';
    
    if (fs.existsSync(dateMarkerFile)) {
      lastCleanupDate = fs.readFileSync(dateMarkerFile, 'utf8').trim();
    }
    
    if (lastCleanupDate !== currentDate) {
      cleanupOldLogs();
      fs.writeFileSync(dateMarkerFile, currentDate);
    }
    
    fs.appendFileSync(logFilePath, logEntry);
  } catch (error) {
    console.error('[LOGGER] Failed to write to log file:', error);
  }
};

// Logger interface
export interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// Logger implementation
class FileLogger implements Logger {
  info(message: string, meta?: any): void {
    if (shouldLog('INFO')) {
      writeLog('INFO', message, meta);
      console.log(`[INFO] ${message}`, meta || '');
    }
  }
  
  warn(message: string, meta?: any): void {
    if (shouldLog('WARN')) {
      writeLog('WARN', message, meta);
      console.warn(`[WARN] ${message}`, meta || '');
    }
  }
  
  error(message: string, meta?: any): void {
    if (shouldLog('ERROR')) {
      writeLog('ERROR', message, meta);
      console.error(`[ERROR] ${message}`, meta || '');
    }
  }
  
  debug(message: string, meta?: any): void {
    if (shouldLog('DEBUG')) {
      writeLog('DEBUG', message, meta);
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  }
}

// Export singleton instance
export default new FileLogger();
