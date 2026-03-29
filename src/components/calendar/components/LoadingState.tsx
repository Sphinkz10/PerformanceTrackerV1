/**
 * LOADING STATE
 * Beautiful skeleton loader for calendar
 */

import React from 'react';
import { motion } from 'motion/react';

interface LoadingStateProps {
  view?: 'week' | 'day' | 'month' | 'agenda' | 'team';
}

export function LoadingState({ view = 'week' }: LoadingStateProps) {
  if (view === 'week') {
    return (
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-7 gap-2 min-w-[800px] sm:min-w-0">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border-2 border-slate-200 bg-white p-3 min-h-[400px] space-y-3"
            >
              {/* Header skeleton */}
              <div className="pb-2 border-b border-slate-200 space-y-2">
                <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
              </div>
              
              {/* Event skeletons */}
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-20 bg-slate-100 rounded-lg animate-pulse"
                    style={{
                      animationDelay: `${(i * 3 + j) * 0.05}s`
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  if (view === 'agenda') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  // Default spinner
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-sky-200 rounded-full animate-spin" />
        <div className="absolute inset-0 h-16 w-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
