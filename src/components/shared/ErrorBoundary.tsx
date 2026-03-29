/**
 * ERROR BOUNDARY - Graceful error handling
 * Catches React errors and displays fallback UI
 */

'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
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

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
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
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            <div className="p-8 rounded-2xl bg-white border-2 border-red-200 shadow-xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-center text-slate-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-center text-slate-600 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Error Details:</h3>
                  <pre className="text-xs text-red-800 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs font-medium text-red-900 cursor-pointer hover:text-red-700">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-red-700 mt-2 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 transition-all"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </motion.button>
              </div>

              {/* Help Text */}
              <p className="text-center text-xs text-slate-500 mt-6">
                If this problem persists, please contact support with the error details above.
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
