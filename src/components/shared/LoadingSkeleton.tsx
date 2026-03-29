/**
 * LOADING SKELETONS - Beautiful loading states
 * Various skeleton components for different content types
 */

'use client';

import { motion } from 'motion/react';

// ============================================================
// Base Skeleton
// ============================================================

export function Skeleton({ 
  className = '', 
  width, 
  height 
}: { 
  className?: string; 
  width?: string | number; 
  height?: string | number;
}) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

// ============================================================
// Metric Card Skeleton
// ============================================================

export function MetricCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton width={32} height={32} className="rounded-xl" />
        <Skeleton width={80} height={12} />
      </div>
      <Skeleton width="100%" height={32} className="mb-2" />
      <Skeleton width={60} height={10} />
    </div>
  );
}

// ============================================================
// Table Skeleton
// ============================================================

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b-2 border-slate-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="100%" height={16} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height={20} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// List Skeleton
// ============================================================

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
          <Skeleton width={48} height={48} className="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
          <Skeleton width={60} height={32} className="rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Chart Skeleton
// ============================================================

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton width={150} height={20} />
        <Skeleton width={80} height={32} className="rounded-lg" />
      </div>
      
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const randomHeight = Math.random() * 60 + 40;
          return (
            <Skeleton 
              key={i} 
              width="100%" 
              height={`${randomHeight}%`}
              className="rounded-t-lg"
            />
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <Skeleton width={100} height={12} />
        <Skeleton width={100} height={12} />
      </div>
    </div>
  );
}

// ============================================================
// Dashboard Skeleton
// ============================================================

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={200} height={28} />
          <Skeleton width={300} height={16} />
        </div>
        <Skeleton width={120} height={40} className="rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* List */}
      <ListSkeleton items={3} />
    </div>
  );
}

// ============================================================
// Page Skeleton
// ============================================================

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton width="100%" height={60} className="rounded-2xl" />
        <DashboardSkeleton />
      </div>
    </div>
  );
}

// ============================================================
// Athlete Card Skeleton
// ============================================================

export function AthleteCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-white border-2 border-slate-200">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton width={40} height={40} className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={12} />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height={10} />
        <Skeleton width="80%" height={10} />
      </div>
    </div>
  );
}

// ============================================================
// Widget Skeleton
// ============================================================

export function WidgetSkeleton({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const heights = {
    small: 150,
    medium: 200,
    large: 300,
  };

  return (
    <div 
      className="p-5 rounded-2xl bg-white border-2 border-slate-200"
      style={{ height: heights[size] }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Skeleton width={32} height={32} className="rounded-lg" />
        <Skeleton width={120} height={16} />
      </div>
      <div className="space-y-3">
        <Skeleton width="100%" height={24} />
        <Skeleton width="80%" height={20} />
        <Skeleton width="60%" height={20} />
      </div>
    </div>
  );
}

// ============================================================
// Form Skeleton
// ============================================================

export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width={100} height={14} />
          <Skeleton width="100%" height={40} className="rounded-xl" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton width={120} height={40} className="rounded-xl" />
        <Skeleton width={80} height={40} className="rounded-xl" />
      </div>
    </div>
  );
}

// ============================================================
// Add shimmer animation to global CSS
// ============================================================

// Add to globals.css:
/*
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
*/
