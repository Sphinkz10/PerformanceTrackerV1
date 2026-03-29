/**
 * CALENDAR ERROR BOUNDARY
 * 
 * Catches errors in calendar components and shows friendly fallback UI
 * Prevents full app crash from calendar bugs
 * 
 * @version 1.0.0
 * @created 20 Janeiro 2026
 */

import React, { Component, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CalendarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calendar Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to error tracking service (Sentry, etc)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
              Oops! Algo deu errado
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-600 text-center mb-6">
              O calendário encontrou um erro inesperado. Não se preocupe, seus dados estão seguros.
            </p>

            {/* Error Details (dev mode) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs font-bold text-red-900 mb-2">
                  Error Details (dev mode):
                </p>
                <pre className="text-xs text-red-700 overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-red-600 overflow-x-auto mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-green-500 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
              >
                <Home className="h-4 w-4" />
                <span>Ir para Início</span>
              </motion.button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500 text-center mt-6">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
