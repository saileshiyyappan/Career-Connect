import { logger as firebaseLogger } from 'firebase-functions';

const SENSITIVE_KEY_PATTERNS = [
  /key/i,
  /secret/i,
  /token/i,
  /auth/i,
  /password/i,
  /credential/i,
  /bearer/i,
];

/**
 * Recursively redacts sensitive keys from log objects.
 */
export function sanitizeLogData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    // Redact bearer tokens or url key params
    return data
      .replace(/(bearer\s+)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]')
      .replace(/(key=)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]')
      .replace(/(token=)[a-zA-Z0-9_\-\.]+/gi, '$1[REDACTED]');
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item));
  }

  if (typeof data === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
      if (isSensitive) {
        sanitizedObj[key] = '[REDACTED]';
      } else {
        sanitizedObj[key] = sanitizeLogData(value);
      }
    }
    return sanitizedObj;
  }

  return data;
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    const sanitized = context ? (sanitizeLogData(context) as Record<string, unknown>) : undefined;
    if (sanitized) {
      firebaseLogger.info(message, sanitized);
    } else {
      firebaseLogger.info(message);
    }
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    const sanitized = context ? (sanitizeLogData(context) as Record<string, unknown>) : undefined;
    if (sanitized) {
      firebaseLogger.warn(message, sanitized);
    } else {
      firebaseLogger.warn(message);
    }
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : { rawError: String(error) };
    const merged = { ...errorDetails, ...(context || {}) };
    firebaseLogger.error(message, sanitizeLogData(merged) as Record<string, unknown>);
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    const sanitized = context ? (sanitizeLogData(context) as Record<string, unknown>) : undefined;
    if (sanitized) {
      firebaseLogger.debug(message, sanitized);
    } else {
      firebaseLogger.debug(message);
    }
  },
};
