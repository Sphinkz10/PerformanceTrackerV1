/**
 * Sistema de Logging Centralizado - PerformTrack
 * 
 * Features:
 * - Níveis de log: debug, info, warn, error
 * - Formatação consistente
 * - Contexto adicional (timestamp, módulo)
 * - Performance tracking
 * 
 * TODO: Re-integrar Sentry usando @sentry/react (removido @sentry/nextjs por incompatibilidade com Vite)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  module?: string;
  userId?: string;
  workspaceId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private isProduction = import.meta.env.PROD;

  private enabledLevels: Set<LogLevel> = new Set(['info', 'warn', 'error']);

  constructor() {
    // Em desenvolvimento, habilita todos os níveis
    if (this.isDevelopment) {
      this.enabledLevels.add('debug');
    }
  }

  /**
   * Formata mensagem de log com timestamp e contexto
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const module = context?.module ? `[${context.module}]` : '';
    return `[${timestamp}] ${level.toUpperCase()} ${module} ${message}`;
  }

  /**
   * Verifica se deve logar este nível
   */
  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.has(level);
  }

  /**
   * LOG DEBUG - Informações detalhadas para debugging
   */
  debug(message: string, context?: LogContext) {
    if (!this.shouldLog('debug')) return;

    console.log(
      `%c${this.formatMessage('debug', message, context)}`,
      'color: #64748b; font-size: 11px;',
      context || ''
    );
  }

  /**
   * LOG INFO - Informações gerais do fluxo da aplicação
   */
  info(message: string, context?: LogContext) {
    if (!this.shouldLog('info')) return;

    console.log(
      `%c${this.formatMessage('info', message, context)}`,
      'color: #0ea5e9; font-weight: 600;',
      context || ''
    );
  }

  /**
   * LOG WARN - Avisos que não quebram a aplicação
   */
  warn(message: string, context?: LogContext) {
    if (!this.shouldLog('warn')) return;

    console.warn(
      `%c${this.formatMessage('warn', message, context)}`,
      'color: #f59e0b; font-weight: 600;',
      context || ''
    );
  }

  /**
   * LOG ERROR - Erros que precisam atenção
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (!this.shouldLog('error')) return;

    console.error(
      `%c${this.formatMessage('error', message, context)}`,
      'color: #ef4444; font-weight: 700;',
      error,
      context || ''
    );
  }

  /**
   * Performance tracking - mede tempo de execução
   */
  performance(label: string, callback: () => void | Promise<void>) {
    if (!this.isDevelopment) {
      return callback();
    }

    const start = performance.now();
    const result = callback();

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        this.debug(`⚡ ${label}`, { duration: `${duration.toFixed(2)}ms` });
      });
    }

    const duration = performance.now() - start;
    this.debug(`⚡ ${label}`, { duration: `${duration.toFixed(2)}ms` });
    return result;
  }

  /**
   * Agrupa logs relacionados
   */
  group(label: string, callback: () => void) {
    if (!this.isDevelopment) return callback();

    console.group(`🔹 ${label}`);
    callback();
    console.groupEnd();
  }

  /**
   * Log de dados estruturados (útil para debugging de objetos complexos)
   */
  table(data: any[], columns?: string[]) {
    if (!this.isDevelopment) return;

    console.table(data, columns);
  }
}

// Singleton instance
export const logger = new Logger();

// Exports individuais para conveniência
export const { debug, info, warn, error, performance, group, table } = logger;