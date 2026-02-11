export function trackEvent(type: string, data: Record<string, unknown> = {}) {
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', JSON.stringify({ type, data }));
  }
}
