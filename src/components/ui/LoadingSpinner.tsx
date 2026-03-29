import { motion } from "motion/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "sky" | "emerald" | "violet" | "white";
  text?: string;
}

export function LoadingSpinner({ size = "md", color = "sky", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  const colorClasses = {
    sky: "border-sky-200 border-t-sky-600",
    emerald: "border-emerald-200 border-t-emerald-600",
    violet: "border-violet-200 border-t-violet-600",
    white: "border-white/30 border-t-white"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-600">{text}</p>}
    </div>
  );
}

// Skeleton Loader
export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonLoader className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonLoader className="h-20 w-full" />
      <div className="flex gap-2">
        <SkeletonLoader className="h-8 flex-1" />
        <SkeletonLoader className="h-8 flex-1" />
      </div>
    </div>
  );
}

// Full Page Loading
export function PageLoader({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <LoadingSpinner size="lg" text={message} />
      </motion.div>
    </div>
  );
}
