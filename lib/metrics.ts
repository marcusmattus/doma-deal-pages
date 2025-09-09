'use client';

export function track(event: string, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  // PostHog/Plausible hooks here; keep no-op if not configured
  (window as any).posthog?.capture?.(event, props);
}