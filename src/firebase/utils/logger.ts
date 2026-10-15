type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev = import.meta.env.DEV;

  private log(level: LogLevel, message: string, ...args: unknown[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (this.isDev || level === 'error') {
      switch (level) {
        case 'info':
          console.info(prefix, message, ...args);
          break;
        case 'warn':
          console.warn(prefix, message, ...args);
          break;
        case 'error':
          console.error(prefix, message, ...args);
          this.reportToCrashReporting(message, args);
          break;
        case 'debug':
          console.debug(prefix, message, ...args);
          break;
      }
    }
  }

  public info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
  }

  public warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  public error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }

  public debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }

  // Future Crash Reporting (e.g. Firebase Crashlytics or Sentry) placeholder
  private reportToCrashReporting(message: string, context: unknown[]) {
    // Placeholder for enterprise crash reporting integration
    if (!this.isDev) {
      // e.g., sendReport({ message, context });
    }
  }
}

export const logger = new Logger();
