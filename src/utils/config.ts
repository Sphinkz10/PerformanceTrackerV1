/**
 * Configuration Utilities
 * 
 * Provides safe access to environment variables and configuration.
 * 
 * @author PerformTrack Team
 * @since Fase 6 - Integration & Automation
 */

/**
 * Get the base URL for API calls
 * Works in both client and server contexts
 */
export function getBaseUrl(): string {
  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side - safe environment access
  try {
    // @ts-ignore
    if (process.env.VERCEL_URL) {
      // @ts-ignore
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // @ts-ignore
    if (process.env.NEXT_PUBLIC_APP_URL) {
      // @ts-ignore
      return process.env.NEXT_PUBLIC_APP_URL;
    }
  } catch {
    // Fallback if process is not defined
  }
  
  // Fallback to localhost
  return 'http://localhost:3000';
}

/**
 * Build a full API URL
 */
export function getApiUrl(path: string): string {
  const base = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}