import { modifier } from 'ember-modifier';
import { later, cancel } from '@ember/runloop';

export default modifier(
  (element, positional, named) => {
    const refreshCallback = positional[0];
    const { interval = 120000 } = named;
    let refreshTimer = null;
    let isWindowActive = true;
    let lastRefreshTime = Date.now();

    const clearRefreshTimer = () => {
      if (refreshTimer) {
        cancel(refreshTimer);
        refreshTimer = null;
      }
    };

    const isDataStale = () => {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime;
      return timeSinceLastRefresh >= interval;
    };

    const scheduleRefresh = () => {
      clearRefreshTimer();

      if (isWindowActive) {
        refreshTimer = later(() => {
          lastRefreshTime = Date.now();
          if (typeof refreshCallback === 'function') {
            refreshCallback();
          }
          scheduleRefresh();
        }, interval);
      }
    };

    const handleWindowFocus = () => {
      isWindowActive = true;
      if (isDataStale()) {
        lastRefreshTime = Date.now();
        refreshCallback();
      } else {
        scheduleRefresh();
      }
    };

    const handleWindowBlur = () => {
      isWindowActive = false;
      clearRefreshTimer();
    };

    const handleVisibilityChange = () => {
      isWindowActive = !document.hidden;
      if (isWindowActive) {
        if (isDataStale()) {
          lastRefreshTime = Date.now();
          refreshCallback();
        } else {
          scheduleRefresh();
        }
      } else {
        clearRefreshTimer();
      }
    };

    // Set initial state based on document visibility
    if (typeof window !== 'undefined') {
      isWindowActive = !document.hidden;

      // Add event listeners
      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Start the refresh cycle
    scheduleRefresh();

    // Cleanup function
    return () => {
      clearRefreshTimer();
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      }
    };
  },
  { eager: false }
);
